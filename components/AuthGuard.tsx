"use client";

import { usePathname, useRouter } from "next/navigation";
import { Suspense, useEffect, type ReactNode } from "react";
import { useLocalDb } from "@/components/LocalDbProvider";
import { PageSkeleton } from "@/components/Skeleton";

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
    // Route publik (login/register) langsung render tanpa menunggu fetch,
    // agar tidak ada flash loading yang tidak perlu.
    if (isPublic) return <>{children}</>;
    return <PageSkeleton />;
  }

  if (!user && !isPublic) return <PageSkeleton />;
  return <>{children}</>;
}

export default function AuthGuard({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <GuardInner>{children}</GuardInner>
    </Suspense>
  );
}
