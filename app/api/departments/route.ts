import { NextResponse } from "next/server";
import { db, dbError } from "@/app/api/_lib";

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
      "departments",
      "select=id,name&order=name"
    );
    return NextResponse.json(rows);
  } catch (error) {
    return dbError(error);
  }
}

export async function POST(req: Request) {
  try {
    const { name, actorNim } = (await req.json()) as {
      name?: string;
      actorNim?: string;
    };
    if (!(await isAdmin(actorNim))) {
      return NextResponse.json(
        { ok: false, message: "Hanya admin." },
        { status: 403 }
      );
    }
    const cleanName = (name ?? "").trim();
    if (!cleanName) {
      return NextResponse.json(
        { ok: false, message: "Nama departemen wajib diisi." },
        { status: 400 }
      );
    }
    const [created] = await db.insert<Record<string, unknown>>("departments", {
      name: cleanName,
    });
    return NextResponse.json({ ok: true, department: created }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message.includes("409") || message.includes("duplicate")) {
      return NextResponse.json(
        { ok: false, message: "Departemen sudah ada." },
        { status: 409 }
      );
    }
    return dbError(error);
  }
}

export async function DELETE(req: Request) {
  try {
    const { id, actorNim } = (await req.json()) as {
      id?: string;
      actorNim?: string;
    };
    if (!(await isAdmin(actorNim))) {
      return NextResponse.json(
        { ok: false, message: "Hanya admin." },
        { status: 403 }
      );
    }
    if (!id) {
      return NextResponse.json(
        { ok: false, message: "ID wajib diisi." },
        { status: 400 }
      );
    }
    await db.del("departments", `id=eq.${encodeURIComponent(id)}`);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return dbError(error);
  }
}
