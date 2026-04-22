import { Building2, Check, ChevronDown } from "lucide-react";
import { DropdownPanel } from "./DropdownPanel";

export function WorkspaceSwitcher({
  currentWorkspace,
  label,
  workspaces,
  open,
  onToggle,
  onClose,
  onSelect,
}) {
  return (
    <div className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        className="btn-secondary min-w-[190px] cursor-pointer justify-between transition duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-100"
        onClick={onToggle}
      >
        <span className="truncate">{currentWorkspace.name}</span>
        <ChevronDown className={`h-4 w-4 transition duration-150 ${open ? "rotate-180" : ""}`} />
      </button>

      <DropdownPanel open={open} onClose={onClose} align="left" className="w-[260px]">
        <div className="px-3 pb-2 pt-1">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-500">
            {label}
          </p>
        </div>

        <div className="space-y-1">
          {workspaces.map((workspace) => {
            const active = workspace.id === currentWorkspace.id;

            return (
              <button
                key={workspace.id}
                type="button"
                className="flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-left transition duration-150 hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-100"
                onClick={() => onSelect(workspace)}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-muted text-ink-700">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-ink-950">{workspace.name}</p>
                    <p className="text-xs text-ink-500">{workspace.slug}</p>
                  </div>
                </div>
                {active ? <Check className="h-4 w-4 text-brand-600" /> : null}
              </button>
            );
          })}
        </div>
      </DropdownPanel>
    </div>
  );
}
