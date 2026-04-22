export function Avatar({ name, size = "md" }) {
  const initials = name
    ?.split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const sizeClass = size === "sm" ? "h-8 w-8 text-xs" : "h-10 w-10 text-sm";

  return (
    <div
      className={`inline-flex ${sizeClass} items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-cyan-500 font-semibold text-white`}
    >
      {initials || "NA"}
    </div>
  );
}
