"use client";

import Link from "next/link";
import { useState } from "react";
import CreateTeamModal from "@/components/CreateTeamModal";
import TeamCard from "@/components/TeamCard";
import TeamsHeader from "@/components/TeamsHeader";
import { useLocalDb } from "@/components/LocalDbProvider";
import { useToast } from "@/components/Toast";

export default function TeamsView() {
  const { teams, memberships, myTeamIds, myPendingIds, createTeam } =
    useLocalDb();
  const toast = useToast();
  const [createOpen, setCreateOpen] = useState(false);
  const [notice, setNotice] = useState("");

  const countOf = (teamId: string) =>
    memberships.filter((m) => m.teamId === teamId).length;

  const myTeams = teams.filter((team) => myTeamIds.includes(team.id));
  const pendingTeams = teams.filter(
    (team) => !myTeamIds.includes(team.id) && myPendingIds.includes(team.id)
  );
  const visibleTeams = [...pendingTeams, ...myTeams];
  const hasTeam = myTeamIds.length > 0;

  function handleMakeTeam() {
    // Aturan 1 tim: sudah punya tim -> tidak bisa buat tim baru.
    if (hasTeam) {
      setNotice("Kamu sudah tergabung di 1 tim. Keluar dulu untuk membuat tim baru.");
      return;
    }
    setNotice("");
    setCreateOpen(true);
  }

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <TeamsHeader />

      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold tracking-tight text-black sm:text-[40px]">
            Tim Saya
          </h1>
          {/* <p className="text-[15px] text-zinc-400">{myTeams.length} tim</p> */}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap justify-end gap-3">
        <Link
          href="/explore"
          className="flex h-[52px] items-center rounded-[14px] border border-[#dbe4ef] bg-white/60 px-6 text-[17px] font-medium text-[#2f5d9a] transition-colors hover:bg-white"
        >
          Join existing team
        </Link>
        <button
          type="button"
          onClick={handleMakeTeam}
          className="flex h-[52px] items-center gap-2 rounded-[14px] bg-[#2f5d9a] px-6 text-[17px] font-medium text-white transition-colors hover:bg-[#274d80]"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
          Make a new team
        </button>
      </div>

      {notice && (
        <p role="alert" className="mt-4 rounded-[14px] bg-[#fde4e4] px-4 py-3 text-[15px] text-[#8f1d1d]">
          {notice}
        </p>
      )}

      {visibleTeams.length === 0 ? (
        <div className="mt-6 rounded-[20px] bg-white p-10 text-center shadow-[0_2px_16px_rgba(30,60,110,0.06)]">
          <p className="text-[22px] font-bold text-black">Belum ada tim</p>
          <p className="mx-auto mt-2 max-w-[420px] text-[16px] text-zinc-500">
            Kamu belum bergabung di tim mana pun. Cari tim yang sudah ada atau
            buat tim barumu sendiri.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/explore"
              className="flex h-[52px] items-center rounded-[10px] border border-[#2f5d9a] px-8 text-[17px] font-medium text-[#2f5d9a] transition-colors hover:bg-[#eef4fb]"
            >
              Cari Tim
            </Link>
            <button
              type="button"
              onClick={handleMakeTeam}
              className="h-[52px] rounded-[10px] bg-[#2f5d9a] px-8 text-[17px] font-medium text-white transition-colors hover:bg-[#274d80]"
            >
              Buat Tim
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-2 2xl:grid-cols-3">
          {visibleTeams.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
              memberCount={countOf(team.id)}
              status={myPendingIds.includes(team.id) ? "pending" : "member"}
            />
          ))}
        </div>
      )}

      <CreateTeamModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={(input) => {
          void (async () => {
            const res = await createTeam(input);
            if (!res.ok) setNotice(res.message);
            else toast.success("Tim berhasil dibuat.");
          })();
        }}
      />
    </div>
  );
}
