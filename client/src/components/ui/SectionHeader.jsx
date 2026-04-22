export function SectionHeader({ kicker, title, description, actions }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-1.5">
        {kicker ? <p className="section-kicker">{kicker}</p> : null}
        <h2 className="section-title">{title}</h2>
        {description ? <p className="text-sm text-ink-600">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
    </div>
  );
}
