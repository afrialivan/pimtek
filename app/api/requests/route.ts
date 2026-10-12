import { NextResponse } from "next/server";
import { db, dbError, mapRequest } from "@/app/api/_lib";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const nim = searchParams.get("nim");
    const teamId = searchParams.get("teamId");
    const pendingOnly = searchParams.get("pending") !== "0";
    let query = "select=*&order=created_at.desc";
    const filters: string[] = [];
    if (nim) filters.push(`nim=eq.${encodeURIComponent(nim)}`);
    if (teamId) filters.push(`team_id=eq.${encodeURIComponent(teamId)}`);
    if (pendingOnly) filters.push("status=eq.pending");
    if (filters.length > 0) query += `&${filters.join("&")}`;
    const rows = await db.select<Record<string, unknown>>(
      "join_requests",
      query
    );
    return NextResponse.json(rows.map(mapRequest));
  } catch (error) {
    return dbError(error);
  }
}

export async function POST(req: Request) {
  try {
    const { teamId, nim } = (await req.json()) as {
      teamId?: string;
      nim?: string;
    };
    if (!teamId || !nim) {
      return NextResponse.json(
        { ok: false, reason: "invalid", message: "teamId dan nim wajib diisi." },
        { status: 400 }
      );
    }
    // Aturan 1 tim.
    const memberOf = await db.select<unknown[]>(
      "memberships",
      `select=id&nim=eq.${encodeURIComponent(nim)}`
    );
    if (memberOf.length > 0) {
      return NextResponse.json(
        { ok: false, reason: "member" },
        { status: 409 }
      );
    }
    const pending = await db.select<unknown[]>(
      "join_requests",
      `select=id&nim=eq.${encodeURIComponent(nim)}&status=eq.pending`
    );
    if (pending.length > 0) {
      return NextResponse.json(
        { ok: false, reason: "pending" },
        { status: 409 }
      );
    }
    const userRows = await db.select<Record<string, unknown>>(
      "users",
      `select=name&nim=eq.${encodeURIComponent(nim)}`
    );
    const [created] = await db.insert<Record<string, unknown>>(
      "join_requests",
      {
        team_id: teamId,
        nim,
        name: (userRows[0]?.name as string) ?? nim,
        status: "pending",
      }
    );
    return NextResponse.json(
      { ok: true, request: mapRequest(created) },
      { status: 201 }
    );
  } catch (error) {
    return dbError(error);
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, action, actorNim } = (await req.json()) as {
      id?: string;
      action?: "approve" | "reject";
      actorNim?: string;
    };
    if (!id || (action !== "approve" && action !== "reject") || !actorNim) {
      return NextResponse.json(
        { ok: false, message: "Parameter tidak valid." },
        { status: 400 }
      );
    }
    const rows = await db.select<Record<string, unknown>>(
      "join_requests",
      `select=*&id=eq.${encodeURIComponent(id)}`
    );
    const target = rows[0];
    if (!target || target.status !== "pending") {
      return NextResponse.json(
        { ok: false, message: "Request tidak ditemukan." },
        { status: 404 }
      );
    }
    // Hanya ketua tim atau admin yang boleh memproses.
    const userRows = await db.select<Record<string, unknown>>(
      "users",
      `select=role&nim=eq.${encodeURIComponent(actorNim)}`
    );
    const isAdmin = userRows[0]?.role === "admin";
    if (!isAdmin) {
      const leaders = await db.select<unknown[]>(
        "memberships",
        `select=id&team_id=eq.${encodeURIComponent(target.team_id as string)}&nim=eq.${encodeURIComponent(actorNim)}&role=eq.Leader`
      );
      if (leaders.length === 0) {
        return NextResponse.json(
          { ok: false, message: "Hanya ketua tim yang bisa memproses." },
          { status: 403 }
        );
      }
    }
    if (action === "reject") {
      await db.update("join_requests", `id=eq.${encodeURIComponent(id)}`, {
        status: "rejected",
      });
      return NextResponse.json({ ok: true });
    }
    // Approve: target tidak boleh sudah punya tim (aturan 1 tim).
    const memberOf = await db.select<unknown[]>(
      "memberships",
      `select=id&nim=eq.${encodeURIComponent(target.nim as string)}`
    );
    if (memberOf.length > 0) {
      await db.update("join_requests", `id=eq.${encodeURIComponent(id)}`, {
        status: "rejected",
      });
      return NextResponse.json(
        { ok: false, message: "Pendaftar sudah punya tim. Request ditolak otomatis." },
        { status: 409 }
      );
    }
    await db.update("join_requests", `id=eq.${encodeURIComponent(id)}`, {
      status: "approved",
    });
    await db.insert("memberships", {
      team_id: target.team_id,
      nim: target.nim,
      role: "Anggota",
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return dbError(error);
  }
}

export async function DELETE(req: Request) {
  try {
    const { teamId, nim } = (await req.json()) as {
      teamId?: string;
      nim?: string;
    };
    if (!teamId || !nim) {
      return NextResponse.json(
        { error: "teamId dan nim wajib diisi." },
        { status: 400 }
      );
    }
    await db.del(
      "join_requests",
      `team_id=eq.${encodeURIComponent(teamId)}&nim=eq.${encodeURIComponent(nim)}&status=eq.pending`
    );
    return NextResponse.json({ ok: true });
  } catch (error) {
    return dbError(error);
  }
}
