import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/password";
import { db, dbError } from "@/app/api/_lib";

export async function POST(req: Request) {
  try {
    const { nim, name, department, password } = (await req.json()) as {
      nim?: string;
      name?: string;
      department?: string;
      password?: string;
    };
    const cleanNim = (nim ?? "").trim().toUpperCase();
    const cleanName = (name ?? "").trim();
    const cleanDepartment = (department ?? "").trim();
    if (!cleanNim || !cleanName || !cleanDepartment || !password) {
      return NextResponse.json(
        { ok: false, message: "Semua field wajib diisi." },
        { status: 400 }
      );
    }
    const existing = await db.select<Record<string, unknown>>(
      "users",
      `select=nim&nim=eq.${encodeURIComponent(cleanNim)}`
    );
    if (existing.length > 0) {
      return NextResponse.json(
        { ok: false, message: "NIM sudah terdaftar. Silakan login." },
        { status: 409 }
      );
    }
    await db.insert("users", {
      nim: cleanNim,
      name: cleanName,
      department: cleanDepartment,
      password_hash: hashPassword(password),
    });
    return NextResponse.json({ ok: true, message: "Akun berhasil dibuat." });
  } catch (error) {
    return dbError(error);
  }
}
