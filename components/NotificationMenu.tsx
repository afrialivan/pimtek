"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocalDb } from "@/components/LocalDbProvider";

export default function NotificationMenu() {
  const { user, memberships, requests } = useLocalDb();
  const pathname = usePathname();

  if (!user || user.role === "admin") return null;

  const ledTeamIds = memberships
    .filter((m) => m.nim === user.nim && m.role === "Leader")
    .map((m) => m.teamId);
  const incoming = requests.filter(
    (r) => ledTeamIds.includes(r.teamId) && r.status === "pending"
  );
  const mine = requests.filter(
    (r) => r.nim === user.nim && r.status !== "pending"
  );
  const count = incoming.length + mine.length;
  const active = pathname.startsWith("/notifikasi");

  return (
    <Link
      href="/notifikasi"
      aria-current={active ? ("page" as const) : undefined}
      className={`mt-2 flex items-center gap-3 rounded-xl px-4 py-3 text-[17px] font-medium tracking-wide transition-colors ${
        active ? "bg-[#dbe9fb] text-[#1d5a9a]" : "text-black hover:bg-slate-100"
      }`}
    >
      <span className="relative">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M6 9a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6Zm4 10a2 2 0 0 0 4 0"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {count > 0 && (
          <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#b3261e] px-1 text-[11px] font-bold text-white">
            {count > 9 ? "9+" : count}
          </span>
        )}
      </span>
      NOTIFIKASI
    </Link>
  );
}
