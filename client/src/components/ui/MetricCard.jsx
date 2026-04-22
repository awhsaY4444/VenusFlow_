export function MetricCard({ icon: Icon, label, value, tone = "default" }) {
  const toneClass =
    tone === "success"
      ? "bg-emerald-50 text-emerald-700"
      : tone === "warning"
        ? "bg-amber-50 text-amber-700"
        : tone === "danger"
          ? "bg-rose-50 text-rose-700"
          : "bg-slate-100 text-slate-700";

  return (
    <article className="surface-panel p-5 transition hover:-translate-y-0.5 hover:shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-ink-600">{label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-ink-950">{value}</p>
        </div>
        <div className={`rounded-xl p-2.5 ${toneClass}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </article>
  );
}
