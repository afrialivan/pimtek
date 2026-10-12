"use client";

import Link from "next/link";
import { useLocalDb } from "@/components/LocalDbProvider";
import type { SidebarActive } from "@/components/Sidebar";

const navItemBase =
  "flex items-center gap-3 rounded-xl px-4 py-3 text-[17px] font-medium tracking-wide transition-colors";
const activeClass = "bg-[#dbe9fb] text-[#1d5a9a]";
const idleClass = "text-black hover:bg-slate-100";

function DashboardIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="8" height="8" rx="2" fill="#2b2b2b" />
      <rect x="13" y="3" width="8" height="8" rx="2" fill="#2b2b2b" opacity="0.45" />
      <rect x="3" y="13" width="8" height="8" rx="2" fill="#2b2b2b" opacity="0.45" />
      <rect x="13" y="13" width="8" height="8" rx="2" fill="#2b2b2b" opacity="0.45" />
    </svg>
  );
}

function ExploreIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="#2b2b2b" strokeWidth="2" />
      <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="#2b2b2b" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function TeamsIcon() {
  return (
    <svg width="28" height="26" viewBox="0 0 28 24" fill="none" aria-hidden="true">
      <circle cx="9" cy="8" r="4" fill="#2b2b2b" />
      <circle cx="19" cy="8" r="4" fill="#2b2b2b" opacity="0.55" />
      <ellipse cx="9" cy="18" rx="7" ry="4" fill="#2b2b2b" />
      <ellipse cx="19" cy="18" rx="7" ry="4" fill="#2b2b2b" opacity="0.55" />
    </svg>
  );
}

// Navigasi utama sadar role: admin hanya melihat Dashboard
// (menu peserta disembunyikan agar tampilan murni admin).
export default function MainNav({ active }: { active: SidebarActive }) {
  const { user } = useLocalDb();
  const isAdmin = user?.role === "admin";

  return (
    <nav className="mt-3 flex flex-col gap-2">
      <Link
        href="/"
        {...(active === "dashboard" ? { "aria-current": "page" as const } : {})}
        className={`${navItemBase} ${active === "dashboard" ? activeClass : idleClass}`}
      >
        <DashboardIcon />
        DASHBOARD
      </Link>
      {!isAdmin && (
        <>
          <Link
            href="/explore"
            {...(active === "explore" ? { "aria-current": "page" as const } : {})}
            className={`${navItemBase} ${active === "explore" ? activeClass : idleClass}`}
          >
            <ExploreIcon />
            EXPLORE TIM
          </Link>
          <Link
            href="/teams"
            {...(active === "teams" ? { "aria-current": "page" as const } : {})}
            className={`${navItemBase} ${active === "teams" ? activeClass : idleClass}`}
          >
            <TeamsIcon />
            TEAMS
          </Link>
        </>
      )}
    </nav>
  );
}
