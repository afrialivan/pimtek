// Bentuk data Tim dari API (Supabase). Tidak ada lagi data statis lokal.
export interface Team {
  id: string;
  /** Judul ide — satu-satunya judul tim. */
  title: string;
  scheme?: string;
  groupLink?: string;
  ideaOverview?: string;
  about: string;
  status: string;
  leader: string;
  createdAt: string;
  deadline: string;
  tasksDone: number;
  tasksTotal: number;
  memberExtra: string;
  isOwned?: boolean;
  isLocal?: boolean;
}

export const PKM_SCHEMES = [
  "PKM-RE",
  "PKM-RSH",
  "PKM-K",
  "PKM-PI",
  "PKM-PM",
  "PKM-KC",
  "PKM-KI",
  "PKM-VGK",
  "PKM-GFT",
] as const;

export type PkmScheme = (typeof PKM_SCHEMES)[number];

export function countWords(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean);
  return text.trim().length === 0 ? 0 : words.length;
}
