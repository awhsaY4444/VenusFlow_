export function EmptyState({ title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-surface-muted px-6 py-12 text-center">
      <div className="mb-4 h-12 w-12 rounded-2xl bg-white shadow-sm" />
      <h3 className="text-lg font-semibold text-ink-950">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-ink-600">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
