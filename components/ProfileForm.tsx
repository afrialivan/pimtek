"use client";

import { useState } from "react";
import { useLocalDb } from "@/components/LocalDbProvider";
import { useToast } from "@/components/Toast";

const inputClass =
  "rounded-[10px] border border-[#c9d4e2] px-4 font-normal outline-none placeholder:text-zinc-400 focus:border-[#2f5d9a]";

interface ProfileDraft {
  nim: string;
  bio: string;
  skills: string;
  interests: string;
  experiences: string[];
}

function draftFrom(nim: string, user: {
  bio: string;
  skills: string;
  interests: string;
  experiences: string;
}): ProfileDraft {
  const lines = user.experiences
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  return {
    nim,
    bio: user.bio ?? "",
    skills: user.skills ?? "",
    interests: user.interests ?? "",
    experiences: lines.length > 0 ? lines : [""],
  };
}

export default function ProfileForm() {
  const { ready, user, updateProfile } = useLocalDb();
  const toast = useToast();
  const [draft, setDraft] = useState<ProfileDraft | null>(null);
  const [saving, setSaving] = useState(false);

  // Prefill sekali saat data user tiba (pola adjust-state-when-props-change).
  if (user && (draft === null || draft.nim !== user.nim)) {
    setDraft(draftFrom(user.nim, user));
  }

  if (!ready) {
    return <p className="text-[16px] text-zinc-500">Memuat...</p>;
  }

  if (!user || !draft) return null;

  const { bio, skills, interests, experiences } = draft;

  function patch(partial: Partial<ProfileDraft>) {
    setDraft((prev) => (prev ? { ...prev, ...partial } : prev));
  }

  function setExpAt(index: number, value: string) {
    setDraft((prev) =>
      prev
        ? { ...prev, experiences: prev.experiences.map((v, i) => (i === index ? value : v)) }
        : prev
    );
  }

  function addExp() {
    setDraft((prev) =>
      prev ? { ...prev, experiences: [...prev.experiences, ""] } : prev
    );
  }

  function removeExp(index: number) {
    setDraft((prev) => {
      if (!prev) return prev;
      const next =
        prev.experiences.length <= 1
          ? [""]
          : prev.experiences.filter((_, i) => i !== index);
      return { ...prev, experiences: next };
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    void (async () => {
      try {
        const res = await updateProfile({
          bio: draft!.bio.trim(),
          skills: draft!.skills.trim(),
          interests: draft!.interests.trim(),
          experiences: draft!.experiences.map((s) => s.trim()).filter(Boolean).join("\n"),
        });
        if (!res.ok) {
          toast.error(res.message);
          return;
        }
        toast.success("Data diri tersimpan.");
      } finally {
        setSaving(false);
      }
    })();
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-[28px] font-bold tracking-tight text-black sm:text-[36px]">
          Data Diri
        </h1>
        <p className="text-[15px] text-zinc-500">
          {user.name} ({user.nim}) · {user.department}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 rounded-[20px] bg-white p-7 shadow-[0_2px_16px_rgba(30,60,110,0.06)]"
      >
        <label className="flex flex-col gap-1.5 text-[15px] font-medium text-black">
          Bio singkat
          <textarea
            value={bio}
            onChange={(e) => patch({ bio: e.target.value })}
            placeholder="Ceritakan dirimu..."
            rows={3}
            className={`resize-none py-3 ${inputClass}`}
          />
        </label>

        <label className="flex flex-col gap-1.5 text-[15px] font-medium text-black">
          Skills (pisahkan koma)
          <input
            value={skills}
            onChange={(e) => patch({ skills: e.target.value })}
            placeholder="cth. Python, Figma, Public Speaking"
            className={`h-[52px] ${inputClass}`}
          />
        </label>

        <label className="flex flex-col gap-1.5 text-[15px] font-medium text-black">
          Minat riset (pisahkan koma)
          <input
            value={interests}
            onChange={(e) => patch({ interests: e.target.value })}
            placeholder="cth. IoT, UI/UX"
            className={`h-[52px] ${inputClass}`}
          />
        </label>

        <div className="flex flex-col gap-2">
          <span className="text-[15px] font-medium text-black">Pengalaman</span>
          <ul className="flex flex-col gap-2">
            {experiences.map((exp, i) => (
              <li key={i} className="flex items-center gap-2">
                <span aria-hidden="true" className="text-[20px] leading-none text-[#2f5d9a]">
                  •
                </span>
                <input
                  value={exp}
                  onChange={(e) => setExpAt(i, e.target.value)}
                  placeholder={`Pengalaman ${i + 1}`}
                  aria-label={`Pengalaman ${i + 1}`}
                  className={`text-black h-[52px] flex-1 ${inputClass}`}
                />
                <button
                  type="button"
                  onClick={() => removeExp(i)}
                  aria-label={`Hapus pengalaman ${i + 1}`}
                  className="bg-red-500 flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[10px] border border-[#c9d4e2] text-[22px] text-zinc-500 transition-colors hover:bg-red-400"
                >
                  <p className="text-white">
                    -
                  </p>
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={addExp}
            className="mt-1 flex h-[48px] items-center justify-center gap-2 rounded-[10px] border border-dashed border-[#2f5d9a] text-[15px] font-medium text-[#2f5d9a] transition-colors hover:bg-[#eef4fb]"
          >
            + Tambah pengalaman
          </button>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex h-[54px] items-center justify-center gap-3 rounded-[14px] bg-[#2f5d9a] text-[18px] font-bold text-white transition-colors hover:bg-[#274d80] disabled:cursor-wait disabled:opacity-80"
        >
          {saving ? "MENYIMPAN..." : "SIMPAN"}
        </button>
      </form>
    </div>
  );
}
