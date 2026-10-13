"use client";

import Link from "next/link";
import Avatar from "@/components/Avatar";
import { useLocalDb } from "@/components/LocalDbProvider";
import { formatTanggal } from "@/lib/format-date";
import { isProfileIncomplete } from "@/lib/team-types";
import { ContentSkeleton } from "@/components/Skeleton";

function statusChip(status: string) {
  if (status === "approved")
    return (
      <span className="shrink-0 rounded-full bg-[#e5f5df] px-3 py-1 text-[13px] font-medium text-[#3d7a34]">
        Diterima
      </span>
    );
  if (status === "rejected")
    return (
      <span className="shrink-0 rounded-full bg-[#fde4e4] px-3 py-1 text-[13px] font-medium text-[#8f1d1d]">
        Ditolak
      </span>
    );
  return (
    <span className="shrink-0 rounded-full bg-[#fdf3e0] px-3 py-1 text-[13px] font-medium text-[#b07d10]">
      Menunggu
    </span>
  );
}

export default function NotificationsView() {
  const { ready, user, memberships, requests, teams } = useLocalDb();

  if (!ready) {
    return <ContentSkeleton />;
  }

  if (!user) return null;

  const teamTitle = (id: string) =>
    teams.find((t) => t.id === id)?.title ?? id;

  const ledTeamIds = memberships
    .filter((m) => m.nim === user.nim && m.role === "Leader")
    .map((m) => m.teamId);
  const incoming = requests.filter(
    (r) => ledTeamIds.includes(r.teamId) && r.status === "pending"
  );
  const mine = requests
    .filter((r) => r.nim === user.nim)
    .slice()
    .reverse();

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-[28px] font-bold tracking-tight text-black sm:text-[36px]">
          Notifikasi
        </h1>
        <p className="text-[15px] text-zinc-500">
          Permintaan masuk dan status permintaanmu.
        </p>
      </div>

      <section className="rounded-[20px] bg-white p-7 shadow-[0_2px_16px_rgba(30,60,110,0.06)]">
        <h2 className="text-[20px] font-bold text-[#2f5d9a]">Profil</h2>
        {user && isProfileIncomplete(user) ? (
          <Link
            href="/profil"
            className="mt-3 flex items-center gap-3 rounded-[12px] border border-[#f0d9a8] bg-[#fdf6e7] p-4 transition-colors hover:bg-[#fdf0d8]"
          >
            <span className="min-w-0 flex-1 text-[15px] text-black">
              <strong>Data dirimu belum lengkap.</strong> Isi bio, skills, dan
              pengalaman agar mudah dilirik ketua tim.
            </span>
            <span className="shrink-0 rounded-[10px] bg-[#b07d10] px-4 py-2 text-[14px] font-medium text-white">
              Isi
            </span>
          </Link>
        ) : (
          <p className="mt-3 rounded-[12px] bg-slate-50 p-4 text-[15px] text-zinc-500">
            Data dirimu sudah lengkap.
          </p>
        )}
      </section>

      <section className="rounded-[20px] bg-white p-7 shadow-[0_2px_16px_rgba(30,60,110,0.06)]">
        <h2 className="text-[20px] font-bold text-[#2f5d9a]">
          Perlu tindakan ({incoming.length})
        </h2>
        {incoming.length === 0 ? (
          <p className="mt-3 rounded-[12px] bg-slate-50 p-4 text-[15px] text-zinc-500">
            Tidak ada permintaan bergabung yang menunggu.
          </p>
        ) : (
          <ul className="mt-4 flex flex-col gap-3">
            {incoming.map((req) => (
              <li key={req.id}>
                <Link
                  href={`/teams/${req.teamId}`}
                  className="flex items-center gap-3 rounded-[12px] border border-[#eef1f5] p-4 transition-colors hover:bg-slate-50"
                >
                  <Avatar letter={req.name} variant="user" size={48} />
                  <span className="min-w-0 leading-tight">
                    <span className="block truncate text-[15px] text-black">
                      <strong>{req.name}</strong> meminta bergabung ke{" "}
                      <strong>{teamTitle(req.teamId)}</strong>
                    </span>
                    <span className="block text-[13px] text-zinc-500">
                      {req.nim} · {formatTanggal(req.createdAt)}
                    </span>
                  </span>
                  {statusChip(req.status)}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-[20px] bg-white p-7 shadow-[0_2px_16px_rgba(30,60,110,0.06)]">
        <h2 className="text-[20px] font-bold text-[#2f5d9a]">
          Permintaanku ({mine.length})
        </h2>
        {mine.length === 0 ? (
          <p className="mt-3 rounded-[12px] bg-slate-50 p-4 text-[15px] text-zinc-500">
            Kamu belum pernah meminta bergabung ke tim mana pun.
          </p>
        ) : (
          <ul className="mt-4 flex flex-col gap-3">
            {mine.map((req) => (
              <li key={req.id}>
                <Link
                  href={`/teams/${req.teamId}`}
                  className="flex items-center gap-3 rounded-[12px] border border-[#eef1f5] p-4 transition-colors hover:bg-slate-50"
                >
                  <span className="min-w-0 flex-1 leading-tight">
                    <span className="block truncate text-[15px] text-black">
                      {teamTitle(req.teamId)}
                    </span>
                    <span className="block text-[13px] text-zinc-500">
                      {formatTanggal(req.createdAt)}
                    </span>
                  </span>
                  {statusChip(req.status)}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
