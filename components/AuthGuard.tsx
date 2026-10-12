"use client";

import { usePathname, useRouter } from "next/navigation";
import { Suspense, useEffect, type ReactNode } from "react";
import { useLocalDb } from "@/components/LocalDbProvider";

const PUBLIC_PATHS = ["/login", "/register"];

function GuardInner({ children }: { children: ReactNode }) {
  const { ready, user } = useLocalDb();
  const pathname = usePathname();
  const router = useRouter();

  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));

  useEffect(() => {
    if (!ready) return;
    if (!user && !isPublic) router.replace("/login");
    if (user && isPublic) router.replace("/");
  }, [ready, user, isPublic, router]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#edf1f7]">
        <p className="text-[17px] text-zinc-500">Memuat...</p>
      </div>
    );
  }

  if (!user && !isPublic) return null;
  return <>{children}</>;
}

export default function AuthGuard({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#edf1f7]">
          <p className="text-[17px] text-zinc-500">Memuat...</p>
        </div>
      }
    >
      <GuardInner>{children}</GuardInner>
    </Suspense>
  );
}
