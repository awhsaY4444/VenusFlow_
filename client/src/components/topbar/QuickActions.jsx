import { ChevronDown, Sparkles } from "lucide-react";
import { t } from "../../utils/i18n";
import { DropdownPanel } from "./DropdownPanel";

export function QuickActions({ label, open, onToggle, onClose, onAction }) {
  const actions = [
    {
      id: "create-task",
      title: t("English", "createTask"),
      description: t("English", "createTaskDescription"),
    },
    {
      id: "invite-member",
      title: t("English", "inviteMember"),
      description: t("English", "inviteMemberDescription"),
    },
  ];

  return (
    <div className="relative hidden sm:block">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        className="btn-ghost cursor-pointer transition duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-100"
        onClick={onToggle}
      >
        <Sparkles className="h-4 w-4" />
        {label}
        <ChevronDown className={`h-4 w-4 transition duration-150 ${open ? "rotate-180" : ""}`} />
      </button>

      <DropdownPanel open={open} onClose={onClose} className="w-[300px]">
        <div className="px-3 pb-2 pt-1">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-500">
            {label}
          </p>
        </div>

        <div className="space-y-1">
          {actions.map((action) => (
            <button
              key={action.id}
              type="button"
              className="flex w-full cursor-pointer flex-col rounded-xl px-3 py-3 text-left transition duration-150 hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-100"
              onClick={() => onAction(action.id)}
            >
              <span className="text-sm font-medium text-ink-950">{action.title}</span>
              <span className="mt-1 text-xs leading-5 text-ink-500">{action.description}</span>
            </button>
          ))}
        </div>
      </DropdownPanel>
    </div>
  );
}
