"use client";

import { useState } from "react";
import Avatar from "@/components/Avatar";
import { useLocalDb } from "@/components/LocalDbProvider";
import ProfileModal from "@/components/ProfileModal";

export default function TeamMembersList({ teamId }: { teamId: string }) {
  const { ready, memberships, users } = useLocalDb();
  const [selectedNim, setSelectedNim] = useState<string | null>(null);

  if (!ready) {
    return <p className="mt-5 text-[15px] text-zinc-400">Memuat anggota...</p>;
  }

  const members = memberships
    .filter((m) => m.teamId === teamId)
    .map((m) => ({
      ...m,
      user: users.find((u) => u.nim === m.nim),
    }))
    .sort((a, b) => (b.role === "Leader" ? 1 : 0) - (a.role === "Leader" ? 1 : 0));

  if (members.length === 0) {
    return (
      <p className="mt-5 rounded-[12px] bg-slate-50 p-4 text-[15px] text-zinc-500">
        Belum ada anggota di tim ini.
      </p>
    );
  }

  return (
    <>
      <ul className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-1">
        {members.map((member) => (
          <li key={`${member.teamId}-${member.nim}`}>
            <button
              type="button"
              onClick={() => setSelectedNim(member.nim)}
              title="Lihat data diri"
              className="flex w-full items-center gap-3 rounded-[12px] border border-[#eef1f5] p-4 text-left transition-colors hover:bg-slate-50"
            >
              <Avatar
                letter={member.user?.name ?? member.nim}
                variant="user"
                size={52}
              />
              <span className="min-w-0 leading-tight">
                <span className="block truncate text-[16px] font-bold text-black">
                  {member.user?.name ?? member.nim}
                </span>
                <span className="block truncate text-[13px] text-zinc-500">
                  {member.user ? member.user.department : member.nim}
                </span>
                <span className="block truncate text-[12px] text-zinc-400">
                  {member.nim}
                </span>
              </span>
              <span
                className={`ml-auto shrink-0 rounded-full px-3 py-1 text-[13px] ${
                  member.role === "Leader"
                    ? "bg-[#eef4fb] font-medium text-black"
                    : "border border-[#e3e7ec] text-black"
                }`}
              >
                {member.role}
              </span>
            </button>
          </li>
        ))}
      </ul>
      <ProfileModal nim={selectedNim} onClose={() => setSelectedNim(null)} />
    </>
  );
}
