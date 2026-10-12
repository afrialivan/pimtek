"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Avatar from "@/components/Avatar";
import { useLocalDb } from "@/components/LocalDbProvider";
import ProfileModal from "@/components/ProfileModal";
import { useToast } from "@/components/Toast";

export default function TeamMembershipActions({ teamId }: { teamId: string }) {
  const {
    user,
    users,
    memberships,
    myTeamIds,
    myPendingIds,
    myRole,
    requestJoin,
    cancelRequest,
    leaveTeam,
    deleteTeam,
    approveRequest,
    rejectRequest,
    pendingForTeam,
  } = useLocalDb();
  const router = useRouter();
  const toast = useToast();
  const [confirmLeave, setConfirmLeave] = useState(false);
  const [successor, setSuccessor] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [selectedNim, setSelectedNim] = useState<string | null>(null);
  const [notice, setNotice] = useState("");

  if (!user) return null;

  const isMember = myTeamIds.includes(teamId);
  const isPending = myPendingIds.includes(teamId);
  const role = myRole(teamId);
  const isLeader = role === "Leader";
  const isAdmin = user.role === "admin";
  const canDelete = isAdmin || isLeader;
  const pending = isLeader ? pendingForTeam(teamId) : [];
  const otherMembers = memberships.filter(
    (m) => m.teamId === teamId && m.nim !== user.nim
  );

  function nameOf(nim: string) {
    return users.find((u) => u.nim === nim)?.name ?? nim;
  }

  function handleJoin() {
    setNotice("");
    void (async () => {
      const res = await requestJoin(teamId);
      if (!res.ok) {
        setNotice(
          res.reason === "member"
            ? "Kamu sudah tergabung di 1 tim. Keluar dulu untuk pindah tim."
            : "Kamu sudah punya 1 permintaan pending. Batalkan dulu untuk pindah tim."
        );
      } else {
        toast.success("Permintaan terkirim, menunggu persetujuan ketua.");
      }
    })();
  }

  function handleApprove(id: string) {
    setNotice("");
    void (async () => {
      const ok = await approveRequest(id);
      if (!ok) {
        setNotice(
          "Gagal: pendaftar sudah tergabung di tim lain. Request ditolak otomatis."
        );
      } else {
        toast.success("Pendaftar disetujui masuk tim.");
      }
    })();
  }

  function handleLeave() {
    setNotice("");
    void (async () => {
      const res = await leaveTeam(teamId, isLeader ? successor : undefined);
      if (!res.ok) {
        setNotice(res.message);
        return;
      }
      setConfirmLeave(false);
      setSuccessor("");
      toast.success("Kamu keluar dari tim.");
      router.replace("/teams");
    })();
  }

  function handleDelete() {
    setNotice("");
    void (async () => {
      const res = await deleteTeam(teamId);
      if (!res.ok) {
        setNotice(res.message);
        return;
      }
      toast.success("Tim dihapus.");
      router.replace("/teams");
    })();
  }

  return (
    <section className="rounded-[20px] bg-white p-7 shadow-[0_2px_16px_rgba(30,60,110,0.06)]">
      <h2 className="text-[24px] font-bold text-[#2f5d9a]">Keanggotaan</h2>

      {notice && (
        <p role="alert" className="mt-4 rounded-[12px] bg-[#fde4e4] px-4 py-3 text-[15px] text-[#8f1d1d]">
          {notice}
        </p>
      )}

      {!isMember && !isPending && (
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <p className="text-[16px] text-zinc-600">
            Kamu belum menjadi anggota tim ini.
          </p>
          <button
            type="button"
            onClick={handleJoin}
            className="h-[52px] rounded-[10px] bg-[#2f5d9a] px-8 text-[17px] font-medium text-white transition-colors hover:bg-[#274d80]"
          >
            Minta Bergabung
          </button>
        </div>
      )}

      {!isMember && isPending && (
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <span className="rounded-full bg-[#fdf3e0] px-4 py-2 text-[15px] font-medium text-[#b07d10]">
            Menunggu persetujuan ketua tim
          </span>
          <button
            type="button"
            onClick={() => {
              void (async () => {
                await cancelRequest(teamId);
                toast.success("Permintaan dibatalkan.");
              })();
            }}
            className="h-[48px] rounded-[10px] border border-[#c9d4e2] px-6 text-[16px] font-medium text-zinc-600 transition-colors hover:bg-slate-50"
          >
            Batalkan Permintaan
          </button>
        </div>
      )}

      {isMember && (
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <p className="text-[16px] text-zinc-600">
            Kamu {isLeader ? "ketua" : "anggota"} tim ini
            {role && !isLeader ? ` sebagai ${role}` : ""}.
          </p>
          {confirmLeave ? (
            <div className="flex w-full flex-col gap-3">
              {isLeader && (
                <label className="flex max-w-[420px] flex-col gap-1.5 text-[15px] font-medium text-black">
                  Oper peran ketua ke
                  <select
                    value={successor}
                    onChange={(e) => setSuccessor(e.target.value)}
                    className="h-[52px] cursor-pointer appearance-none rounded-[10px] border border-[#c9d4e2] bg-white px-4 font-normal outline-none focus:border-[#2f5d9a]"
                  >
                    <option value="" disabled>
                      Pilih anggota...
                    </option>
                    {otherMembers.map((m) => (
                      <option key={m.nim} value={m.nim}>
                        {nameOf(m.nim)} ({m.nim})
                      </option>
                    ))}
                  </select>
                </label>
              )}
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-[15px] font-medium text-black">
                  Yakin keluar dari tim?
                </span>
                <button
                  type="button"
                  onClick={handleLeave}
                  disabled={isLeader && !successor}
                  className="h-[48px] rounded-[10px] bg-[#b3261e] px-6 text-[16px] font-medium text-white transition-colors hover:bg-[#8f1d1d] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Ya, Keluar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setConfirmLeave(false);
                    setSuccessor("");
                  }}
                  className="h-[48px] rounded-[10px] border border-[#c9d4e2] px-6 text-[16px] font-medium text-zinc-600 transition-colors hover:bg-slate-50"
                >
                  Batal
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmLeave(true)}
              className="h-[48px] rounded-[10px] border border-[#b3261e] px-6 text-[16px] font-medium text-[#b3261e] transition-colors hover:bg-[#fdf0ef]"
            >
              Keluar Tim
            </button>
          )}
        </div>
      )}

      {isMember && isLeader && (
        <div className="mt-6">
          <p className="text-[16px] text-zinc-600">
            Kamu ketua tim ini. Permintaan bergabung yang masuk:
          </p>
          {pending.length === 0 ? (
            <p className="mt-3 rounded-[12px] bg-slate-50 p-4 text-[15px] text-zinc-500">
              Tidak ada permintaan bergabung.
            </p>
          ) : (
            <ul className="mt-3 flex flex-col gap-3">
              {pending.map((req) => (
                <li
                  key={req.id}
                  className="flex flex-wrap items-center gap-3 rounded-[12px] border border-[#eef1f5] p-3"
                >
                  <Avatar letter={req.name} variant="user" size={44} />
                  <button
                    type="button"
                    onClick={() => setSelectedNim(req.nim)}
                    title="Lihat data diri pendaftar"
                    className="leading-tight text-left hover:underline"
                  >
                    <span className="block text-[15px] font-bold text-black">
                      {req.name}
                    </span>
                    <span className="block text-[13px] text-zinc-500">
                      {req.nim} · {req.createdAt}
                    </span>
                  </button>
                  <span className="ml-auto flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleApprove(req.id)}
                      className="rounded-[10px] bg-[#2f5d9a] px-5 py-2 text-[15px] font-medium text-white transition-colors hover:bg-[#274d80]"
                    >
                      Setujui
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        void (async () => {
                          await rejectRequest(req.id);
                          toast.success("Pendaftar ditolak.");
                        })();
                      }}
                      className="rounded-[10px] border border-[#c9d4e2] px-5 py-2 text-[15px] font-medium text-zinc-600 transition-colors hover:bg-slate-50"
                    >
                      Tolak
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {canDelete && (
        <div className="mt-6 border-t border-[#eef1f5] pt-5">
          {confirmDelete ? (
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[15px] font-medium text-black">
                Hapus tim ini permanen? Semua anggota jadi tanpa tim.
              </span>
              <button
                type="button"
                onClick={handleDelete}
                className="h-[48px] rounded-[10px] bg-[#b3261e] px-6 text-[16px] font-medium text-white transition-colors hover:bg-[#8f1d1d]"
              >
                Ya, Hapus Tim
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="h-[48px] rounded-[10px] border border-[#c9d4e2] px-6 text-[16px] font-medium text-zinc-600 transition-colors hover:bg-slate-50"
              >
                Batal
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="h-[48px] rounded-[10px] border border-[#b3261e] px-6 text-[16px] font-medium text-[#b3261e] transition-colors hover:bg-[#fdf0ef]"
            >
              Hapus Tim
            </button>
          )}
        </div>
      )}
      <ProfileModal nim={selectedNim} onClose={() => setSelectedNim(null)} />
    </section>
  );
}
