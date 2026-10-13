"use client";

import Link from "next/link";
import { useLocalDb } from "@/components/LocalDbProvider";
import { ContentSkeleton } from "@/components/Skeleton";
import { useToast } from "@/components/Toast";
import { formatTanggal } from "@/lib/format-date";

export default function AdminRequestsView() {
  const { ready, user, requests, teams, approveRequest, rejectRequest } =
    useLocalDb();
  const toast = useToast();

  if (!ready) {
    return <ContentSkeleton />;
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="rounded-[20px] bg-white p-10 text-center shadow-[0_2px_16px_rgba(30,60,110,0.06)]">
        <p className="text-[20px] font-bold text-black">Khusus admin</p>
        <p className="mt-2 text-[15px] text-zinc-500">
          Halaman ini hanya bisa diakses akun admin.
        </p>
      </div>
    );
  }

  const teamTitle = (id: string) =>
    teams.find((t) => t.id === id)?.title ?? id;
  const pending = requests.filter((r) => r.status === "pending");
  const history = requests.filter((r) => r.status !== "pending").slice().reverse();

  function handleApprove(id: string) {
    void (async () => {
      const ok = await approveRequest(id);
      if (ok) toast.success("Request disetujui.");
      else toast.error("Gagal: pendaftar sudah punya tim.");
    })();
  }

  function handleReject(id: string) {
    void (async () => {
      await rejectRequest(id);
      toast.success("Request ditolak.");
    })();
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-[28px] font-bold tracking-tight text-black sm:text-[36px]">
          Permintaan Bergabung
        </h1>
        <p className="text-[15px] text-zinc-500">
          {pending.length} menunggu persetujuan.
        </p>
      </div>

      <section className="rounded-[20px] bg-white p-7 shadow-[0_2px_16px_rgba(30,60,110,0.06)]">
        <h2 className="text-[20px] font-bold text-[#2f5d9a]">Pending</h2>
        {pending.length === 0 ? (
          <p className="mt-3 rounded-[12px] bg-slate-50 p-4 text-[15px] text-zinc-500">
            Tidak ada permintaan pending.
          </p>
        ) : (
          <ul className="mt-4 flex flex-col gap-3">
            {pending.map((req) => (
              <li
                key={req.id}
                className="flex flex-wrap items-center gap-3 rounded-[12px] border border-[#eef1f5] p-4"
              >
                <span className="min-w-0 flex-1 leading-tight">
                  <span className="block text-[15px] text-black">
                    <strong>{req.name}</strong> ({req.nim}) →{" "}
                    <Link
                      href={`/teams/${req.teamId}`}
                      className="font-bold text-[#2f5d9a] hover:underline"
                    >
                      {teamTitle(req.teamId)}
                    </Link>
                  </span>
                  <span className="block text-[13px] text-zinc-500">
                    {formatTanggal(req.createdAt)}
                  </span>
                </span>
                <span className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleApprove(req.id)}
                    className="rounded-[10px] bg-[#2f5d9a] px-5 py-2 text-[15px] font-medium text-white hover:bg-[#274d80]"
                  >
                    Setujui
                  </button>
                  <button
                    type="button"
                    onClick={() => handleReject(req.id)}
                    className="rounded-[10px] border border-[#c9d4e2] px-5 py-2 text-[15px] font-medium text-zinc-600 hover:bg-slate-50"
                  >
                    Tolak
                  </button>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-[20px] bg-white p-7 shadow-[0_2px_16px_rgba(30,60,110,0.06)]">
        <h2 className="text-[20px] font-bold text-[#2f5d9a]">Riwayat</h2>
        {history.length === 0 ? (
          <p className="mt-3 rounded-[12px] bg-slate-50 p-4 text-[15px] text-zinc-500">
            Belum ada riwayat.
          </p>
        ) : (
          <ul className="mt-4 flex flex-col gap-2">
            {history.slice(0, 30).map((req) => (
              <li
                key={req.id}
                className="flex items-center gap-3 rounded-[12px] bg-slate-50 px-4 py-2.5 text-[14px]"
              >
                <span className="min-w-0 flex-1 truncate text-black">
                  {req.name} → {teamTitle(req.teamId)}
                </span>
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-[12px] font-medium ${
                    req.status === "approved"
                      ? "bg-[#e5f5df] text-[#3d7a34]"
                      : "bg-[#fde4e4] text-[#8f1d1d]"
                  }`}
                >
                  {req.status === "approved" ? "Disetujui" : "Ditolak"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
