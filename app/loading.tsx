export default function Loading() {
  return (
    <div className="min-h-screen bg-[#edf1f7]">
      <div
        aria-hidden="true"
        className="fixed inset-x-0 top-0 z-50 h-[3px] overflow-hidden bg-[#dbe9fb]"
      >
        <div className="h-full w-1/3 animate-[loading-slide_1s_ease-in-out_infinite] rounded-full bg-[#2f5d9a]" />
      </div>
      <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-center gap-4 p-5 pt-32">
        <svg
          width="44"
          height="44"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          className="animate-spin"
        >
          <circle cx="12" cy="12" r="9" stroke="#c9d4e2" strokeWidth="3" />
          <path d="M21 12a9 9 0 0 0-9-9" stroke="#2f5d9a" strokeWidth="3" strokeLinecap="round" />
        </svg>
        <p className="text-[16px] text-zinc-500">Memuat halaman...</p>
      </div>
      <style>{`@keyframes loading-slide {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(300%); }
}`}</style>
    </div>
  );
}
