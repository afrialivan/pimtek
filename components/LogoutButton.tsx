"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useLocalDb } from "@/components/LocalDbProvider";

export default function LogoutButton({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const { logout } = useLocalDb();
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => {
        logout();
        router.replace("/login");
      }}
      className={className}
    >
      {children}
    </button>
  );
}
