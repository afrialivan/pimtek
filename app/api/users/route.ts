import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/password";
import { db, dbError } from "@/app/api/_lib";

const PUBLIC_COLS = "nim,name,department,role,bio,skills,interests,experiences";

async function isAdmin(nim: string | undefined): Promise<boolean> {
  if (!nim) return false;
  const rows = await db.select<Record<string, unknown>>(
    "users",
    `select=role&nim=eq.${encodeURIComponent(nim)}`
  );
  return rows[0]?.role === "admin";
}

export async function GET() {
  try {
    const rows = await db.select<Record<string, unknown>>(
      "users",
      `select=${PUBLIC_COLS}&order=nim`
    );
    return NextResponse.json(rows);
  } catch (error) {
    return dbError(error);
  }
}

export async function PATCH(req: Request) {
  try {
    const body = (await req.json()) as {
      nim?: string;
      actorNim?: string;
      bio?: string;
      skills?: string;
      interests?: string;
      experiences?: string;
      name?: string;
      department?: string;
      role?: string;
      newPassword?: string;
    };
    const cleanNim = (body.nim ?? "").trim().toUpperCase();
    if (!cleanNim) {
      return NextResponse.json(
        { ok: false, message: "NIM wajib diisi." },
        { status: 400 }
      );
    }
    const patch: Record<string, string> = {};
    if (typeof body.bio === "string") patch.bio = body.bio;
    if (typeof body.skills === "string") patch.skills = body.skills;
    if (typeof body.interests === "string") patch.interests = body.interests;
    if (typeof body.experiences === "string") patch.experiences = body.experiences;

    // Mode admin: bisa ubah identitas, role, dan reset password user lain.
    if (body.actorNim) {
      if (!(await isAdmin(body.actorNim))) {
        return NextResponse.json(
          { ok: false, message: "Hanya admin." },
          { status: 403 }
        );
      }
      if (typeof body.name === "string" && body.name.trim())
        patch.name = body.name.trim();
      if (typeof body.department === "string" && body.department.trim())
        patch.department = body.department.trim();
      if (body.role === "admin" || body.role === "user") patch.role = body.role;
      if (typeof body.newPassword === "string" && body.newPassword)
        patch.password_hash = hashPassword(body.newPassword);
    }

    if (Object.keys(patch).length === 0) {
      return NextResponse.json(
        { ok: false, message: "Tidak ada perubahan." },
        { status: 400 }
      );
    }
    const updated = await db.update<Record<string, unknown>>(
      "users",
      `nim=eq.${encodeURIComponent(cleanNim)}`,
      patch
    );
    if (updated.length === 0) {
      return NextResponse.json(
        { ok: false, message: "User tidak ditemukan." },
        { status: 404 }
      );
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    return dbError(error);
  }
}

export async function DELETE(req: Request) {
  try {
    const { nim, actorNim } = (await req.json()) as {
      nim?: string;
      actorNim?: string;
    };
    if (!(await isAdmin(actorNim))) {
      return NextResponse.json(
        { ok: false, message: "Hanya admin." },
        { status: 403 }
      );
    }
    const cleanNim = (nim ?? "").trim().toUpperCase();
    if (!cleanNim) {
      return NextResponse.json(
        { ok: false, message: "NIM wajib diisi." },
        { status: 400 }
      );
    }
    const memberOf = await db.select<Record<string, unknown>>(
      "memberships",
      `select=team_id&nim=eq.${encodeURIComponent(cleanNim)}`
    );
    if (memberOf.length > 0) {
      return NextResponse.json(
        { ok: false, message: "User masih punya tim. Keluarkan dulu." },
        { status: 409 }
      );
    }
    await db.del("join_requests", `nim=eq.${encodeURIComponent(cleanNim)}`);
    await db.del("users", `nim=eq.${encodeURIComponent(cleanNim)}`);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return dbError(error);
  }
}
