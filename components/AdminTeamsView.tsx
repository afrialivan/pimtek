"use client";

import Link from "next/link";
import { useState } from "react";
import { useLocalDb } from "@/components/LocalDbProvider";
import { useToast } from "@/components/Toast";

export default function AdminTeamsView() {
  const { ready, user, users, teams, memberships, deleteTeam } = useLocalDb();
  const toast = useToast();
  const [confirmId, setConfirmId] = useState<string | null>(null);

  if (!ready) {
    return <p className="text-[16px] text-zinc-500">Memuat...</p>;
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="rounded-[20px] bg-white p-10 text-center shadow-[0_2px_16px_rgba(30,60,110,0.06)]">
        <p className="text-[20px] font-bold text-black">Khusus admin</p>
        <p className="mt-2 text-[15px] text-zinc-500">
          Halaman ini hanya bisa diakses akun admin.
        </p>
      </div>
    );
  }

  function nameOf(nim: string) {
    return users.find((u) => u.nim === nim)?.name ?? nim;
  }

  function countOf(teamId: string) {
    return memberships.filter((m) => m.teamId === teamId).length;
  }

  function leaderOf(teamId: string) {
    const lead = memberships.find(
      (m) => m.teamId === teamId && m.role === "Leader"
    );
    return lead ? `${nameOf(lead.nim)} (${lead.nim})` : "-";
  }

  function handleDelete(teamId: string) {
    void (async () => {
      const res = await deleteTeam(teamId);
      if (!res.ok) {
        toast.error(res.message);
        return;
      }
      setConfirmId(null);
      toast.success("Tim dihapus.");
    })();
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-[28px] font-bold tracking-tight text-black sm:text-[36px]">
          Kelola Tim
        </h1>
        <p className="text-[15px] text-zinc-500">
          {teams.length} tim terdaftar. Menghapus tim membuat semua anggotanya
          tanpa tim.
        </p>
      </div>

      {teams.length === 0 ? (
        <p className="rounded-[20px] bg-white p-10 text-center text-[16px] text-zinc-500">
          Belum ada tim.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {teams.map((team) => (
            <li
              key={team.id}
              className="rounded-[20px] bg-white p-5 shadow-[0_2px_16px_rgba(30,60,110,0.06)]"
            >
              <div className="flex flex-wrap items-center gap-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[18px] font-bold text-black">
                    {team.title}
                  </p>
                  <p className="mt-1 flex flex-wrap gap-x-3 text-[14px] text-zinc-500">
                    {team.scheme && <span>{team.scheme}</span>}
                    <span>Ketua: {leaderOf(team.id)}</span>
                    <span>{countOf(team.id)} anggota</span>
                    <span>{team.createdAt}</span>
                  </p>
                </div>
                {confirmId === team.id ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[14px] font-medium text-black">
                      Yakin hapus?
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDelete(team.id)}
                      className="rounded-[10px] bg-[#b3261e] px-5 py-2 text-[15px] font-medium text-white transition-colors hover:bg-[#8f1d1d]"
                    >
                      Ya, Hapus
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmId(null)}
                      className="rounded-[10px] border border-[#c9d4e2] px-5 py-2 text-[15px] font-medium text-zinc-600 transition-colors hover:bg-slate-50"
                    >
                      Batal
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Link
                      href={`/teams/${team.id}`}
                      className="rounded-[10px] border border-[#2f5d9a] px-5 py-2 text-[15px] font-medium text-[#2f5d9a] transition-colors hover:bg-[#eef4fb]"
                    >
                      Detail
                    </Link>
                    <button
                      type="button"
                      onClick={() => setConfirmId(team.id)}
                      className="rounded-[10px] border border-[#b3261e] px-5 py-2 text-[15px] font-medium text-[#b3261e] transition-colors hover:bg-[#fdf0ef]"
                    >
                      Hapus
                    </button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
