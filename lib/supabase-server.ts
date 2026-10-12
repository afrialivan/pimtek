// Server-only: klien REST Supabase (PostgREST) memakai service_role key.
// JANGAN import file ini dari client component.
const SUPABASE_URL = process.env.SUPABASE_URL ?? "";
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

export function isSupabaseConfigured(): boolean {
  return SUPABASE_URL.length > 0 && SERVICE_KEY.length > 0;
}

export class SupabaseNotConfiguredError extends Error {
  constructor() {
    super(
      "Supabase belum dikonfigurasi. Isi SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY di .env.local."
    );
  }
}

interface RestOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  query?: string;
  body?: unknown;
}

async function rest<T>(table: string, opts: RestOptions = {}): Promise<T> {
  if (!isSupabaseConfigured()) throw new SupabaseNotConfiguredError();
  const url = `${SUPABASE_URL}/rest/v1/${table}${opts.query ? `?${opts.query}` : ""}`;
  const res = await fetch(url, {
    method: opts.method ?? "GET",
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Supabase error ${res.status}: ${text.slice(0, 300)}`);
  }
  if (res.status === 204) return [] as unknown as T;
  return (await res.json()) as T;
}

export const db = {
  select: <T>(table: string, query = "select=*") =>
    rest<T[]>(table, { query }),
  insert: <T>(table: string, rows: unknown) =>
    rest<T[]>(table, { method: "POST", body: rows }),
  update: <T>(table: string, match: string, patch: unknown) =>
    rest<T[]>(table, { method: "PATCH", query: match, body: patch }),
  del: (table: string, match: string) =>
    rest<unknown[]>(table, { method: "DELETE", query: match }),
};
