import { t } from "../../utils/i18n";

const statusClasses = {
  todo: "bg-slate-100 text-slate-700",
  in_progress: "bg-amber-100 text-amber-700",
  done: "bg-emerald-100 text-emerald-700",
  high: "bg-rose-100 text-rose-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-emerald-100 text-emerald-700",
  admin: "bg-brand-100 text-brand-700",
  member: "bg-slate-100 text-slate-700",
};

function formatLabel(value) {
  return t("English", value) || value.replaceAll("_", " ");
}

export function StatusBadge({ value }) {
  return (
    <span
      className={`inline-flex items-center justify-center min-w-[5.5rem] h-6 rounded-full px-2.5 text-xs font-bold capitalize leading-none tracking-wide ${
        statusClasses[value] || "bg-slate-100 text-slate-700"
      }`}
    >
      {formatLabel(value)}
    </span>
  );
}
