import Image from "next/image";
import AdminMenu from "@/components/AdminMenu";
import LogoutButton from "@/components/LogoutButton";
import MainNav from "@/components/MainNav";
import NotificationMenu from "@/components/NotificationMenu";

const navItemBase =
  "flex items-center gap-3 rounded-xl px-4 py-3 text-[17px] font-medium tracking-wide transition-colors";

function LogoutIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="4" width="12" height="16" rx="4" fill="#8a8a8a" />
      <path d="M12 12h9m0 0-3-3m3 3-3 3" stroke="#2b2b2b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export type SidebarActive = "dashboard" | "explore" | "teams" | "db" | "notifikasi";

const idleClass = "text-black hover:bg-slate-100";

export default function Sidebar({ active }: { active: SidebarActive }) {
  return (
    <aside className="flex h-full w-[280px] shrink-0 flex-col rounded-[22px] bg-white px-5 py-6 shadow-[0_2px_16px_rgba(30,60,110,0.06)]">
      <div className="flex items-start justify-between px-1">
        <div className="flex items-center gap-3">
          <Image
            src="/logo-unhas.png"
            alt="Logo Universitas Hasanuddin"
            width={56}
            height={56}
            className="h-14 w-auto object-contain"
            priority
          />
          <Image
            src="/logo-okft.png"
            alt="Logo OKFT-UH"
            width={56}
            height={56}
            className="h-14 w-auto object-contain"
            priority
          />
        </div>
        <button
          type="button"
          aria-label="Ciutkan sidebar"
          className="mt-2 rounded-full p-1 text-2xl leading-none text-black"
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M14 5 7 12l7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M20 5l-7 7 7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <p className="mt-10 px-4 text-[13px] tracking-widest text-zinc-400">MENU</p>
      <MainNav active={active} />

      <NotificationMenu />
      <AdminMenu />

      <div className="mt-auto pt-12">
        <p className="px-4 text-[13px] tracking-widest text-zinc-400">UMUM</p>
        <div className="mt-3">
          <LogoutButton className={`${navItemBase} w-full ${idleClass}`}>
            <LogoutIcon />
            KELUAR
          </LogoutButton>
        </div>
      </div>
    </aside>
  );
}
