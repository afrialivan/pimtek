"use client";

import { useState } from "react";
import { useLocalDb } from "@/components/LocalDbProvider";
import { ContentSkeleton } from "@/components/Skeleton";
import { useToast } from "@/components/Toast";

const inputClass =
  "h-[52px] rounded-[10px] border border-[#c9d4e2] px-4 text-[16px] text-black outline-none placeholder:text-zinc-400 focus:border-[#2f5d9a]";

export default function AdminDepartments() {
  const { ready, user, users, departments, refreshData } = useLocalDb();
  const toast = useToast();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

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

  const countOf = (deptName: string) =>
    users.filter((u) => u.department === deptName).length;
  const maxCount = Math.max(1, ...departments.map((d) => countOf(d.name)));

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Nama departemen wajib diisi.");
      return;
    }
    setError("");
    setSaving(true);
    try {
      const res = await fetch("/api/departments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          actorNim: user!.nim,
        }),
      });
      const data = (await res.json()) as { ok: boolean; message?: string };
      if (!data.ok) {
        setError(data.message ?? "Gagal menambah.");
        return;
      }
      setName("");
      toast.success("Departemen ditambah.");
      refreshData();
    } catch {
      setError("Gagal menambah departemen.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Hapus departemen ini?")) return;
    await fetch("/api/departments", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, actorNim: user!.nim }),
    }).catch(() => undefined);
    toast.success("Departemen dihapus.");
    refreshData();
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-[28px] font-bold tracking-tight text-black sm:text-[36px]">
          Kelola Departemen
        </h1>
        <p className="text-[15px] text-zinc-500">
          Daftar ini dipakai dropdown Departemen saat daftar akun.
        </p>
      </div>

      {error && (
        <p role="alert" className="rounded-[14px] bg-[#fde4e4] px-4 py-3 text-[15px] text-[#8f1d1d]">
          {error}
        </p>
      )}

      <section className="rounded-[20px] bg-white p-7 shadow-[0_2px_16px_rgba(30,60,110,0.06)]">
        <h2 className="text-[20px] font-bold text-[#2f5d9a]">Tambah Departemen</h2>
        <form onSubmit={handleAdd} className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama departemen"
            className={`flex-1 ${inputClass}`}
          />
          <button
            type="submit"
            disabled={saving}
            className="h-[52px] rounded-[10px] bg-[#2f5d9a] px-8 text-[16px] font-medium text-white transition-colors hover:bg-[#274d80] disabled:opacity-50"
          >
            {saving ? "Menyimpan..." : "Tambah"}
          </button>
        </form>
      </section>

      <section className="rounded-[20px] bg-white p-7 shadow-[0_2px_16px_rgba(30,60,110,0.06)]">
        <h2 className="text-[20px] font-bold text-[#2f5d9a]">
          Daftar ({departments.length})
        </h2>
        {departments.length === 0 ? (
          <p className="mt-4 rounded-[12px] bg-slate-50 p-4 text-[15px] text-zinc-500">
            Belum ada departemen.
          </p>
        ) : (
          <ul className="mt-4 flex flex-col gap-3">
            {departments.map((d) => {
              const count = countOf(d.name);
              const deptUsers = users.filter((u) => u.department === d.name);
              const isOpen = expanded === d.id;
              return (
                <li
                  key={d.id}
                  className="rounded-[12px] border border-[#eef1f5] px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setExpanded(isOpen ? null : d.id)}
                      title={isOpen ? "Tutup daftar akun" : "Lihat akun"}
                      className="min-w-0 flex-1 text-left"
                    >
                      <span className="block truncate text-[16px] font-bold text-black">
                        {d.name}
                      </span>
                      <span className="text-[14px] text-zinc-500">
                        {count} pengguna{isOpen ? " ▲" : " ▼"}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleDelete(d.id)}
                      className="ml-auto shrink-0 rounded-[8px] border border-[#b3261e] px-4 py-1.5 text-[14px] font-medium text-[#b3261e] transition-colors hover:bg-[#fdf0ef]"
                    >
                      Hapus
                    </button>
                  </div>
                  <div className="mt-2 h-[8px] overflow-hidden rounded-full bg-[#e6ebf2]">
                    <div
                      className="h-full rounded-full bg-[#2f5d9a]"
                      style={{
                        width: `${Math.round((count / maxCount) * 100)}%`,
                      }}
                    />
                  </div>
                  {isOpen && (
                    <ul className="mt-3 flex flex-col gap-1.5 border-t border-slate-100 pt-3">
                      {deptUsers.length === 0 && (
                        <li className="text-[14px] text-zinc-500">
                          Belum ada akun di departemen ini.
                        </li>
                      )}
                      {deptUsers.map((u) => (
                        <li
                          key={u.nim}
                          className="flex items-center gap-2 text-[14px]"
                        >
                          <span className="font-medium text-black">{u.name}</span>
                          <span className="text-zinc-500">{u.nim}</span>
                          <span
                            className={`ml-auto rounded-full px-2.5 py-0.5 text-[12px] font-medium ${
                              u.role === "admin"
                                ? "bg-[#fde4e4] text-[#8f1d1d]"
                                : "bg-[#eef4fb] text-[#2f5d9a]"
                            }`}
                          >
                            {u.role}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
