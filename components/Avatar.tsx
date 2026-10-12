export default function Avatar({
  letter,
  variant = "user",
  size = 52,
}: {
  letter: string;
  variant?: "user" | "team";
  size?: number;
}) {
  const initial = (letter.trim().charAt(0) || "?").toUpperCase();
  return (
    <span
      aria-hidden="true"
      style={{ width: size, height: size, fontSize: Math.round(size * 0.38) }}
      className={`flex shrink-0 items-center justify-center rounded-full font-bold ${
        variant === "user"
          ? "bg-[#2f5d9a] text-white"
          : "bg-[#eef4fb] text-[#2f5d9a]"
      }`}
    >
      {initial}
    </span>
  );
}
