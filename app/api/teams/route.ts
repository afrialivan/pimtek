import { NextResponse } from "next/server";
import { db, dbError, mapTeam } from "@/app/api/_lib";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const query = id
      ? `select=*&id=eq.${encodeURIComponent(id)}`
      : "select=*&order=created_at";
    const rows = await db.select<Record<string, unknown>>("teams", query);
    return NextResponse.json(rows.map(mapTeam));
  } catch (error) {
    return dbError(error);
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      title?: string;
      ideaOverview?: string;
      scheme?: string;
      groupLink?: string;
      deadline?: string;
      leaderNim?: string;
    };
    const title = (body.title ?? "").trim();
    const ideaOverview = (body.ideaOverview ?? "").trim();
    const scheme = (body.scheme ?? "").trim();
    const groupLink = (body.groupLink ?? "").trim();
    const deadline = (body.deadline ?? "").trim();
    const leaderNim = (body.leaderNim ?? "").trim().toUpperCase();
    if (!title || !ideaOverview || !scheme || !groupLink || !deadline || !leaderNim) {
      return NextResponse.json(
        { error: "Semua field wajib diisi." },
        { status: 400 }
      );
    }
    // Aturan 1 tim.
    const existing = await db.select<unknown[]>(
      "memberships",
      `select=id&nim=eq.${encodeURIComponent(leaderNim)}`
    );
    if (existing.length > 0) {
      return NextResponse.json(
        { error: "Kamu sudah tergabung di 1 tim." },
        { status: 409 }
      );
    }
    const id = `tim-${Date.now()}`;
    const [team] = await db.insert<Record<string, unknown>>("teams", {
      id,
      title,
      scheme_id: scheme,
      group_link: groupLink,
      idea_overview: ideaOverview,
      about: ideaOverview,
      status: "Berjalan",
      leader_nim: leaderNim,
      created_at: new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      deadline,
    });
    await db.insert("memberships", {
      team_id: id,
      nim: leaderNim,
      role: "Leader",
    });
    return NextResponse.json(mapTeam(team), { status: 201 });
  } catch (error) {
    return dbError(error);
  }
}
