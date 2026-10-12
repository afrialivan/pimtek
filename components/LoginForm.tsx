"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useLocalDb } from "@/components/LocalDbProvider";
import { useToast } from "@/components/Toast";

function UserIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="3.6" stroke="#8a8a8a" strokeWidth="1.6" />
      <path d="M5 20c1-3.6 3.8-5.4 7-5.4s6 1.8 7 5.4" stroke="#8a8a8a" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="10" width="14" height="10" rx="2.5" stroke="#8a8a8a" strokeWidth="1.6" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="#8a8a8a" strokeWidth="1.6" />
      <circle cx="12" cy="15" r="1.4" fill="#8a8a8a" />
    </svg>
  );
}

function EyeIcon({ off }: { off: boolean }) {
  return off ? (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 4l16 16" stroke="#8a8a8a" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M10.6 5.2A9.8 9.8 0 0 1 12 5c5 0 8.7 4.1 10 7-.4 1-1.3 2.4-2.7 3.7M6.6 6.6C4.3 8 2.9 10.4 2 12c1.3 2.9 5 7 10 7 1.5 0 2.9-.4 4.1-1" stroke="#8a8a8a" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ) : (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M2 12c1.3-2.9 5-7 10-7s8.7 4.1 10 7c-1.3 2.9-5 7-10 7s-8.7-4.1-10-7Z" stroke="#8a8a8a" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="3" stroke="#8a8a8a" strokeWidth="1.6" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="animate-spin">
      <circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,0.35)" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export default function LoginForm() {
  const { login } = useLocalDb();
  const toast = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered") === "1";

  const [nim, setNim] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setError("");
    setLoading(true);
    void (async () => {
      try {
        const res = await login(nim, password, remember);
        if (!res.ok || !res.user) {
          setError(res.message || "NIM atau password salah. Silakan coba lagi.");
          return;
        }
        toast.success("Login berhasil, mengalihkan...");
        await new Promise((r) => setTimeout(r, 1200));
        router.replace("/");
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
        <h1 className="text-[30px] font-bold tracking-tight text-black">Login</h1>
        <p className="mt-0.5 text-[16px] text-[#a8a8a8]">
          Masukkan NIM dan password Anda.
        </p>

        {registered && (
          <p className="mt-3 rounded-[10px] bg-[#e5f5df] px-4 py-2.5 text-[14px] text-[#3d7a34]">
            Akun berhasil dibuat. Silakan login.
          </p>
        )}
        {error && (
          <p role="alert" className="mt-3 rounded-[10px] bg-[#fde4e4] px-4 py-2.5 text-[14px] text-[#8f1d1d]">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3.5">
          <label className="flex h-[56px] items-center gap-3 rounded-[12px] border border-[#d9d9d9] bg-[#f1f1f1] px-4">
            <UserIcon />
            <span className="sr-only">NIM</span>
            <input
              value={nim}
              onChange={(e) => setNim(e.target.value)}
              placeholder="NIM"
              autoComplete="username"
              className="w-full bg-transparent text-[17px] uppercase text-black outline-none placeholder:text-[#a8a8a8]"
            />
          </label>

          <label className="flex h-[56px] items-center gap-3 rounded-[12px] border border-[#d9d9d9] bg-[#f1f1f1] px-4">
            <LockIcon />
            <span className="sr-only">Password</span>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="PASSWORD"
              autoComplete="current-password"
              className="w-full bg-transparent text-[17px] text-black outline-none placeholder:text-[#a8a8a8]"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
              className="shrink-0"
            >
              <EyeIcon off={!showPassword} />
            </button>
          </label>

          <div className="flex items-center justify-between text-[15px]">
            <label className="flex cursor-pointer items-center gap-2.5 text-black">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-5 w-5 cursor-pointer appearance-none rounded-[6px] border border-black checked:bg-[#2f5d9a] checked:border-[#2f5d9a]"
              />
              Remember Me
            </label>
            <a href="#" className="text-[#2f5d9a] hover:underline">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-1 flex h-[56px] items-center justify-center gap-3 rounded-[14px] bg-[#2f5d9a] text-[18px] font-bold tracking-wide text-white transition-colors hover:bg-[#274d80] disabled:cursor-wait disabled:opacity-80"
          >
            {loading && <Spinner />}
            {loading ? "MEMERIKSA..." : "LOGIN"}
          </button>

          <p className="text-center text-[14px] text-zinc-500">
            Belum punya akun?{" "}
            <a href="/register" className="font-medium text-[#2f5d9a] hover:underline">
              Daftar
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
