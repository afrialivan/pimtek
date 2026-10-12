import { NextResponse } from "next/server";
import { db, dbError, mapTeam } from "@/app/api/_lib";

const ALLOWED = new Set([
  "title",
  "idea_overview",
  "scheme_id",
  "group_link",
  "deadline",
  "status",
  "about",
]);

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { actorNim, patch } = (await req.json()) as {
      actorNim?: string;
      patch?: Record<string, string>;
    };
    if (!actorNim || !patch || typeof patch !== "object") {
      return NextResponse.json(
        { ok: false, message: "Parameter tidak valid." },
        { status: 400 }
      );
    }
    // Hanya ketua tim yang boleh mengedit.
    const leaders = await db.select<Record<string, unknown>>(
      "memberships",
      `select=nim&team_id=eq.${encodeURIComponent(id)}&nim=eq.${encodeURIComponent(actorNim)}&role=eq.Leader`
    );
    if (leaders.length === 0) {
      return NextResponse.json(
        { ok: false, message: "Hanya ketua tim yang bisa mengedit info." },
        { status: 403 }
      );
    }
    const clean: Record<string, string> = {};
    for (const [key, value] of Object.entries(patch)) {
      if (ALLOWED.has(key) && typeof value === "string") clean[key] = value;
    }
    if (Object.keys(clean).length === 0) {
      return NextResponse.json(
        { ok: false, message: "Tidak ada perubahan." },
        { status: 400 }
      );
    }
    if (clean.idea_overview && !clean.about) clean.about = clean.idea_overview;
    const [updated] = await db.update<Record<string, unknown>>(
      "teams",
      `id=eq.${encodeURIComponent(id)}`,
      clean
    );
    if (!updated) {
      return NextResponse.json(
        { ok: false, message: "Tim tidak ditemukan." },
        { status: 404 }
      );
    }
    return NextResponse.json({ ok: true, team: mapTeam(updated) });
  } catch (error) {
    return dbError(error);
  }
}

async function canDeleteTeam(
  teamId: string,
  actorNim: string
): Promise<boolean> {
  const userRows = await db.select<Record<string, unknown>>(
    "users",
    `select=role&nim=eq.${encodeURIComponent(actorNim)}`
  );
  if (userRows[0]?.role === "admin") return true;
  const leaders = await db.select<Record<string, unknown>>(
    "memberships",
    `select=nim&team_id=eq.${encodeURIComponent(teamId)}&nim=eq.${encodeURIComponent(actorNim)}&role=eq.Leader`
  );
  return leaders.length > 0;
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { actorNim } = (await req.json()) as { actorNim?: string };
    if (!actorNim) {
      return NextResponse.json(
        { ok: false, message: "Parameter tidak valid." },
        { status: 400 }
      );
    }
    if (!(await canDeleteTeam(id, actorNim))) {
      return NextResponse.json(
        { ok: false, message: "Hanya admin atau ketua tim yang bisa menghapus." },
        { status: 403 }
      );
    }
    await db.del("teams", `id=eq.${encodeURIComponent(id)}`);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return dbError(error);
  }
}
