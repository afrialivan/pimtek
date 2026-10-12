"use client";

import { useLocalDb } from "@/components/LocalDbProvider";
import Avatar from "@/components/Avatar";

export default function TeamsHeader() {
  const { user } = useLocalDb();

  return (
    <div className="flex flex-wrap items-center justify-end gap-4">
      {user ? (
        <Avatar letter={user.name} variant="user" size={52} />
      ) : (
        <span
          aria-hidden="true"
          className="h-[52px] w-[52px] rounded-full bg-[#e2e9f2]"
        />
      )}
      <span className="leading-tight">
        <span className="block text-[19px] font-bold text-black">
          {user?.name ?? "..."}
        </span>
        <span className="block text-[15px] text-zinc-500">
          {user ? user.nim : ""}
        </span>
      </span>
    </div>
  );
}
