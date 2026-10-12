"use client";

import Avatar from "@/components/Avatar";
import { useLocalDb } from "@/components/LocalDbProvider";

function splitList(value: string): string[] {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function splitLines(value: string): string[] {
  return value
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function ProfileModal({
  nim,
  onClose,
}: {
  nim: string | null;
  onClose: () => void;
}) {
  const { users } = useLocalDb();

  if (!nim) return null;
  const profile = users.find((u) => u.nim === nim);
  if (!profile) return null;

  const skills = splitList(profile.skills ?? "");
  const interests = splitList(profile.interests ?? "");
  const experiences = splitLines(profile.experiences ?? "");

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Data diri ${profile.name}`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-[560px] overflow-y-auto rounded-[20px] bg-white p-8 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-4">
          <Avatar letter={profile.name} variant="user" size={64} />
          <div className="min-w-0">
            <p className="truncate text-[22px] font-bold text-black">
              {profile.name}
            </p>
            <p className="text-[14px] text-zinc-500">
              {profile.nim} · {profile.department}
            </p>
          </div>
        </div>

        {profile.bio && (
          <p className="mt-5 text-[15px] leading-relaxed text-[#333]">
            {profile.bio}
          </p>
        )}

        {skills.length > 0 && (
          <div className="mt-5">
            <p className="text-[13px] tracking-widest text-zinc-400">SKILLS</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {skills.map((s) => (
                <span
                  key={s}
                  className="rounded-full bg-[#e8e8e8] px-3 py-1.5 text-[14px] text-[#555]"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {interests.length > 0 && (
          <div className="mt-5">
            <p className="text-[13px] tracking-widest text-zinc-400">MINAT RISET</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {interests.map((s) => (
                <span
                  key={s}
                  className="rounded-full bg-[#eef4fb] px-3 py-1.5 text-[14px] text-[#2f5d9a]"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {experiences.length > 0 && (
          <div className="mt-5">
            <p className="text-[13px] tracking-widest text-zinc-400">PENGALAMAN</p>
            <ul className="mt-2 flex list-disc flex-col gap-1.5 pl-5 text-[15px] text-black">
              {experiences.map((exp, i) => (
                <li key={i}>{exp}</li>
              ))}
            </ul>
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          className="mt-7 h-[52px] w-full rounded-[10px] border border-[#2f5d9a] text-[17px] font-medium text-[#2f5d9a] transition-colors hover:bg-[#eef4fb]"
        >
          Tutup
        </button>
      </div>
    </div>
  );
}
