import { NextResponse } from "next/server";
import { db, dbError } from "@/app/api/_lib";

// Dev-only: kembalikan DB ke seed awal (hapus baris non-seed).
// Dipakai tombol Reset di /admin/db.
const SEED_TEAM_IDS = [
  "hcs-schematic",
  "ijazah",
  "born-to-say",
  "stigmaboy",
  "icc-pisang-molen",
  "residivis",
  "probstat",
  "petir",
  "antek-aseng",
];

const SEED_NIMS = [
  "ADMIN001",
  "D041231098",
  "D041231099",
  "D041231100",
  "D041231101",
  "D041231102",
  "D041231103",
];

const SEED_DEPARTMENTS = new Set(
  [
    "Arsitektur",
    "Informatika",
    "Teknik Elektro",
    "Teknik Geologi",
    "Teknik Industri",
    "Teknik Lingkungan",
    "Teknik Mesin",
    "Teknik Perkapalan",
    "Teknik Sipil",
  ]
);

const SEED_MEMBERSHIPS = new Set(
  [
    "hcs-schematic|D041231098",
    "ijazah|D041231100",
    "ijazah|D041231101",
    "born-to-say|D041231101",
    "stigmaboy|D041231102",
    "stigmaboy|D041231101",
    "icc-pisang-molen|D041231103",
    "residivis|D041231100",
    "residivis|D041231103",
    "probstat|D041231103",
    "probstat|D041231100",
    "petir|D041231101",
    "antek-aseng|D041231102",
    "antek-aseng|D041231103",
  ].map((s) => s)
);

export async function POST() {
  try {
    // Hapus semua request.
    const requests = await db.select<Record<string, unknown>>(
      "join_requests",
      "select=id"
    );
    for (const r of requests) {
      await db.del("join_requests", `id=eq.${encodeURIComponent(r.id as string)}`);
    }
    // Hapus membership non-seed.
    const memberships = await db.select<Record<string, unknown>>(
      "memberships",
      "select=team_id,nim"
    );
    for (const m of memberships) {
      const key = `${m.team_id}|${m.nim}`;
      if (!SEED_MEMBERSHIPS.has(key)) {
        await db.del(
          "memberships",
          `team_id=eq.${encodeURIComponent(m.team_id as string)}&nim=eq.${encodeURIComponent(m.nim as string)}`
        );
      }
    }
    // Hapus tim non-seed.
    const teams = await db.select<Record<string, unknown>>(
      "teams",
      "select=id"
    );
    for (const t of teams) {
      if (!SEED_TEAM_IDS.includes(t.id as string)) {
        await db.del("teams", `id=eq.${encodeURIComponent(t.id as string)}`);
      }
    }
    // Hapus user non-seed.
    const users = await db.select<Record<string, unknown>>(
      "users",
      "select=nim"
    );
    for (const u of users) {
      if (!SEED_NIMS.includes(u.nim as string)) {
        await db.del("users", `nim=eq.${encodeURIComponent(u.nim as string)}`);
      }
    }
    // Hapus departments non-seed.
    const departments = await db.select<Record<string, unknown>>(
      "departments",
      "select=id,name"
    );
    for (const d of departments) {
      const key = d.name as string;
      if (!SEED_DEPARTMENTS.has(key)) {
        await db.del("departments", `id=eq.${encodeURIComponent(d.id as string)}`);
      }
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    return dbError(error);
  }
}
