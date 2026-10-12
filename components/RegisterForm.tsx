"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLocalDb } from "@/components/LocalDbProvider";

const OTHER_DEPARTMENT = "__lainnya__";

const inputClass =
  "h-[52px] rounded-[12px] border border-[#d9d9d9] bg-[#f1f1f1] px-4 text-[16px] text-black outline-none placeholder:text-[#a8a8a8] focus:border-[#2f5d9a]";

const selectClass = `${inputClass} cursor-pointer appearance-none bg-[#f1f1f1]`;

function Spinner() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="animate-spin">
      <circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,0.35)" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export default function RegisterForm() {
  const { register, departments } = useLocalDb();
  const router = useRouter();

  const [name, setName] = useState("");
  const [nim, setNim] = useState("");
  const [department, setDepartment] = useState("");
  const [customDepartment, setCustomDepartment] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isOther = department === OTHER_DEPARTMENT;
  const finalDepartment = isOther ? customDepartment.trim() : department;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    if (password !== confirm) {
      setError("Konfirmasi password tidak sama.");
      return;
    }
    setError("");
    setLoading(true);
    void (async () => {
      try {
        const res = await register({ nim, name, department: finalDepartment, password });
        if (!res.ok) {
          setError(res.message);
          return;
        }
        router.replace("/login?registered=1");
      } finally {
        setLoading(false);
      }
    })();
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-white px-4 py-6">
      <div className="flex items-start gap-6">
        <span className="flex flex-col items-center gap-1">
          <Image
            src="/logo-okft.png"
            alt="Logo OKFT-UH"
            width={72}
            height={72}
            className="h-[72px] w-auto object-contain"
            priority
          />
          <span className="text-[13px] font-bold text-[#e63946]">OKFT-UH</span>
        </span>
        <span className="flex flex-col items-center gap-1">
          <Image
            src="/logo-unhas.png"
            alt="Logo Universitas Hasanuddin"
            width={72}
            height={72}
            className="h-[72px] w-auto object-contain"
            priority
          />
          <span className="text-center text-[11px] font-bold leading-tight text-black">
            UNIVERSITAS
            <br />
            HASANUDDIN
          </span>
        </span>
      </div>

      <div className="mt-5 w-full max-w-[520px] rounded-[24px] bg-[#fafafb] px-6 py-7 sm:px-10">
        <h1 className="text-[30px] font-bold tracking-tight text-black">Daftar</h1>
        <p className="mt-0.5 text-[16px] text-[#a8a8a8]">
          Buat akun dengan NIM Anda.
        </p>

        {error && (
          <p role="alert" className="mt-3 rounded-[10px] bg-[#fde4e4] px-4 py-2.5 text-[14px] text-[#8f1d1d]">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
          <label className="flex flex-col gap-1.5 text-[15px] font-medium text-black">
            Nama Lengkap
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama lengkap"
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-1.5 text-[15px] font-medium text-black">
            NIM
            <input
              value={nim}
              onChange={(e) => setNim(e.target.value)}
              placeholder="cth. D041231098"
              autoComplete="username"
              className={`${inputClass} uppercase`}
            />
          </label>
          <label className="flex flex-col gap-1.5 text-[15px] font-medium text-black">
            Departemen
            <select
              value={department}
              onChange={(e) => {
                setDepartment(e.target.value);
                setCustomDepartment("");
              }}
              className={`${selectClass} ${department ? "" : "text-[#a8a8a8]"}`}
            >
              <option value="" disabled>
                Pilih departemen
              </option>
              {departments.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}
              <option value={OTHER_DEPARTMENT}>Lainnya...</option>
            </select>
          </label>
          {isOther && (
            <label className="flex flex-col gap-1.5 text-[15px] font-medium text-black">
              Departemen lainnya
              <input
                value={customDepartment}
                onChange={(e) => setCustomDepartment(e.target.value)}
                placeholder="Tulis departemenmu"
                className={inputClass}
              />
            </label>
          )}
          <label className="flex flex-col gap-1.5 text-[15px] font-medium text-black">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Buat password"
              autoComplete="new-password"
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-1.5 text-[15px] font-medium text-black">
            Konfirmasi Password
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Ulangi password"
              autoComplete="new-password"
              className={inputClass}
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="mt-1 flex h-[54px] items-center justify-center gap-3 rounded-[14px] bg-[#2f5d9a] text-[18px] font-bold tracking-wide text-white transition-colors hover:bg-[#274d80] disabled:cursor-wait disabled:opacity-80"
          >
            {loading && <Spinner />}
            {loading ? "MENYIMPAN..." : "DAFTAR"}
          </button>

          <p className="text-center text-[14px] text-zinc-500">
            Sudah punya akun?{" "}
            <a href="/login" className="font-medium text-[#2f5d9a] hover:underline">
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
