"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { MouseEvent } from "react";
import Avatar from "@/components/Avatar";
import type { Team } from "@/lib/team-types";

function AvatarStack({ extra }: { extra: string }) {
  return (
    <span className="flex items-center" aria-hidden="true">
      <span className="h-5 w-5 rounded-full bg-[#d7dde5] ring-2 ring-white" />
      <span className="-ml-2 h-5 w-5 rounded-full bg-[#c6ced8] ring-2 ring-white" />
      <span className="-ml-2 h-5 w-5 rounded-full bg-[#d7dde5] ring-2 ring-white" />
      <span className="ml-1.5 text-[15px] text-zinc-400">{extra}</span>
    </span>
  );
}

export type TeamCardStatus = "member" | "pending" | "joinable" | "blocked";

export default function TeamCard({
  team,
  status = "member",
  memberCount,
  blockedReason,
  onJoin,
}: {
  team: Team;
  /** member: Tim Saya (Buka+Chat) · pending: badge Menunggu · joinable: tombol Gabung · blocked: Gabung nonaktif */
  status?: TeamCardStatus;
  /** Jumlah anggota riil dari database lokal. Jika kosong, tampilkan angka dummy. */
  memberCount?: number;
  blockedReason?: string;
  onJoin?: () => void;
}) {
  // const percent = Math.round((team.tasksDone / team.tasksTotal) * 100);
  const router = useRouter();
  const canOpen = !team.isLocal;

  function handleCardClick(e: MouseEvent<HTMLElement>) {
    // Tombol di dalam kartu (Chat/Gabung/Buka) punya aksi sendiri.
    if ((e.target as HTMLElement).closest("button, a")) return;
    if (canOpen) router.push(`/teams/${team.id}`);
  }

  return (
    <article
      onClick={handleCardClick}
      className={`flex flex-col rounded-[20px] bg-white p-6 shadow-[0_2px_16px_rgba(30,60,110,0.06)] transition-shadow ${
        canOpen ? "cursor-pointer hover:shadow-[0_4px_24px_rgba(30,60,110,0.14)]" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <span aria-hidden="true" className="mt-1 h-2 w-6" />
        <span className="flex items-center gap-2">
          {status === "pending" && (
            <span className="rounded-full bg-[#fdf3e0] px-3 py-1 text-[13px] font-medium text-[#b07d10]">
              Menunggu
            </span>
          )}
          {team.scheme && (
            <span className="rounded-full bg-[#eef4fb] px-3 py-1 text-[13px] font-medium text-[#2f5d9a]">
              {team.scheme}
            </span>
          )}
          {team.isOwned && (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="#f5b301" aria-label="Tim yang Anda ketuai">
              <path d="M3 7 5.5 12h13L21 7l-4.5 3L12 4 7.5 10 3 7Zm2.7 7H18.3L19 19H5l.7-5Z" />
            </svg>
          )}
        </span>
      </div>

      <div className="flex items-start gap-4">
        <Avatar letter={team.title} variant="team" size={56} />
        <div className="min-w-0">
          <h2 className="text-[22px] font-bold leading-snug tracking-tight text-black">
            {team.title}
          </h2>
        </div>
      </div>

      {/* <div className="mt-5 flex items-center justify-between text-[15px] text-zinc-400">
        <span className="flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 6h16M4 12h16M4 18h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          {team.tasksDone}/{team.tasksTotal}
        </span>
        <span>({percent}% completed)</span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        className="mt-2 h-[6px] overflow-hidden rounded-full bg-[#e6ebf2]"
      >
        <div
          className="h-full rounded-full bg-[#2f5d9a]"
          style={{ width: `${percent}%` }}
        />
      </div> */}

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div>
          <p className="text-[15px] text-zinc-400">Anggota</p>
          <div className="mt-1.5">
            <AvatarStack
              extra={
                memberCount === undefined
                  ? team.memberExtra
                  : `${memberCount} orang`
              }
            />
          </div>
        </div>
        <div>
          <p className="text-[15px] text-zinc-400">Deadline</p>
          <p className="mt-1.5 flex items-center gap-2 text-[15px] text-black">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="3" y="5" width="18" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
              <path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            {team.deadline}
          </p>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        {team.isLocal ? (
          <span
            title="Halaman detail tersedia setelah data tim tersimpan permanen"
            className="flex h-[52px] flex-1 cursor-not-allowed items-center justify-center rounded-[10px] border border-zinc-300 text-[17px] font-medium text-zinc-400"
          >
            Buka Tim
          </span>
        ) : (
          <Link
            href={`/teams/${team.id}`}
            className="flex h-[52px] flex-1 items-center justify-center rounded-[10px] border border-[#2f5d9a] text-[17px] font-medium text-[#2f5d9a] transition-colors hover:bg-[#eef4fb]"
          >
            Buka Tim
          </Link>
        )}
        {status === "member" && (
          <button
            type="button"
            className="flex h-[52px] items-center gap-2 rounded-[10px] bg-[#2f5d9a] px-6 text-[17px] font-medium text-white transition-colors hover:bg-[#274d80]"
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
            Chat
          </button>
        )}
        {status === "pending" && (
          <span className="flex h-[52px] items-center rounded-[10px] bg-[#fdf3e0] px-6 text-[17px] font-medium text-[#b07d10]">
            Menunggu
          </span>
        )}
        {status === "joinable" && (
          <button
            type="button"
            onClick={onJoin}
            className="flex h-[52px] items-center rounded-[10px] bg-[#2f5d9a] px-6 text-[17px] font-medium text-white transition-colors hover:bg-[#274d80]"
          >
            Gabung
          </button>
        )}
        {status === "blocked" && (
          <span
            title={blockedReason ?? "Kamu sudah tergabung di tim lain"}
            className="flex h-[52px] cursor-not-allowed items-center rounded-[10px] bg-slate-100 px-6 text-[17px] font-medium text-zinc-400"
          >
            Gabung
          </span>
        )}
      </div>
    </article>
  );
}
