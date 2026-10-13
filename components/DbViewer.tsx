"use client";

import { useState } from "react";
import { useLocalDb } from "@/components/LocalDbProvider";
import { ContentSkeleton } from "@/components/Skeleton";

function Table({
  title,
  source,
  columns,
  rows,
}: {
  title: string;
  source: string;
  columns: { key: string; label: string }[];
  rows: object[];
}) {
  return (
    <section className="rounded-[20px] bg-white p-7 shadow-[0_2px_16px_rgba(30,60,110,0.06)]">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-[22px] font-bold text-[#2f5d9a]">{title}</h2>
        <span className="rounded-full bg-[#eef4fb] px-3 py-1 font-mono text-[13px] text-[#2f5d9a]">
          {source} · {rows.length} baris
        </span>
      </div>
      {rows.length === 0 ? (
        <p className="mt-4 rounded-[12px] bg-slate-50 p-4 text-[15px] text-zinc-500">
          Kosong.
        </p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-left text-[14px]">
            <thead>
              <tr className="border-b border-[#e2e9f2] text-zinc-500">
                {columns.map((col) => (
                  <th key={col.key} className="px-3 py-2 font-medium">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-b border-slate-100 text-black">
                  {columns.map((col) => (
                    <td key={col.key} className="max-w-[280px] truncate px-3 py-2">
                      {String(
                        (row as Record<string, unknown>)[col.key] ?? "-"
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default function DbViewer() {
  const { ready, dbError, user, users, teams, departments, memberships, requests, resetDatabase } =
    useLocalDb();
  const [resetting, setResetting] = useState(false);

  function handleReset() {
    if (
      !window.confirm(
        "Reset database ke seed awal? Data buatanmu akan hilang."
      )
    )
      return;
    setResetting(true);
    void resetDatabase().finally(() => setResetting(false));
  }

  if (!ready) {
    return <ContentSkeleton />;
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold tracking-tight text-black sm:text-[36px]">
            Database Supabase
          </h1>
          <p className="text-[15px] text-zinc-500">
            Data live dari Supabase. Login sebagai: {user?.name ?? "-"} (
            {user?.nim ?? "-"}). Password tidak ditampilkan.
          </p>
        </div>
        <button
          type="button"
          onClick={handleReset}
          disabled={resetting}
          className="h-[48px] rounded-[10px] border border-[#b3261e] px-6 text-[16px] font-medium text-[#b3261e] transition-colors hover:bg-[#fdf0ef] disabled:opacity-50"
        >
          {resetting ? "Mereset..." : "Reset ke Seed"}
        </button>
      </div>

      {dbError && (
        <p role="alert" className="rounded-[14px] bg-[#fde4e4] px-4 py-3 text-[15px] text-[#8f1d1d]">
          {dbError} Isi SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY di .env.local
          lalu restart dev server.
        </p>
      )}

      <Table
        title="Users"
        source="users"
        columns={[
          { key: "nim", label: "NIM" },
          { key: "name", label: "Nama" },
          { key: "department", label: "Departemen" },
          { key: "role", label: "Role" },
        ]}
        rows={users}
      />
      <Table
        title="Teams"
        source="teams"
        columns={[
          { key: "id", label: "ID" },
          { key: "title", label: "Judul Ide" },
          { key: "scheme", label: "Skim" },
          { key: "leader", label: "Ketua (NIM)" },
          { key: "deadline", label: "Deadline" },
        ]}
        rows={teams}
      />
      <Table
        title="Departments"
        source="departments"
        columns={[{ key: "name", label: "Departemen" }]}
        rows={departments}
      />
      <Table
        title="Memberships"
        source="memberships"
        columns={[
          { key: "teamId", label: "Team ID" },
          { key: "nim", label: "NIM" },
          { key: "role", label: "Role" },
        ]}
        rows={memberships}
      />
      <Table
        title="Join Requests"
        source="join_requests"
        columns={[
          { key: "id", label: "ID" },
          { key: "teamId", label: "Team ID" },
          { key: "nim", label: "NIM" },
          { key: "name", label: "Nama" },
          { key: "status", label: "Status" },
          { key: "createdAt", label: "Dibuat" },
        ]}
        rows={requests}
      />
    </div>
  );
}
