"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import TeamDetail from "@/components/TeamDetail";
import TeamMembershipActions from "@/components/TeamMembershipActions";
import TeamsHeader from "@/components/TeamsHeader";
import TeamSidebar from "@/components/TeamSidebar";
import { ContentSkeleton } from "@/components/Skeleton";
import { useLocalDb } from "@/components/LocalDbProvider";

const TEAM_TABS = [
  { href: "#about", label: "About" },
  { href: "#members", label: "Members" },
];

export default function TeamDetailView({ id }: { id: string }) {
  const { ready, teams } = useLocalDb();
  const team = teams.find((t) => t.id === id);

  if (ready && !team) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#edf1f7]">
      <div className="mx-auto flex max-w-[1440px] gap-6 p-5">
        <div className="sticky top-5 hidden h-[calc(100vh-40px)] lg:block">
          {ready && team ? (
            <TeamSidebar team={team} />
          ) : (
            <div
              aria-hidden="true"
              className="h-full w-[280px] animate-pulse rounded-[22px] bg-white"
            />
          )}
        </div>
        <main className="min-w-0 flex-1 pb-28 lg:pb-16">
          <TeamsHeader />
          <div className="mt-6">
            <h1 className="max-w-full truncate text-[26px] font-bold tracking-tight text-black sm:text-[32px] lg:text-[36px]">
              <Link href="/teams" className="transition-colors hover:text-[#2f5d9a]">
                Tim Saya
              </Link>{" "}
              / {ready ? (team?.title ?? "…") : "…"}
            </h1>
            <p className="text-[15px] text-zinc-400">Universitas Hasanuddin</p>
          </div>
          {!ready || !team ? (
            <div className="mt-4 lg:mt-6">
              <ContentSkeleton />
            </div>
          ) : (
            <>
              <div className="mt-4 flex gap-2 overflow-x-auto pb-2 lg:hidden">
                {TEAM_TABS.map((tab) => (
                  <a
                    key={tab.href}
                    href={tab.href}
                    className="shrink-0 rounded-full bg-white px-4 py-2 text-[14px] font-medium text-[#1d5a9a] shadow-sm"
                  >
                    {tab.label}
                  </a>
                ))}
              </div>
              <div className="mt-4 flex flex-col gap-5 lg:mt-6">
                <TeamMembershipActions teamId={team.id} />
                <TeamDetail team={team} />
              </div>
            </>
          )}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
