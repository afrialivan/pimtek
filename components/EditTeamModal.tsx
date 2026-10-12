"use client";

import { useState } from "react";
import { PKM_SCHEMES, countWords } from "@/lib/team-types";
import type { Team } from "@/lib/team-types";

export interface EditTeamInput {
  title: string;
  ideaOverview: string;
  scheme: string;
  groupLink: string;
  deadline: string;
  status: string;
}

const inputClass =
  "rounded-[10px] border border-[#c9d4e2] px-4 font-normal outline-none placeholder:text-zinc-400 focus:border-[#2f5d9a]";

const TEAM_STATUSES = ["Berjalan", "Selesai"];

function autoresize(el: HTMLTextAreaElement | null) {
  if (!el) return;
  el.style.height = "auto";
  el.style.height = `${el.scrollHeight}px`;
}

export default function EditTeamModal({
  open,
  team,
  error,
  onClose,
  onSave,
}: {
  open: boolean;
  team: Team;
  error: string;
  onClose: () => void;
  onSave: (input: EditTeamInput) => void;
}) {
  const [title, setTitle] = useState(team.title);
  const [ideaOverview, setIdeaOverview] = useState(team.ideaOverview ?? "");
  const [scheme, setScheme] = useState(team.scheme ?? "");
  const [groupLink, setGroupLink] = useState(team.groupLink ?? "");
  const [deadline, setDeadline] = useState(team.deadline);
  const [status, setStatus] = useState(team.status);

  if (!open) return null;

  const canSubmit =
    title.trim().length > 0 &&
    ideaOverview.trim().length > 0 &&
    scheme.length > 0 &&
    groupLink.trim().length > 0 &&
    deadline.length > 0 &&
    status.length > 0;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Edit info tim"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-[600px] overflow-y-auto rounded-[20px] bg-white p-8 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-[26px] font-bold tracking-tight text-black">
          Edit Info Tim
        </h2>
        <p className="mt-1 text-[15px] text-zinc-500">
          Semua field wajib diisi.
        </p>

        {error && (
          <p role="alert" className="mt-4 rounded-[10px] bg-[#fde4e4] px-4 py-3 text-[15px] text-[#8f1d1d]">
            {error}
          </p>
        )}

        <form
          className="mt-6 flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!canSubmit) return;
            onSave({
              title: title.trim(),
              ideaOverview: ideaOverview.trim(),
              scheme,
              groupLink: groupLink.trim(),
              deadline,
              status,
            });
          }}
        >
          <label className="flex flex-col gap-1.5 text-[15px] font-medium text-black">
            Judul ide
            <textarea
              ref={(el) => autoresize(el)}
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                autoresize(e.target);
              }}
              rows={1}
              className={`min-h-[52px] resize-none overflow-hidden py-3 ${inputClass}`}
            />
            {countWords(title) > 20 && (
              <span className="text-[13px] font-normal text-[#b07d10]">
                Judul lebih dari 20 kata, sebaiknya dikurangi.
              </span>
            )}
          </label>

          <label className="flex flex-col gap-1.5 text-[15px] font-medium text-black">
            Gambaran umum ide
            <textarea
              ref={(el) => autoresize(el)}
              value={ideaOverview}
              onChange={(e) => {
                setIdeaOverview(e.target.value);
                autoresize(e.target);
              }}
              rows={3}
              className={`resize-none overflow-hidden py-3 ${inputClass}`}
            />
          </label>

          <label className="flex flex-col gap-1.5 text-[15px] font-medium text-black">
            Skim PKM
            <select
              value={scheme}
              onChange={(e) => setScheme(e.target.value)}
              className={`h-[52px] cursor-pointer appearance-none bg-white ${inputClass}`}
            >
              <option value="" disabled>
                Pilih skim PKM...
              </option>
              {PKM_SCHEMES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5 text-[15px] font-medium text-black">
            Link grup WA
            <input
              value={groupLink}
              onChange={(e) => setGroupLink(e.target.value)}
              className={`h-[52px] ${inputClass}`}
            />
          </label>

          <label className="flex flex-col gap-1.5 text-[15px] font-medium text-black">
            Deadline
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className={`h-[52px] ${inputClass}`}
            />
          </label>

          <label className="flex flex-col gap-1.5 text-[15px] font-medium text-black">
            Status
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={`h-[52px] cursor-pointer appearance-none bg-white ${inputClass}`}
            >
              {TEAM_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>

          <div className="mt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="h-[52px] flex-1 rounded-[10px] border border-[#2f5d9a] text-[17px] font-medium text-[#2f5d9a] transition-colors hover:bg-[#eef4fb]"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              className="h-[52px] flex-1 rounded-[10px] bg-[#2f5d9a] text-[17px] font-medium text-white transition-colors hover:bg-[#274d80] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
