"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { useLocalDb } from "@/components/LocalDbProvider";
import MenuSheet from "@/components/MenuSheet";
import { useToast } from "@/components/Toast";

function GridIcon({ active }: { active: boolean }) {
  const color = active ? "#1d5a9a" : "#8a8a8a";
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="8" height="8" rx="2" fill={color} />
      <rect x="13" y="3" width="8" height="8" rx="2" fill={color} opacity="0.45" />
      <rect x="3" y="13" width="8" height="8" rx="2" fill={color} opacity="0.45" />
      <rect x="13" y="13" width="8" height="8" rx="2" fill={color} opacity="0.45" />
    </svg>
  );
}

function SearchIcon({ active }: { active: boolean }) {
  const color = active ? "#1d5a9a" : "#8a8a8a";
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke={color} strokeWidth="2" />
      <line x1="16.5" y1="16.5" x2="21" y2="21" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function TeamsIcon({ active }: { active: boolean }) {
  const color = active ? "#1d5a9a" : "#8a8a8a";
  return (
    <svg width="26" height="24" viewBox="0 0 28 24" fill="none" aria-hidden="true">
      <circle cx="9" cy="8" r="4" fill={color} />
      <circle cx="19" cy="8" r="4" fill={color} opacity="0.55" />
      <ellipse cx="9" cy="18" rx="7" ry="4" fill={color} />
      <ellipse cx="19" cy="18" rx="7" ry="4" fill={color} opacity="0.55" />
    </svg>
  );
}

function BellIcon({ active }: { active: boolean }) {
  const color = active ? "#1d5a9a" : "#8a8a8a";
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 9a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6Zm4 10a2 2 0 0 0 4 0"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" stroke="#8a8a8a" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function AdminTeamsIcon({ active }: { active: boolean }) {
  const color = active ? "#1d5a9a" : "#8a8a8a";
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="9" cy="8" r="3.2" stroke={color} strokeWidth="2" />
      <circle cx="16.5" cy="9.5" r="2.6" stroke={color} strokeWidth="2" />
      <path d="M3.5 19c.6-3.2 2.8-5 5.5-5s4.9 1.8 5.5 5" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

const USER_ITEMS = [
  { href: "/", label: "Dashboard", Icon: GridIcon, match: (p: string) => p === "/" },
  { href: "/explore", label: "Explore", Icon: SearchIcon, match: (p: string) => p.startsWith("/explore") },
  { href: "/teams", label: "Teams", Icon: TeamsIcon, match: (p: string) => p.startsWith("/teams") },
  { href: "/notifikasi", label: "Notif", Icon: BellIcon, match: (p: string) => p.startsWith("/notifikasi") },
];

const ADMIN_ITEMS = [
  { href: "/", label: "Dashboard", Icon: GridIcon, match: (p: string) => p === "/" },
  { href: "/admin/teams", label: "Tim", Icon: AdminTeamsIcon, match: (p: string) => p.startsWith("/admin/teams") },
  { href: "/admin/requests", label: "Request", Icon: BellIcon, match: (p: string) => p.startsWith("/admin/requests") },
];

export default function BottomNav() {
  return (
    <Suspense fallback={null}>
      <BottomNavInner />
    </Suspense>
  );
}

function BottomNavInner() {
  const pathname = usePathname();
  const { user, memberships, requests, logout } = useLocalDb();
  const toast = useToast();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const isAdmin = user?.role === "admin";
  const items = isAdmin ? ADMIN_ITEMS : USER_ITEMS;

  const notifCount = !user
    ? 0
    : requests.filter(
        (r) =>
          (memberships.some(
            (m) => m.nim === user.nim && m.role === "Leader" && m.teamId === r.teamId
          ) &&
            r.status === "pending") ||
          (r.nim === user.nim && r.status !== "pending")
      ).length;

  return (
    <>
      <nav
        aria-label="Navigasi utama"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-[#e2e9f2] bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
      >
        <ul
          className="grid"
          style={{ gridTemplateColumns: `repeat(${items.length + 1}, minmax(0, 1fr))` }}
        >
          {items.map(({ href, label, Icon, match }) => {
            const active = match(pathname);
            const showBadge = label === "Notif" && notifCount > 0;
            return (
              <li key={label}>
                <Link
                  href={href}
                  {...(active ? { "aria-current": "page" as const } : {})}
                  className={`relative flex flex-col items-center gap-1 py-2.5 text-[12px] font-medium ${
                    active ? "text-[#1d5a9a]" : "text-zinc-500"
                  }`}
                >
                  <Icon active={active} />
                  {showBadge && (
                    <span className="absolute right-1/2 top-1 flex h-4 min-w-4 translate-x-4 items-center justify-center rounded-full bg-[#b3261e] px-1 text-[10px] font-bold text-white">
                      {notifCount > 9 ? "9+" : notifCount}
                    </span>
                  )}
                  {label}
                </Link>
              </li>
            );
          })}
          <li>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Buka menu"
              className="flex w-full flex-col items-center gap-1 py-2.5 text-[12px] font-medium text-zinc-500"
            >
              <MenuIcon />
              Menu
            </button>
          </li>
        </ul>
      </nav>
      <MenuSheet
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onLogout={() => {
          const id = toast.loading("Logging out...");
          logout();
          window.setTimeout(() => {
            toast.dismiss(id);
            router.replace("/login");
          }, 800);
        }}
      />
    </>
  );
}
