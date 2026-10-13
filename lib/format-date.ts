// Format tanggal-jam ISO (timestamptz Supabase) ke tampilan Indonesia (WITA).
export function formatTanggal(value: string | null | undefined): string {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const tanggal = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Makassar",
  }).format(date);
  const jam = new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Makassar",
  })
    .format(date)
    .replace(":", ".");
  return `${tanggal}, ${jam}`;
}
