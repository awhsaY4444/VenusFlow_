import { X } from "lucide-react";
import { SidebarNav } from "./SidebarNav";
import { Topbar } from "../components/topbar/Topbar";

export function AppShell({
  user,
  currentView,
  sidebarCollapsed,
  mobileSidebarOpen,
  searchQuery,
  onNavigate,
  onLogout,
  onToggleCollapse,
  onMobileMenuToggle,
  onSearchChange,
  onQuickAction,
  children,
}) {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Topbar
        user={user}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        onMobileMenuToggle={onMobileMenuToggle}
        onLogout={onLogout}
        onQuickAction={onQuickAction}
      />

      <div className="app-shell flex-1 overflow-hidden">
        <div className="hidden h-full lg:block">
          <SidebarNav
            user={user}
            currentView={currentView}
            collapsed={sidebarCollapsed}
            onToggleCollapse={onToggleCollapse}
            onNavigate={onNavigate}
            onLogout={onLogout}
          />
        </div>

        {mobileSidebarOpen ? (
          <div className="fixed inset-0 z-30 bg-ink-950/30 lg:hidden" onClick={onMobileMenuToggle}>
            <div
              className="h-full w-[280px] bg-surface"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex justify-end p-3">
                <button type="button" className="btn-ghost" onClick={onMobileMenuToggle}>
                  <X className="h-4 w-4" />
                </button>
              </div>
              <SidebarNav
                user={user}
                currentView={currentView}
                collapsed={false}
                onToggleCollapse={() => {}}
                onNavigate={(view) => {
                  onNavigate(view);
                  onMobileMenuToggle();
                }}
                onLogout={onLogout}
              />
            </div>
          </div>
        ) : null}

        <main className="h-full flex-1 overflow-y-auto bg-surface/30">
          <div className="flex w-full flex-col gap-8 px-4 py-8 sm:px-6 xl:px-10">
            {children}
          </div>
        </main>
      </div>
    </div>

  );
}
