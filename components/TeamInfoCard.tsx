"use client";

import { useLocalDb } from "@/components/LocalDbProvider";
import type { Team } from "@/lib/team-types";

export default function TeamInfoCard({ team }: { team: Team }) {
  const { ready, memberships, users, user } = useLocalDb();

  const teamMembers = ready
    ? memberships.filter((m) => m.teamId === team.id)
    : [];
  const leaderNim = teamMembers.find((m) => m.role === "Leader")?.nim;
  const leader = leaderNim
    ? (users.find((u) => u.nim === leaderNim)?.name ?? leaderNim)
    : null;
  const isMember = user
    ? teamMembers.some((m) => m.nim === user.nim)
    : false;

  return (
    <section className="rounded-[20px] bg-white p-7 shadow-[0_2px_16px_rgba(30,60,110,0.06)]">
      <h2 className="text-[24px] font-bold text-[#2f5d9a]">Team Info</h2>
      <dl className="mt-4 flex flex-col gap-2.5 text-[15px]">
        <div className="flex justify-between gap-4">
          <dt className="tracking-wide text-zinc-400">STATUS</dt>
          <dd className="text-zinc-500">{team.status}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="tracking-wide text-zinc-400">ANGGOTA</dt>
          <dd className="text-zinc-500">
            {ready ? `${teamMembers.length} orang` : "..."}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="tracking-wide text-zinc-400">DIKETUAI OLEH</dt>
          <dd className="text-right text-zinc-500">
            {!ready ? "..." : (leader ?? "Belum ada ketua")}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="tracking-wide text-zinc-400">TANGGAL DIBUAT</dt>
          <dd className="text-zinc-500">{team.createdAt}</dd>
        </div>
      </dl>
      {isMember && team.groupLink && (
        <a
          href={team.groupLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 flex h-[52px] items-center justify-center gap-2 rounded-[10px] bg-[#22a55b] text-[16px] font-medium text-white transition-colors hover:bg-[#1c8a4c]"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.7-1.2A9 9 0 1 0 12 3Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <path
              d="M9 9.8c.5 2.3 2.9 4.7 5.2 5.2l1-1.3 2 1c-.5 1.7-1.4 2-2.7 1.6-3.2-.9-6.5-4.2-7.4-7.4-.4-1.3-.1-2.2 1.6-2.7l1 2L9 9.8Z"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
          </svg>
          Masuk Grup WA
        </a>
      )}
    </section>
  );
}
