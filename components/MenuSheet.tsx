"use client";

import Link from "next/link";
import { useLocalDb } from "@/components/LocalDbProvider";

export default function MenuSheet({
  open,
  onClose,
  onLogout,
}: {
  open: boolean;
  onClose: () => void;
  onLogout: () => void;
}) {
  const { user } = useLocalDb();
  if (!open) return null;

  const isAdmin = user?.role === "admin";

  const userLinks = [{ href: "/profil", label: "Data Diri" }];
  const adminLinks = [
    { href: "/admin/teams", label: "Kelola Tim" },
    { href: "/admin/users", label: "Kelola Pengguna" },
    { href: "/admin/requests", label: "Permintaan" },
    { href: "/admin/departments", label: "Departemen" },
    { href: "/admin/db", label: "Database" },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      className="fixed inset-0 z-50 lg:hidden"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <div className="sheet-up absolute inset-x-0 bottom-0 rounded-t-[24px] bg-white px-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-4 shadow-xl">
        <div aria-hidden="true" className="mx-auto h-1.5 w-12 rounded-full bg-slate-200" />
        <div className="mt-4 flex flex-col">
          {!isAdmin &&
            userLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={onClose}
                className="border-b border-slate-100 py-3.5 text-[17px] font-medium text-black"
              >
                {l.label}
              </Link>
            ))}
          {isAdmin && (
            <>
              <p className="pb-1 pt-2 text-[13px] tracking-widest text-zinc-400">
                ADMIN
              </p>
              {adminLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={onClose}
                  className="border-b border-slate-100 py-3.5 text-[17px] font-medium text-black"
                >
                  {l.label}
                </Link>
              ))}
            </>
          )}
          <button
            type="button"
            onClick={() => {
              onClose();
              onLogout();
            }}
            className="py-3.5 text-left text-[17px] font-medium text-[#b3261e]"
          >
            Keluar
          </button>
        </div>
      </div>
      <style>{`@keyframes sheet-up {
  from { transform: translateY(40px); opacity: 0.5; }
  to { transform: translateY(0); opacity: 1; }
}
.sheet-up { animation: sheet-up 0.22s ease-out; }`}</style>
    </div>
  );
}
