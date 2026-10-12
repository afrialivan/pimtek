"use client";

import Link from "next/link";
import { useLocalDb } from "@/components/LocalDbProvider";

export default function AdminMenu() {
  const { user } = useLocalDb();
  if (!user || user.role !== "admin") return null;

  return (
    <>
      <p className="mt-8 px-4 text-[13px] tracking-widest text-zinc-400">ADMIN</p>
      <div className="mt-3 flex flex-col gap-2">
        <Link
          href="/admin/teams"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-[17px] font-medium tracking-wide text-black transition-colors hover:bg-slate-100"
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="9" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.8" />
            <circle cx="16.5" cy="9.5" r="2.6" stroke="currentColor" strokeWidth="1.8" />
            <path d="M3.5 19c.6-3.2 2.8-5 5.5-5s4.9 1.8 5.5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          TIM
        </Link>
        <Link
          href="/admin/users"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-[17px] font-medium tracking-wide text-black transition-colors hover:bg-slate-100"
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="8" r="3.6" stroke="currentColor" strokeWidth="1.8" />
            <path d="M5 20c1-3.6 3.8-5.4 7-5.4s6 1.8 7 5.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          PENGGUNA
        </Link>
        <Link
          href="/admin/requests"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-[17px] font-medium tracking-wide text-black transition-colors hover:bg-slate-100"
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 9a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6Zm4 10a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          REQUEST
        </Link>
        <Link
          href="/admin/departments"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-[17px] font-medium tracking-wide text-black transition-colors hover:bg-slate-100"
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 20h4L19.5 8.5a2.1 2.1 0 0 0-3-3L5 17l-1 3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
            <path d="m14.5 6.5 3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          DEPARTEMEN
        </Link>
      </div>
    </>
  );
}
