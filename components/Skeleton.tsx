function Block({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`animate-pulse bg-[#dde5ee] ${className}`} />
  );
}

// Kerangka konten umum: judul + kartu-kartu.
export function ContentSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-5" aria-hidden="true">
      <div className="flex flex-col gap-2">
        <Block className="h-9 w-2/5 rounded-[12px]" />
        <Block className="h-4 w-1/3 rounded-[12px]" />
      </div>
      <Block className="h-40 w-full rounded-[20px] bg-white" />
      <Block className="h-56 w-full rounded-[20px] bg-white" />
    </div>
  );
}

// Kerangka shell aplikasi penuh (sidebar + konten).
export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-[#edf1f7]">
      <div className="mx-auto flex max-w-[1440px] gap-6 p-5">
        <div aria-hidden="true" className="hidden h-[calc(100vh-40px)] w-[280px] shrink-0 animate-pulse rounded-[22px] bg-white lg:block" />
        <main className="min-w-0 flex-1">
          <ContentSkeleton />
        </main>
      </div>
    </div>
  );
}

// Kerangka baris-baris daftar.
export function ListSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="mt-5 flex animate-pulse flex-col gap-3" aria-hidden="true">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 rounded-[12px] border border-[#eef1f5] p-4">
          <div className="h-[52px] w-[52px] shrink-0 rounded-full bg-[#dde5ee]" />
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <Block className="h-4 w-2/3" />
            <Block className="h-3 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Kerangka profil: avatar + nama + kartu.
export function ProfileSkeleton() {
  return (
    <div className="flex animate-pulse flex-col" aria-hidden="true">
      <div className="flex items-center gap-5">
        <div className="h-[96px] w-[96px] rounded-full bg-[#dde5ee]" />
        <div className="flex flex-col gap-2">
          <Block className="h-7 w-56" />
          <Block className="h-4 w-40" />
        </div>
      </div>
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Block className="h-28 rounded-[14px] bg-white" />
        <Block className="h-28 rounded-[14px] bg-white" />
      </div>
    </div>
  );
}
