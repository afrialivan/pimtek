"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { NewTeamInput } from "@/components/CreateTeamModal";
import type { Team } from "@/lib/team-types";

export interface LocalUser {
  nim: string;
  name: string;
  department: string;
  role: string;
  bio: string;
  skills: string;
  interests: string;
  experiences: string;
}

export interface Department {
  id: string;
  name: string;
}

export interface Membership {
  teamId: string;
  nim: string;
  role: string;
}

export interface JoinRequest {
  id: string;
  teamId: string;
  nim: string;
  name: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export type JoinResult =
  | { ok: true }
  | { ok: false; reason: "member" | "pending" };

interface LocalDbContextValue {
  ready: boolean;
  /** Pesan error konfigurasi (mis. Supabase belum diset). */
  dbError: string | null;
  user: LocalUser | null;
  users: LocalUser[];
  teams: Team[];
  departments: Department[];
  memberships: Membership[];
  requests: JoinRequest[];
  myTeamIds: string[];
  myPendingIds: string[];
  login: (
    nim: string,
    password: string,
    remember: boolean
  ) => Promise<{ ok: boolean; user: LocalUser | null; message: string }>;
  logout: () => void;
  register: (input: {
    nim: string;
    name: string;
    department: string;
    password: string;
  }) => Promise<{ ok: boolean; message: string }>;
  createTeam: (
    input: NewTeamInput
  ) => Promise<{ ok: boolean; message: string }>;
  updateTeam: (
    teamId: string,
    input: {
      title: string;
      ideaOverview: string;
      scheme: string;
      groupLink: string;
      deadline: string;
      status: string;
    }
  ) => Promise<{ ok: boolean; message: string }>;
  requestJoin: (teamId: string) => Promise<JoinResult>;
  cancelRequest: (teamId: string) => Promise<void>;
  approveRequest: (id: string) => Promise<boolean>;
  rejectRequest: (id: string) => Promise<void>;
  leaveTeam: (
    teamId: string,
    successorNim?: string
  ) => Promise<{ ok: boolean; message: string }>;
  deleteTeam: (teamId: string) => Promise<{ ok: boolean; message: string }>;
  resetDatabase: () => Promise<void>;
  refreshData: () => void;
  adminUpdateUser: (input: {
    nim: string;
    name: string;
    department: string;
    role: string;
    newPassword?: string;
  }) => Promise<{ ok: boolean; message: string }>;
  adminDeleteUser: (nim: string) => Promise<{ ok: boolean; message: string }>;
  updateProfile: (input: {
    bio: string;
    skills: string;
    interests: string;
    experiences: string;
  }) => Promise<{ ok: boolean; message: string }>;
  pendingForTeam: (teamId: string) => JoinRequest[];
  myRole: (teamId: string) => string | null;
}

const LocalDbContext = createContext<LocalDbContextValue | null>(null);

const SESSION_KEY = "okft.session";

function getSessionNim(): string | null {
  if (typeof window === "undefined") return null;
  return (
    window.localStorage.getItem(SESSION_KEY) ??
    window.sessionStorage.getItem(SESSION_KEY)
  );
}

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, init);
  const data = (await res.json().catch(() => ({}))) as T & { error?: string };
  if (!res.ok) {
    throw new Error(data.error ?? `Request gagal (${res.status}).`);
  }
  return data;
}

