import { NextResponse } from "next/server";
import { verifyPassword } from "@/lib/password";
import { db, dbError } from "@/app/api/_lib";

export async function POST(req: Request) {
  try {
    const { nim, password } = (await req.json()) as {
      nim?: string;
      password?: string;
    };
    const cleanNim = (nim ?? "").trim().toUpperCase();
    if (!cleanNim || !password) {
      return NextResponse.json(
        { ok: false, message: "NIM dan password wajib diisi." },
        { status: 400 }
      );
    }
    const rows = await db.select<Record<string, unknown>>(
      "users",
      `select=nim,name,department,role,bio,skills,interests,experiences,password_hash&nim=eq.${encodeURIComponent(cleanNim)}`
    );
    const row = rows[0];
    if (!row || !verifyPassword(password, row.password_hash as string)) {
      return NextResponse.json(
        { ok: false, message: "NIM atau password salah." },
        { status: 401 }
      );
    }
    return NextResponse.json({
      ok: true,
      user: {
        nim: row.nim,
        name: row.name,
        department: (row.department as string) ?? "",
        role: (row.role as string) ?? "user",
        bio: (row.bio as string) ?? "",
        skills: (row.skills as string) ?? "",
        interests: (row.interests as string) ?? "",
        experiences: (row.experiences as string) ?? "",
      },
    });
  } catch (error) {
    return dbError(error);
  }
}
