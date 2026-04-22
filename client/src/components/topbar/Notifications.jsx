import { Bell, CheckCheck } from "lucide-react";
import { DropdownPanel } from "./DropdownPanel";

export function Notifications({
  label,
  open,
  notifications,
  unreadCount,
  onToggle,
  onClose,
  onMarkRead,
  onMarkAllRead,
}) {
  return (
    <div className="relative">
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        className="relative btn-ghost cursor-pointer transition duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-100"
        onClick={onToggle}
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 ? (
          <span className="absolute right-1.5 top-1.5 inline-flex h-2.5 w-2.5 rounded-full bg-rose-500" />
        ) : null}
      </button>

      <DropdownPanel open={open} onClose={onClose} className="w-[340px]">
        <div className="flex items-center justify-between px-3 pb-2 pt-1">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-500">
              {label}
            </p>
            <p className="mt-1 text-sm text-ink-600">{unreadCount} {notifications[0]?.unreadLabel}</p>
          </div>
          <button
            type="button"
            className="btn-ghost !px-0"
            onClick={onMarkAllRead}
          >
            <CheckCheck className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-1">
          {notifications.map((notification) => (
            <button
              key={notification.id}
              type="button"
              className={`flex w-full cursor-pointer flex-col rounded-xl px-3 py-3 text-left transition duration-150 hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-100 ${
                notification.read ? "opacity-70" : ""
              }`}
              onClick={() => onMarkRead(notification.id)}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-ink-950">{notification.title}</span>
                {!notification.read ? (
                  <span className="h-2 w-2 rounded-full bg-brand-500" />
                ) : null}
              </div>
              <span className="mt-1 text-xs leading-5 text-ink-500">
                {notification.description}
              </span>
            </button>
          ))}
        </div>
      </DropdownPanel>
    </div>
  );
}
