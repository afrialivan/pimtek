import { NextResponse } from "next/server";
import { db, dbError, mapMembership } from "@/app/api/_lib";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const nim = searchParams.get("nim");
    const teamId = searchParams.get("teamId");
    let query = "select=team_id,nim,role";
    if (nim && teamId) {
      query += `&nim=eq.${encodeURIComponent(nim)}&team_id=eq.${encodeURIComponent(teamId)}`;
    } else if (nim) {
      query += `&nim=eq.${encodeURIComponent(nim)}`;
    } else if (teamId) {
      query += `&team_id=eq.${encodeURIComponent(teamId)}`;
    }
    const rows = await db.select<Record<string, unknown>>(
      "memberships",
      query
    );
    return NextResponse.json(rows.map(mapMembership));
  } catch (error) {
    return dbError(error);
  }
}

export async function DELETE(req: Request) {
  try {
    const { teamId, nim, successorNim } = (await req.json()) as {
      teamId?: string;
      nim?: string;
      successorNim?: string;
    };
    if (!teamId || !nim) {
      return NextResponse.json(
        { error: "teamId dan nim wajib diisi." },
        { status: 400 }
      );
    }
    const mine = await db.select<Record<string, unknown>>(
      "memberships",
      `select=role&team_id=eq.${encodeURIComponent(teamId)}&nim=eq.${encodeURIComponent(nim)}`
    );
    const myRole = mine[0]?.role as string | undefined;
    if (!myRole) {
      return NextResponse.json(
        { error: "Kamu bukan anggota tim ini." },
        { status: 404 }
      );
    }
    if (myRole === "Leader") {
      // Ketua wajib mengoper peran ke anggota lain dulu.
      const others = await db.select<Record<string, unknown>>(
        "memberships",
        `select=nim&team_id=eq.${encodeURIComponent(teamId)}&nim=neq.${encodeURIComponent(nim)}`
      );
      if (others.length === 0) {
        return NextResponse.json(
          { error: "Kamu satu-satunya anggota. Hapus tim saja jika ingin keluar." },
          { status: 409 }
        );
      }
      const successor = (successorNim ?? "").trim();
      const valid = others.some((o) => o.nim === successor);
      if (!successor || !valid) {
        return NextResponse.json(
          { error: "Pilih anggota pengganti ketua dulu." },
          { status: 400 }
        );
      }
      await db.update(
        "memberships",
        `team_id=eq.${encodeURIComponent(teamId)}&nim=eq.${encodeURIComponent(successor)}`,
        { role: "Leader" }
      );
    }
    await db.del(
      "memberships",
      `team_id=eq.${encodeURIComponent(teamId)}&nim=eq.${encodeURIComponent(nim)}`
    );
    return NextResponse.json({ ok: true });
  } catch (error) {
    return dbError(error);
  }
}