export default function LocalDbProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);
  const [nim, setNim] = useState<string | null>(null);
  const [user, setUser] = useState<LocalUser | null>(null);
  const [users, setUsers] = useState<LocalUser[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [tick, setTick] = useState(0);

  const refresh = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const sessionNim = getSessionNim();
        const [userList, teamList, departmentList, allMemberships, allRequests] =
          await Promise.all([
            api<LocalUser[]>("/api/users"),
            api<Team[]>("/api/teams"),
            api<Department[]>("/api/departments"),
            api<Membership[]>("/api/memberships"),
            api<JoinRequest[]>("/api/requests?pending=0"),
          ]);
        if (cancelled) return;
        const current =
          userList.find((u) => u.nim === sessionNim) ?? null;
        setNim(sessionNim);
        setUser(current);
        setUsers(userList);
        setTeams(teamList);
        setDepartments(departmentList);
        setMemberships(allMemberships);
        setRequests(allRequests);
        setDbError(null);
      } catch (error) {
        if (cancelled) return;
        setDbError(
          error instanceof Error ? error.message : "Gagal memuat data."
        );
      } finally {
        if (!cancelled) setReady(true);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [tick]);

  const myTeamIds = useMemo(
    () => memberships.filter((m) => m.nim === nim).map((m) => m.teamId),
    [memberships, nim]
  );
  const myPendingIds = useMemo(
    () =>
      requests
        .filter((r) => r.nim === nim && r.status === "pending")
        .map((r) => r.teamId),
    [requests, nim]
  );

  const value = useMemo<LocalDbContextValue>(
    () => ({
      ready,
      dbError,
      user,
      users,
      teams,
      departments,
      memberships,
      requests,
      myTeamIds,
      myPendingIds,
      login: async (nimInput, password, remember) => {
        try {
          const data = await api<{
            ok: boolean;
            user?: LocalUser;
            message?: string;
          }>("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nim: nimInput, password }),
          });
          if (!data.ok || !data.user) {
            return {
              ok: false,
              user: null,
              message: data.message ?? "NIM atau password salah.",
            };
          }
          if (typeof window !== "undefined") {
            if (remember) {
              window.localStorage.setItem(SESSION_KEY, data.user.nim);
              window.sessionStorage.removeItem(SESSION_KEY);
            } else {
              window.sessionStorage.setItem(SESSION_KEY, data.user.nim);
              window.localStorage.removeItem(SESSION_KEY);
            }
          }
          // Optimistic: set user seketika agar guard tidak memantulkan
          // balik ke /login selagi refresh berjalan.
          setNim(data.user.nim);
          setUser(data.user);
          refresh();
          return { ok: true, user: data.user, message: "" };
        } catch (error) {
          return {
            ok: false,
            user: null,
            message:
              error instanceof Error ? error.message : "Login gagal.",
          };
        }
      },
      logout: () => {
        if (typeof window !== "undefined") {
          window.localStorage.removeItem(SESSION_KEY);
          window.sessionStorage.removeItem(SESSION_KEY);
        }
        // Langsung nol-kan user agar AuthGuard tidak sempat memantulkan
        // balik ke "/" (user basi + halaman publik = redirect ke "/").
        setUser(null);
        setNim(null);
        refresh();
      },
      register: async (input) => {
        try {
          const data = await api<{ ok: boolean; message?: string }>(
            "/api/auth/register",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                nim: input.nim,
                name: input.name,
                department: input.department,
                password: input.password,
              }),
            }
          );
          if (data.ok) refresh();
          return { ok: data.ok, message: data.message ?? "" };
        } catch (error) {
          return {
            ok: false,
            message: error instanceof Error ? error.message : "Gagal mendaftar.",
          };
        }
      },
      createTeam: async (input) => {
        if (!nim) return { ok: false, message: "Silakan login dulu." };
        try {
          await api("/api/teams", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...input, leaderNim: nim }),
          });
          refresh();
          return { ok: true, message: "" };
        } catch (error) {
          return {
            ok: false,
            message: error instanceof Error ? error.message : "Gagal membuat tim.",
          };
        }
      },
      updateTeam: async (teamId, input) => {
        if (!nim) return { ok: false, message: "Silakan login dulu." };
        try {
          await api(`/api/teams/${encodeURIComponent(teamId)}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              actorNim: nim,
              patch: {
                title: input.title,
                idea_overview: input.ideaOverview,
                about: input.ideaOverview,
                scheme_id: input.scheme,
                group_link: input.groupLink,
                deadline: input.deadline,
                status: input.status,
              },
            }),
          });
          refresh();
          return { ok: true, message: "" };
        } catch (error) {
          return {
            ok: false,
            message: error instanceof Error ? error.message : "Gagal menyimpan.",
          };
        }
      },
      requestJoin: async (teamId) => {
        if (!nim) return { ok: false, reason: "member" };
        try {
          const data = await api<{ ok: boolean; reason?: "member" | "pending" }>(
            "/api/requests",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ teamId, nim }),
            }
          );
          refresh();
          return data.ok ? { ok: true } : { ok: false, reason: data.reason ?? "member" };
        } catch {
          return { ok: false, reason: "member" };
        }
      },
      cancelRequest: async (teamId) => {
        if (!nim) return;
        await api("/api/requests", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ teamId, nim }),
        }).catch(() => undefined);
        refresh();
      },
      approveRequest: async (id) => {
        if (!nim) return false;
        try {
          await api("/api/requests", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, action: "approve", actorNim: nim }),
          });
          refresh();
          return true;
        } catch {
          refresh();
          return false;
        }
      },
      rejectRequest: async (id) => {
        if (!nim) return;
        await api("/api/requests", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, action: "reject", actorNim: nim }),
        }).catch(() => undefined);
        refresh();
      },
      leaveTeam: async (teamId, successorNim) => {
        if (!nim) return { ok: false, message: "Silakan login dulu." };
        try {
          await api("/api/memberships", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ teamId, nim, successorNim }),
          });
          refresh();
          return { ok: true, message: "" };
        } catch (error) {
          return {
            ok: false,
            message: error instanceof Error ? error.message : "Gagal keluar tim.",
          };
        }
      },
      deleteTeam: async (teamId) => {
        if (!nim) return { ok: false, message: "Silakan login dulu." };
        try {
          await api(`/api/teams/${encodeURIComponent(teamId)}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ actorNim: nim }),
          });
          refresh();
          return { ok: true, message: "" };
        } catch (error) {
          return {
            ok: false,
            message: error instanceof Error ? error.message : "Gagal menghapus tim.",
          };
        }
      },
      resetDatabase: async () => {
        await api("/api/admin/reset", { method: "POST" });
        refresh();
      },
      adminUpdateUser: async (input) => {
        if (!nim) return { ok: false, message: "Silakan login dulu." };
        try {
          await api("/api/users", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...input, actorNim: nim }),
          });
          refresh();
          return { ok: true, message: "" };
        } catch (error) {
          return {
            ok: false,
            message: error instanceof Error ? error.message : "Gagal menyimpan user.",
          };
        }
      },
      adminDeleteUser: async (targetNim) => {
        if (!nim) return { ok: false, message: "Silakan login dulu." };
        try {
          await api("/api/users", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nim: targetNim, actorNim: nim }),
          });
          refresh();
          return { ok: true, message: "" };
        } catch (error) {
          return {
            ok: false,
            message: error instanceof Error ? error.message : "Gagal menghapus user.",
          };
        }
      },
      updateProfile: async (input) => {
        if (!nim) return { ok: false, message: "Silakan login dulu." };
        try {
          await api("/api/users", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nim, ...input }),
          });
          refresh();
          return { ok: true, message: "" };
        } catch (error) {
          return {
            ok: false,
            message: error instanceof Error ? error.message : "Gagal menyimpan profil.",
          };
        }
      },
      refreshData: () => {
        refresh();
      },
      pendingForTeam: (teamId) =>
        requests.filter((r) => r.teamId === teamId && r.status === "pending"),
      myRole: (teamId) =>
        memberships.find((m) => m.teamId === teamId && m.nim === nim)?.role ??
        null,
    }),
    [ready, dbError, user, users, teams, departments, memberships, requests, myTeamIds, myPendingIds, nim, refresh]
  );

  return (
    <LocalDbContext.Provider value={value}>
      {children}
    </LocalDbContext.Provider>
  );
}

export function useLocalDb(): LocalDbContextValue {
  const ctx = useContext(LocalDbContext);
  if (!ctx) throw new Error("useLocalDb harus dipakai di dalam LocalDbProvider");
  return ctx;
}
