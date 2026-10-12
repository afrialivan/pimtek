"use client";

import { useState } from "react";
import { PKM_SCHEMES, countWords } from "@/lib/team-types";

export interface NewTeamInput {
  title: string;
  ideaOverview: string;
  scheme: string;
  groupLink: string;
  deadline: string;
}

const inputClass =
  "rounded-[10px] border border-[#c9d4e2] px-4 font-normal outline-none placeholder:text-zinc-400 focus:border-[#2f5d9a]";

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value.trim());
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function autoresize(el: HTMLTextAreaElement | null) {
  if (!el) return;
  el.style.height = "auto";
  el.style.height = `${el.scrollHeight}px`;
}

export default function CreateTeamModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (input: NewTeamInput) => void;
}) {
  const [title, setTitle] = useState("");
  const [ideaOverview, setIdeaOverview] = useState("");
  const [scheme, setScheme] = useState("");
  const [groupLink, setGroupLink] = useState("");
  const [deadline, setDeadline] = useState("");

  function reset() {
    setTitle("");
    setIdeaOverview("");
    setScheme("");
    setGroupLink("");
    setDeadline("");
  }

  function handleClose() {
    reset();
    onClose();
  }

  if (!open) return null;

  const linkOk = groupLink.trim().length > 0 && isValidUrl(groupLink);
  const canSubmit =
    title.trim().length > 0 &&
    ideaOverview.trim().length > 0 &&
    scheme.length > 0 &&
    linkOk &&
    deadline.length > 0;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Buat tim baru"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={handleClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-[600px] overflow-y-auto rounded-[20px] bg-white p-8 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-[26px] font-bold tracking-tight text-black">
          Make a new team
        </h2>
        <p className="mt-1 text-[15px] text-zinc-500">
          Semua field wajib diisi.
        </p>

        <form
          className="mt-6 flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!canSubmit) return;
            onCreate({
              title: title.trim(),
              ideaOverview: ideaOverview.trim(),
              scheme,
              groupLink: groupLink.trim(),
              deadline,
            });
            reset();
            onClose();
          }}
        >
          <label className="flex flex-col gap-1.5 text-[15px] font-medium text-black">
            Judul ide
            <textarea
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                autoresize(e.target);
              }}
              placeholder="Judul ide tim"
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
              value={ideaOverview}
              onChange={(e) => {
                setIdeaOverview(e.target.value);
                autoresize(e.target);
              }}
              placeholder="Ringkas ide / gagasan yang akan dikerjakan..."
              rows={3}
              className={`resize-none overflow-hidden py-3 ${inputClass}`}
            />
          </label>

          <label className="flex flex-col gap-1.5 text-[15px] font-medium text-black">
            Skim PKM
            <select
              value={scheme}
              onChange={(e) => setScheme(e.target.value)}
              className={`h-[52px] cursor-pointer appearance-none bg-white ${inputClass} ${
                scheme ? "" : "text-zinc-400"
              }`}
            >
              <option value="" disabled>
                Pilih skim PKM...
              </option>
              {PKM_SCHEMES.map((s) => (
                <option className="text-black" key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5 text-[15px] font-medium text-black">
            Link grup WA
            <input
              type="url"
              value={groupLink}
              onChange={(e) => setGroupLink(e.target.value)}
              placeholder="https://chat.whatsapp.com/..."
              className={`h-[52px] ${inputClass}`}
            />
            {groupLink.trim().length > 0 && !linkOk && (
              <span className="text-[13px] font-normal text-red-600">
                Link harus URL valid diawali http:// atau https://
              </span>
            )}
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

          <div className="mt-2 flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="h-[52px] flex-1 rounded-[10px] border border-[#2f5d9a] text-[17px] font-medium text-[#2f5d9a] transition-colors hover:bg-[#eef4fb]"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              className="h-[52px] flex-1 rounded-[10px] bg-[#2f5d9a] text-[17px] font-medium text-white transition-colors hover:bg-[#274d80] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Buat Tim
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
