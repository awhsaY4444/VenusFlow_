import { PanelLeft } from "lucide-react";
import { useMemo, useState } from "react";
import { t } from "../../utils/i18n";
import { Notifications } from "./Notifications";
import { QuickActions } from "./QuickActions";
import { SearchBar } from "./SearchBar";
import { UserMenu } from "./UserMenu";
import { WorkspaceSwitcher } from "./WorkspaceSwitcher";

const mockNotifications = [
  {
    id: "n1",
    titleKey: "taskUpdated",
    descriptionKey: "taskUpdatedDescription",
    read: false,
  },
  {
    id: "n2",
    titleKey: "newComment",
    descriptionKey: "newCommentDescription",
    read: false,
  },
  {
    id: "n3",
    titleKey: "teamChange",
    descriptionKey: "teamChangeDescription",
    read: true,
  },
];

function createMockWorkspaces(user) {
  return [
    {
      id: "current",
      name: user.organizationName,
      slug: user.organizationSlug,
    },
    {
      id: "studio",
      name: "Orbit Studio",
      slug: "orbit-studio",
    },
    {
      id: "labs",
      name: "Northstar Labs",
      slug: "northstar-labs",
    },
  ];
}

export function Topbar({
  user,
  searchQuery,
  onSearchChange,
  onMobileMenuToggle,
  onLogout,
  onQuickAction,
}) {
  const [openMenu, setOpenMenu] = useState(null);
  const [currentWorkspace, setCurrentWorkspace] = useState({
    id: "current",
    name: user.organizationName,
    slug: user.organizationSlug,
  });
  const [notifications, setNotifications] = useState(mockNotifications);

  const workspaces = useMemo(() => createMockWorkspaces(user), [user]);
  const localizedNotifications = useMemo(
    () =>
      notifications.map((notification) => ({
        ...notification,
        title: t("English", notification.titleKey),
        description: t("English", notification.descriptionKey),
        unreadLabel: t("English", "unread"),
      })),
    [notifications]
  );
  const unreadCount = notifications.filter((item) => !item.read).length;

  function toggleMenu(menuName) {
    setOpenMenu((current) => (current === menuName ? null : menuName));
  }

  function closeMenus() {
    setOpenMenu(null);
  }

  function handleWorkspaceSelect(workspace) {
    setCurrentWorkspace(workspace);
    closeMenus();
  }

  function handleQuickAction(actionId) {
    onQuickAction(actionId);
    closeMenus();
  }

  function handleMarkRead(notificationId) {
    setNotifications((current) =>
      current.map((item) =>
        item.id === notificationId ? { ...item, read: true } : item
      )
    );
  }

  function handleMarkAllRead() {
    setNotifications((current) => current.map((item) => ({ ...item, read: true })));
  }

  function handleUserAction(actionId) {
    if (actionId === "logout") {
      onLogout();
    }

    if (actionId === "profile") {
      onQuickAction("open-profile");
    }

    if (actionId === "settings") {
      onQuickAction("open-settings");
    }

    closeMenus();
  }

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-surface">
      <div className="flex items-center gap-3 px-4 py-3 sm:px-6 xl:px-10">
        <button
          type="button"
          className="btn-ghost cursor-pointer lg:hidden"
          onClick={onMobileMenuToggle}
        >
          <PanelLeft className="h-4 w-4" />
        </button>

        <WorkspaceSwitcher
          currentWorkspace={currentWorkspace}
          label={t("English", "workspaces")}
          workspaces={workspaces}
          open={openMenu === "workspace"}
          onToggle={() => toggleMenu("workspace")}
          onClose={closeMenus}
          onSelect={handleWorkspaceSelect}
        />

        <SearchBar
          value={searchQuery}
          onChange={onSearchChange}
          placeholder={t("English", "searchPlaceholder")}
        />

        <QuickActions
          label={t("English", "quickActions")}
          open={openMenu === "actions"}
          onToggle={() => toggleMenu("actions")}
          onClose={closeMenus}
          onAction={handleQuickAction}
        />

        <Notifications
          label={t("English", "notifications")}
          open={openMenu === "notifications"}
          notifications={localizedNotifications}
          unreadCount={unreadCount}
          onToggle={() => toggleMenu("notifications")}
          onClose={closeMenus}
          onMarkRead={handleMarkRead}
          onMarkAllRead={handleMarkAllRead}
        />

        <UserMenu
          user={user}
          open={openMenu === "user"}
          onToggle={() => toggleMenu("user")}
          onClose={closeMenus}
          onAction={handleUserAction}
        />
      </div>
    </header>
  );
}
