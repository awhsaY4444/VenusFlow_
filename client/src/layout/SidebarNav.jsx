import {
  Activity,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  ListTodo,
  LogOut,
  Users,
} from "lucide-react";
import { Avatar } from "../components/ui/Avatar";

import { StatusBadge } from "../components/ui/StatusBadge";
import { t } from "../utils/i18n";

const navItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "tasks", label: "Tasks", icon: ListTodo },
  { id: "team", label: "Team", icon: Users },
  { id: "activity", label: "Activity", icon: Activity },
];

export function SidebarNav({
  user,
  currentView,
  collapsed,
  onToggleCollapse,
  onNavigate,
  onLogout,
}) {

  return (
    <aside
      className={`border-r border-line bg-surface flex flex-col h-full transition-all duration-200 ${
        collapsed ? "lg:w-[88px]" : "lg:w-[280px]"
      }`}
    >
      <div className="flex h-full flex-col gap-5 px-4 py-5 overflow-hidden">
        <div className="flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-ink-950 text-base font-bold text-white shadow-sm transition-transform duration-300 hover:scale-105">
              {user?.organizationName ? user.organizationName.charAt(0).toUpperCase() : "?"}
            </div>
            {!collapsed ? (
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink-950">
                  {user.organizationName}
                </p>
                <p className="truncate text-xs text-ink-500">{user.organizationSlug}</p>
              </div>
            ) : null}
          </div>

          <button type="button" className="btn-ghost hidden lg:inline-flex" onClick={onToggleCollapse}>
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto pr-2 -mr-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = currentView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`nav-item w-full ${active ? "nav-item-active" : ""} ${
                  collapsed ? "justify-center" : ""
                }`}
                onClick={() => onNavigate(item.id)}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!collapsed ? <span>{t("English", item.id)}</span> : null}
              </button>
            );
          })}
        </nav>

        <div className="glass-panel shrink-0 mt-auto p-4">
          <div className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>
            <Avatar name={user.name} />
            {!collapsed ? (
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink-950">{user.name}</p>
                <p className="truncate text-xs text-ink-500">{user.email}</p>
              </div>
            ) : null}
          </div>
          {!collapsed ? (
            <div className="mt-3 flex items-center justify-between">
              <StatusBadge value={user.role} />
              <button type="button" className="btn-ghost !px-0" onClick={onLogout}>
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button type="button" className="btn-ghost mt-3 w-full justify-center" onClick={onLogout}>
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </aside>

  );
}
