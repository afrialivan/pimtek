"use client";

import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { useLocalDb } from "@/components/LocalDbProvider";
import { useToast } from "@/components/Toast";

export default function LogoutButton({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const { logout } = useLocalDb();
  const toast = useToast();
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  function handleClick() {
    if (busy) return;
    setBusy(true);
    const id = toast.loading("Logging out...");
    logout();
    window.setTimeout(() => {
      toast.dismiss(id);
      router.replace("/login");
    }, 800);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={busy}
      className={className}
    >
      {children}
    </button>
  );
}
