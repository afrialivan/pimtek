"use client";

import { useState } from "react";
import { useLocalDb, type LocalUser } from "@/components/LocalDbProvider";
import { ContentSkeleton } from "@/components/Skeleton";
import { useToast } from "@/components/Toast";

const inputClass =
  "h-[52px] rounded-[10px] border border-[#c9d4e2] px-4 text-[16px] text-black outline-none placeholder:text-zinc-400 focus:border-[#2f5d9a]";

export default function AdminUsersView() {
  const { ready, user, users, departments, adminUpdateUser, adminDeleteUser } =
    useLocalDb();
  const toast = useToast();
  const [editing, setEditing] = useState<LocalUser | null>(null);
  const [form, setForm] = useState({
    name: "",
    department: "",
    customDepartment: "",
    role: "user",
    newPassword: "",
  });
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [deptFilter, setDeptFilter] = useState("");

  const OTHER_DEPARTMENT = "__lainnya__";
  const isCustomDept = form.department === OTHER_DEPARTMENT;

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

  function openEdit(u: LocalUser) {
    setEditing(u);
    setForm({
      name: u.name,
      department: u.department,
      customDepartment: "",
      role: u.role,
      newPassword: "",
    });
    setConfirmDelete(null);
  }

  function handleSave() {
    if (!editing) return;
    const finalDepartment = isCustomDept
      ? form.customDepartment.trim()
      : form.department;
    if (!finalDepartment) {
      toast.error("Departemen wajib diisi.");
      return;
    }
    void (async () => {
      const finalDepartment = isCustomDept
        ? form.customDepartment.trim()
        : form.department;
      if (!finalDepartment) {
        toast.error("Departemen wajib diisi.");
        return;
      }
      const res = await adminUpdateUser({
        nim: editing.nim,
        name: form.name,
        department: finalDepartment,
        role: form.role,
        newPassword: form.newPassword,
      });
      if (!res.ok) {
        toast.error(res.message);
        return;
      }
      setEditing(null);
      toast.success("User tersimpan.");
    })();
  }

  function handleDelete(nim: string) {
    void (async () => {
      const res = await adminDeleteUser(nim);
      if (!res.ok) {
        toast.error(res.message);
        return;
      }
      setConfirmDelete(null);
      toast.success("User dihapus.");
    })();
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-[28px] font-bold tracking-tight text-black sm:text-[36px]">
          Kelola Pengguna
        </h1>
        <p className="text-[15px] text-zinc-500">{users.length} akun terdaftar.</p>
      </div>

      <label className="flex max-w-[420px] items-center gap-3 rounded-[14px] bg-white px-4 py-2.5 shadow-sm">
        <span className="shrink-0 text-[15px] text-zinc-500">Departemen:</span>
        <select
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
          aria-label="Filter departemen"
          className="w-full cursor-pointer appearance-none bg-transparent py-1 text-[15px] font-medium text-black outline-none"
        >
          <option value="">Semua ({users.length})</option>
          {departments.map((d) => {
            const count = users.filter((u) => u.department === d.name).length;
            return (
              <option key={d.id} value={d.name}>
                {d.name} ({count})
              </option>
            );
          })}
        </select>
      </label>

      <section className="rounded-[20px] bg-white p-4 shadow-[0_2px_16px_rgba(30,60,110,0.06)] sm:p-7">
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[720px] border-collapse text-left text-[15px]">
            <thead>
              <tr className="border-b border-[#e2e9f2] text-zinc-500">
                <th className="px-3 py-2 font-medium">NIM</th>
                <th className="px-3 py-2 font-medium">Nama</th>
                <th className="px-3 py-2 font-medium">Departemen</th>
                <th className="px-3 py-2 font-medium">Role</th>
                <th className="px-3 py-2 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users
                .filter((u) => !deptFilter || u.department === deptFilter)
                .map((u) => (
                <tr key={u.nim} className="border-b border-slate-100 text-black">
                  <td className="px-3 py-3">{u.nim}</td>
                  <td className="px-3 py-3 font-medium">{u.name}</td>
                  <td className="px-3 py-3 text-zinc-600">
                    {u.department}
                  </td>
                  <td className="px-3 py-3">
                    <span
                      className={`rounded-full px-3 py-1 text-[13px] font-medium ${
                        u.role === "admin"
                          ? "bg-[#fde4e4] text-[#8f1d1d]"
                          : "bg-[#eef4fb] text-[#2f5d9a]"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(u)}
                        className="rounded-[8px] border border-[#2f5d9a] px-4 py-1.5 text-[14px] font-medium text-[#2f5d9a] transition-colors hover:bg-[#eef4fb]"
                      >
                        Edit
                      </button>
                      {confirmDelete === u.nim ? (
                        <>
                          <button
                            type="button"
                            onClick={() => handleDelete(u.nim)}
                            className="rounded-[8px] bg-[#b3261e] px-4 py-1.5 text-[14px] font-medium text-white"
                          >
                            Ya
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDelete(null)}
                            className="rounded-[8px] border border-[#c9d4e2] px-4 py-1.5 text-[14px] text-zinc-600"
                          >
                            Batal
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmDelete(u.nim)}
                          className="rounded-[8px] border border-[#b3261e] px-4 py-1.5 text-[14px] font-medium text-[#b3261e] transition-colors hover:bg-[#fdf0ef]"
                        >
                          Hapus
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ul className="flex flex-col gap-3 md:hidden">
          {users
            .filter((u) => !deptFilter || u.department === deptFilter)
            .map((u) => (
              <li
                key={u.nim}
                className="rounded-[12px] border border-[#eef1f5] p-4"
              >
                <div className="flex items-center gap-2">
                  <p className="min-w-0 flex-1 truncate text-[16px] font-bold text-black">
                    {u.name}
                  </p>
                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-[12px] font-medium ${
                      u.role === "admin"
                        ? "bg-[#fde4e4] text-[#8f1d1d]"
                        : "bg-[#eef4fb] text-[#2f5d9a]"
                    }`}
                  >
                    {u.role}
                  </span>
                </div>
                <p className="mt-1 text-[13px] text-zinc-500">
                  {u.nim} · {u.department}
                </p>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => openEdit(u)}
                    className="flex-1 rounded-[8px] border border-[#2f5d9a] px-4 py-2 text-[14px] font-medium text-[#2f5d9a]"
                  >
                    Edit
                  </button>
                  {confirmDelete === u.nim ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleDelete(u.nim)}
                        className="flex-1 rounded-[8px] bg-[#b3261e] px-4 py-2 text-[14px] font-medium text-white"
                      >
                        Ya, Hapus
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDelete(null)}
                        className="flex-1 rounded-[8px] border border-[#c9d4e2] px-4 py-2 text-[14px] text-zinc-600"
                      >
                        Batal
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(u.nim)}
                      className="flex-1 rounded-[8px] border border-[#b3261e] px-4 py-2 text-[14px] font-medium text-[#b3261e]"
                    >
                      Hapus
                    </button>
                  )}
                </div>
              </li>
            ))}
        </ul>
      </section>

      {editing && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Edit ${editing.nim}`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setEditing(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-[520px] overflow-y-auto rounded-[20px] bg-white p-8 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-[22px] font-bold text-black">
              Edit {editing.nim}
            </h2>
            <div className="mt-5 flex flex-col gap-3">
              <label className="flex flex-col gap-1.5 text-[15px] font-medium text-black">
                Nama
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputClass}
                />
              </label>
              <label className="flex flex-col gap-1.5 text-[15px] font-medium text-black">
                Departemen
                <select
                  value={form.department}
                  onChange={(e) =>
                    setForm({ ...form, department: e.target.value, customDepartment: "" })
                  }
                  className={`${inputClass} cursor-pointer appearance-none bg-white`}
                >
                  <option value="" disabled>
                    Pilih departemen
                  </option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                  {form.department &&
                    form.department !== OTHER_DEPARTMENT &&
                    !departments.some((d) => d.name === form.department) && (
                      <option value={form.department}>
                        {form.department} (saat ini)
                      </option>
                    )}
                  <option value={OTHER_DEPARTMENT}>Lainnya...</option>
                </select>
              </label>
              {isCustomDept && (
                <label className="flex flex-col gap-1.5 text-[15px] font-medium text-black">
                  Departemen lainnya
                  <input
                    value={form.customDepartment}
                    onChange={(e) =>
                      setForm({ ...form, customDepartment: e.target.value })
                    }
                    placeholder="Tulis departemen"
                    className={inputClass}
                  />
                </label>
              )}
              <label className="flex flex-col gap-1.5 text-[15px] font-medium text-black">
                Role
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className={`${inputClass} cursor-pointer appearance-none bg-white`}
                >
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                </select>
              </label>
              <label className="flex flex-col gap-1.5 text-[15px] font-medium text-black">
                Password baru (kosongkan jika tidak diganti)
                <input
                  type="password"
                  value={form.newPassword}
                  onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                  autoComplete="new-password"
                  className={inputClass}
                />
              </label>
              <div className="mt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="h-[52px] flex-1 rounded-[10px] border border-[#2f5d9a] text-[16px] font-medium text-[#2f5d9a] hover:bg-[#eef4fb]"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="h-[52px] flex-1 rounded-[10px] bg-[#2f5d9a] text-[16px] font-medium text-white hover:bg-[#274d80]"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
