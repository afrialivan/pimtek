"use client";

import Link from "next/link";
import { useState } from "react";
import { useLocalDb } from "@/components/LocalDbProvider";
import { PKM_SCHEMES, isProfileIncomplete } from "@/lib/team-types";
import { ProfileSkeleton } from "@/components/Skeleton";

function BarRow({ label, value, max }: { label: string; value: number; max: number }) {
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <span className="w-[84px] shrink-0 truncate text-[13px] text-zinc-600 sm:w-[110px] sm:text-[14px]" title={label}>
        {label}
      </span>
      <div className="h-[10px] flex-1 overflow-hidden rounded-full bg-[#e6ebf2]">
        <div
          className="h-full rounded-full bg-[#2f5d9a]"
          style={{ width: max > 0 ? `${Math.round((value / max) * 100)}%` : "0%" }}
        />
      </div>
      <span className="w-8 shrink-0 text-right text-[14px] font-bold text-black">
        {value}
      </span>
    </div>
  );
}

export default function ProfileCard() {
  const { ready, user, users, teams, requests, myTeamIds, myPendingIds } =
    useLocalDb();
  const [nagDismissed, setNagDismissed] = useState(false);

  if (!ready) {
    return (
      <section className="rounded-[22px] bg-white px-5 py-8 shadow-[0_2px_16px_rgba(30,60,110,0.06)] sm:px-8">
        <ProfileSkeleton />
      </section>
    );
  }

  if (!user) {
    return (
      <section className="rounded-[22px] bg-white px-5 py-10 shadow-[0_2px_16px_rgba(30,60,110,0.06)] sm:px-8">
        <p className="text-[16px] text-zinc-500">
          Silakan <Link href="/login" className="text-[#2f5d9a] hover:underline">login</Link> dulu.
        </p>
      </section>
    );
  }

  const myTeam = teams.find((t) => myTeamIds.includes(t.id));
  const pendingTeam = teams.find(
    (t) => !myTeamIds.includes(t.id) && myPendingIds.includes(t.id)
  );

  if (user.role === "admin") {
    const pendingCount = requests.filter((r) => r.status === "pending").length;
    const teamsByScheme = PKM_SCHEMES.map((scheme) => ({
      label: scheme,
      value: teams.filter((t) => t.scheme === scheme).length,
    })).filter((row) => row.value > 0);
    const maxScheme = Math.max(1, ...teamsByScheme.map((r) => r.value));
    const deptMap = new Map<string, number>();
    for (const u of users) {
      const key = u.department || "-";
      deptMap.set(key, (deptMap.get(key) ?? 0) + 1);
    }
    const usersByDept = [...deptMap.entries()]
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value);
    const maxDept = Math.max(1, ...usersByDept.map((r) => r.value));
    const stats: { label: string; value: string; sub: string }[] = [
      {
        label: "TOTAL PENGGUNA",
        value: `${users.length} orang`,
        sub: "terdaftar",
      },
      {
        label: "TOTAL TIM",
        value: `${teams.length} tim`,
        sub: "terdaftar",
      },
      {
        label: "REQUEST PENDING",
        value: `${pendingCount} permintaan`,
        sub: "menunggu ketua",
      },
    ];
    const shortcuts = [
      { href: "/admin/teams", label: "Kelola Tim" },
      { href: "/admin/departments", label: "Departemen" },
      { href: "/admin/db", label: "Database" },
    ];
    return (
      <section className="rounded-[22px] bg-white px-5 py-8 shadow-[0_2px_16px_rgba(30,60,110,0.06)] sm:px-8">
        <div className="flex flex-wrap items-center gap-5">
          <span
            aria-hidden="true"
            className="flex h-[96px] w-[96px] items-center justify-center rounded-full bg-[#b3261e] text-[40px] font-bold text-white"
          >
            {user.name.charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="truncate text-[24px] font-bold text-black sm:text-[30px]">
              {user.name}
            </p>
            <p className="text-[17px] text-zinc-500">
              {user.nim} · Admin
            </p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} className="rounded-[14px] bg-[#eef4fb] p-5">
              <p className="text-[13px] tracking-widest text-[#4a6fa0]">
                {s.label}
              </p>
              <p className="mt-2 text-[19px] font-bold text-black">{s.value}</p>
              <p className="mt-1 text-[14px] text-zinc-500">{s.sub}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {shortcuts.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="flex h-[52px] items-center justify-center rounded-[10px] bg-[#2f5d9a] px-8 text-[17px] font-medium text-white transition-colors hover:bg-[#274d80]"
            >
              {s.label}
            </Link>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-[14px] bg-[#f7f9fc] p-5">
            <p className="text-[15px] font-bold text-black">Tim per Skim PKM</p>
            <div className="mt-4 flex flex-col gap-2.5">
              {teamsByScheme.length === 0 && (
                <p className="text-[14px] text-zinc-500">Belum ada tim.</p>
              )}
              {teamsByScheme.map((row) => (
                <BarRow key={row.label} label={row.label} value={row.value} max={maxScheme} />
              ))}
            </div>
          </div>
          <div className="rounded-[14px] bg-[#f7f9fc] p-5">
            <p className="text-[15px] font-bold text-black">Pengguna per Departemen</p>
            <div className="mt-4 flex flex-col gap-2.5">
              {usersByDept.map((row) => (
                <BarRow key={row.label} label={row.label} value={row.value} max={maxDept} />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-[22px] bg-white px-5 py-8 shadow-[0_2px_16px_rgba(30,60,110,0.06)] sm:px-8">
      <div className="flex flex-wrap items-center gap-5">
        <span
          aria-hidden="true"
          className="flex h-[96px] w-[96px] items-center justify-center rounded-full bg-[#2f5d9a] text-[40px] font-bold text-white"
        >
          {user.name.charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0">
          <p className="truncate text-[24px] font-bold text-black sm:text-[30px]">
            {user.name}
          </p>
          <p className="text-[17px] text-zinc-500">{user.nim}</p>
          {(user.department) && (
            <p className="text-[15px] text-zinc-400">
              {user.department}
            </p>
          )}
        </div>
      </div>

      {isProfileIncomplete(user) && !nagDismissed && (
        <div className="mt-6 flex flex-col gap-3 rounded-[14px] bg-[#fdf3e0] px-5 py-4 sm:flex-row sm:items-center">
          <p className="flex-1 text-[15px] text-black">
            <strong>Profilmu belum lengkap.</strong> Lengkapi data diri agar
            ketua tim bisa mengenalmu.
          </p>
          <div className="flex gap-2">
            <Link
              href="/profil"
              className="rounded-[10px] bg-[#b07d10] px-5 py-2 text-[15px] font-medium text-white transition-colors hover:bg-[#96690c]"
            >
              Isi sekarang
            </Link>
            <button
              type="button"
              onClick={() => setNagDismissed(true)}
              className="rounded-[10px] px-4 py-2 text-[15px] text-zinc-600 hover:underline"
            >
              Nanti
            </button>
          </div>
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-[14px] bg-[#eef4fb] p-5">
          <p className="text-[13px] tracking-widest text-[#4a6fa0]">TIM SAYA</p>
          <p className="mt-2 truncate text-[19px] font-bold text-black">
            {myTeam ? myTeam.title : "Belum ada tim"}
          </p>
          {myTeam?.scheme && (
            <p className="mt-1 text-[14px] text-zinc-500">{myTeam.scheme}</p>
          )}
          {pendingTeam && (
            <p className="mt-2 truncate text-[14px] text-[#b07d10]">
              Menunggu: {pendingTeam.title}
            </p>
          )}
        </div>
        <div className="rounded-[14px] bg-[#eef4fb] p-5">
          <p className="text-[13px] tracking-widest text-[#4a6fa0]">TOTAL PENGGUNA</p>
          <p className="mt-2 text-[19px] font-bold text-black">
            {users.length} orang
          </p>
          <p className="mt-1 text-[14px] text-zinc-500">{teams.length} tim terdaftar</p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Link
          href="/profil"
          className="flex h-[52px] items-center justify-center rounded-[10px] border border-[#2f5d9a] px-8 text-[17px] font-medium text-[#2f5d9a] transition-colors hover:bg-[#eef4fb]"
        >
          {!user.bio ? "Lengkapi Data Diri" : "Data Diri"}
        </Link>
        <Link
          href="/explore"
          className="flex h-[52px] items-center justify-center rounded-[10px] border border-[#2f5d9a] px-8 text-[17px] font-medium text-[#2f5d9a] transition-colors hover:bg-[#eef4fb]"
        >
          Explore Tim
        </Link>
        <Link
          href="/teams"
          className="flex h-[52px] items-center justify-center rounded-[10px] bg-[#2f5d9a] px-8 text-[17px] font-medium text-white transition-colors hover:bg-[#274d80]"
        >
          Tim Saya
        </Link>
      </div>
    </section>
  );
}
