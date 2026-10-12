"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import EditTeamModal, { type EditTeamInput } from "@/components/EditTeamModal";
import { useLocalDb } from "@/components/LocalDbProvider";
import { useToast } from "@/components/Toast";
import type { Team } from "@/lib/team-types";

export default function TeamEditButton({ team }: { team: Team }) {
  const { myRole, updateTeam } = useLocalDb();
  const toast = useToast();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  if (myRole(team.id) !== "Leader") return null;

  function handleSave(input: EditTeamInput) {
    setError("");
    void (async () => {
      const res = await updateTeam(team.id, input);
      if (!res.ok) {
        setError(res.message);
        return;
      }
      setOpen(false);
      toast.success("Info tim tersimpan.");
      // Muat ulang data server (judul/breadcrumb) tanpa reload penuh.
      router.refresh();
    })();
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setError("");
          setOpen(true);
        }}
        className="flex h-[48px] items-center gap-2 rounded-[10px] border border-[#2f5d9a] px-6 text-[16px] font-medium text-[#2f5d9a] transition-colors hover:bg-[#eef4fb]"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 20h4L19.5 8.5a2.1 2.1 0 0 0-3-3L5 17l-1 3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="m14.5 6.5 3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        Edit Info
      </button>
      <EditTeamModal
        key={open ? "open" : "closed"}
        open={open}
        team={team}
        error={error}
        onClose={() => setOpen(false)}
        onSave={handleSave}
      />
    </>
  );
}
