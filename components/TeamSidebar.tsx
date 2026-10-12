import Link from "next/link";
import Avatar from "@/components/Avatar";
import type { Team } from "@/lib/team-types";

const TEAM_LINKS = [
  { href: "#about", label: "About Team" },
  { href: "#members", label: "Members" },
];

export default function TeamSidebar({ team }: { team: Team }) {
  return (
    <aside className="flex h-full w-[280px] shrink-0 flex-col rounded-[22px] bg-white px-5 py-6 shadow-[0_2px_16px_rgba(30,60,110,0.06)]">
      <Link
        href="/teams"
        className="flex items-center gap-2 px-1 text-[15px] font-medium text-[#1d5a9a] hover:underline"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M19 12H5m0 0 6-6m-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Tim Saya
      </Link>

      <div className="mt-5 flex items-center gap-3 rounded-[14px] bg-[#eef4fb] p-3">
        <Avatar letter={team.title} variant="team" size={48} />
        <span className="min-w-0 leading-tight">
          <span className="block truncate text-[15px] font-bold text-black">
            {team.title}
          </span>
          {team.scheme && (
            <span className="mt-1 inline-block rounded-full bg-white px-2 py-0.5 text-[12px] font-medium text-[#2f5d9a]">
              {team.scheme}
            </span>
          )}
        </span>
      </div>

      <p className="mt-8 px-4 text-[13px] tracking-widest text-zinc-400">TIM</p>
      <nav className="mt-3 flex flex-col gap-1">
        {TEAM_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="rounded-xl px-4 py-2.5 text-[16px] font-medium text-black transition-colors hover:bg-slate-100"
          >
            {link.label}
          </a>
        ))}
      </nav>

      <div className="mt-auto pt-8">
        {team.groupLink ? (
          <a
            href={team.groupLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-[52px] items-center justify-center gap-2 rounded-[10px] bg-[#2f5d9a] text-[16px] font-medium text-white transition-colors hover:bg-[#274d80]"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.7-1.2A9 9 0 1 0 12 3Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
            </svg>
            Grup WA
          </a>
        ) : (
          <p className="rounded-[10px] bg-slate-100 px-4 py-3 text-center text-[14px] text-zinc-400">
            Belum ada link grup
          </p>
        )}
      </div>
    </aside>
  );
}
