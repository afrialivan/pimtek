import { NextResponse } from "next/server";
import { db, SupabaseNotConfiguredError } from "@/lib/supabase-server";
import type { Team } from "@/lib/team-types";

export function dbError(error: unknown) {
  if (error instanceof SupabaseNotConfiguredError) {
    return NextResponse.json({ error: error.message }, { status: 503 });
  }
  const message = error instanceof Error ? error.message : "Terjadi kesalahan server.";
  return NextResponse.json({ error: message }, { status: 500 });
}

// Baris snake_case Supabase -> camelCase aplikasi.
export function mapTeam(row: Record<string, unknown>): Team {
  return {
    id: row.id as string,
    title: (row.title as string) ?? "",
    scheme: (row.scheme_id as string | null) ?? undefined,
    groupLink: (row.group_link as string | null) ?? undefined,
    ideaOverview: (row.idea_overview as string | null) ?? undefined,
    about: (row.about as string) ?? "",
    status: (row.status as string) ?? "Berjalan",
    leader: (row.leader_nim as string) ?? "",
    createdAt: (row.created_at as string) ?? "",
    deadline: (row.deadline as string) ?? "",
    tasksDone: 0,
    tasksTotal: 15,
    memberExtra: "+0",
  };
}

export function mapMembership(row: Record<string, unknown>) {
  return { teamId: row.team_id, nim: row.nim, role: row.role };
}

export function mapRequest(row: Record<string, unknown>) {
  return {
    id: row.id,
    teamId: row.team_id,
    nim: row.nim,
    name: row.name,
    status: row.status,
    createdAt: row.created_at,
  };
}

export { db };
