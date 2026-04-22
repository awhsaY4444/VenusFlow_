import { ChevronDown, LogOut, Settings, User } from "lucide-react";
import { t } from "../../utils/i18n";
import { Avatar } from "../ui/Avatar";
import { DropdownPanel } from "./DropdownPanel";

export function UserMenu({ user, open, onToggle, onClose, onAction }) {
  const items = [
    { id: "profile", label: t("English", "profile"), icon: User },
    { id: "settings", label: t("English", "settings"), icon: Settings },
    { id: "logout", label: t("English", "logout"), icon: LogOut },
  ];

  return (
    <div className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        className="hidden cursor-pointer items-center gap-3 rounded-xl border border-line bg-surface px-3 py-2 transition duration-150 hover:border-ink-500 sm:flex focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-100"
        onClick={onToggle}
      >
        <Avatar name={user.name} size="sm" />
        <div className="max-w-[120px] truncate text-left">
          <p className="truncate text-sm font-medium text-ink-950">{user.name}</p>
          <p className="truncate text-xs text-ink-500">{t("English", user.role)}</p>
        </div>
        <ChevronDown className={`h-4 w-4 text-ink-500 transition duration-150 ${open ? "rotate-180" : ""}`} />
      </button>

      <DropdownPanel open={open} onClose={onClose} className="w-[220px]">
        <div className="px-3 pb-2 pt-1">
          <p className="text-sm font-semibold text-ink-950">{user.name}</p>
          <p className="text-xs text-ink-500">{user.email}</p>
        </div>

        <div className="space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-ink-700 transition duration-150 hover:bg-surface-muted hover:text-ink-950 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-100"
                onClick={() => onAction(item.id)}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </div>
      </DropdownPanel>
    </div>
  );
}
