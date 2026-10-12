"use client";

import { useMemo, useState } from "react";
import TeamCard, { type TeamCardStatus } from "@/components/TeamCard";
import { useLocalDb } from "@/components/LocalDbProvider";
import { useToast } from "@/components/Toast";
import { PKM_SCHEMES } from "@/lib/team-types";

export default function ExploreTeamsView() {
  const { teams, memberships, myTeamIds, myPendingIds, requestJoin } =
    useLocalDb();
  const toast = useToast();
  const [query, setQuery] = useState("");
  const [scheme, setScheme] = useState("");
  const [notice, setNotice] = useState("");

  const countOf = (teamId: string) =>
    memberships.filter((m) => m.teamId === teamId).length;

  const hasTeam = myTeamIds.length > 0;
  const hasPending = myPendingIds.length > 0;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return teams.filter((team) => {
      if (team.isLocal) return false;
      if (scheme && team.scheme !== scheme) return false;
      if (
        q &&
        !`${team.title} ${team.scheme ?? ""}`.toLowerCase().includes(q)
      )
        return false;
      return true;
    });
  }, [teams, query, scheme]);

  function statusFor(teamId: string): TeamCardStatus {
    if (myTeamIds.includes(teamId)) return "member";
    if (myPendingIds.includes(teamId)) return "pending";
    if (hasTeam || hasPending) return "blocked";
    return "joinable";
  }

  function handleJoin(teamId: string) {
    setNotice("");
    void (async () => {
      const res = await requestJoin(teamId);
      if (!res.ok) {
        setNotice(
          res.reason === "member"
            ? "Kamu sudah tergabung di 1 tim. Keluar dulu untuk pindah tim."
            : "Kamu sudah punya 1 permintaan pending. Batalkan dulu untuk pindah tim."
        );
      } else {
        toast.success("Permintaan terkirim, menunggu persetujuan ketua.");
      }
    })();
  }

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <h1 className="text-[28px] font-bold tracking-tight text-black sm:text-[40px]">
        Explore Tim
      </h1>
      <p className="text-[15px] text-zinc-400">
        Jelajahi tim yang sudah ada dan bergabung ke tim pilihanmu. Maksimal 1
        tim per orang.
      </p>

      <div className="mt-6 flex h-[68px] items-center gap-4 rounded-[18px] bg-[#e2e9f2] px-6">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="11" cy="11" r="7" stroke="black" strokeWidth="1.8" />
          <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="black" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari tim..."
          className="w-full bg-transparent text-[18px] text-black outline-none placeholder:text-[#4a6fa0]"
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <label className="flex cursor-pointer items-center gap-2 rounded-[14px] bg-[#e2e9f2] px-4 py-2.5 text-[17px] text-[#1d5a9a]">
          Skim:
          <select
            value={scheme}
            onChange={(e) => setScheme(e.target.value)}
            className="cursor-pointer bg-transparent font-medium outline-none"
            aria-label="Filter skim PKM"
          >
            <option value="">Semua</option>
            {PKM_SCHEMES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        {(scheme || query) && (
          <button
            type="button"
            onClick={() => {
              setScheme("");
              setQuery("");
            }}
            className="rounded-[14px] px-3 py-2.5 text-[15px] text-[#1d5a9a] hover:underline"
          >
            Reset
          </button>
        )}
        <span className="ml-auto text-[15px] text-zinc-400">
          {filtered.length} tim
        </span>
      </div>

      {notice && (
        <p role="alert" className="mt-4 rounded-[14px] bg-[#fde4e4] px-4 py-3 text-[15px] text-[#8f1d1d]">
          {notice}
        </p>
      )}

      {filtered.length === 0 ? (
        <p className="mt-6 rounded-[20px] bg-white p-10 text-center text-[17px] text-zinc-500">
          Tidak ada tim yang cocok. Coba ubah kata kunci atau filter.
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-5 pb-16 xl:grid-cols-2 2xl:grid-cols-3">
          {filtered.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
              memberCount={countOf(team.id)}
              status={statusFor(team.id)}
              blockedReason="Kamu sudah tergabung di 1 tim. Keluar dulu untuk pindah tim."
              onJoin={() => handleJoin(team.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
