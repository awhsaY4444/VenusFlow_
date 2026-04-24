import {
  BellRing,
  Building2,
  LockKeyhole,
  MonitorSmartphone,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../api";
import { Avatar } from "../components/ui/Avatar";
import { EmptyState } from "../components/ui/EmptyState";
import { SectionHeader } from "../components/ui/SectionHeader";
import { StatusBadge } from "../components/ui/StatusBadge";
import { Skeleton } from "../components/ui/Skeleton";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { applyAppearance } from "../utils/appearance";
import { t, tr } from "../utils/i18n";

const settingsTabs = [
  { id: "general", label: "General", icon: MonitorSmartphone },
  { id: "security", label: "Security", icon: LockKeyhole },
  { id: "notifications", label: "Notifications", icon: BellRing },
  { id: "workspace", label: "Workspace", icon: Building2 },
];

export function SettingsPage() {
  const { user, setUser, refreshUser } = useAuth();
  const { pushToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [profile, setProfile] = useState(null);
  const [users, setUsers] = useState([]);
  const [memberForm, setMemberForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "member",
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [form, setForm] = useState({
    timezone: "Asia/Calcutta",
    theme: "light",
    workspaceName: "",
    notifications: {
      email: true,
      taskUpdates: true,
      mentions: true,
    },
    twoFactorEnabled: false,
  });

  const visibleTabs = useMemo(
    () =>
      user?.role === "admin"
        ? settingsTabs
        : settingsTabs.filter((tab) => tab.id !== "workspace"),
    [user]
  );

  function applyLocalPreference(nextValues) {
    const nextTheme = nextValues.theme ?? form.theme;

    setForm((current) => ({ ...current, ...nextValues }));
    applyAppearance({ theme: nextTheme });
    setUser((currentUser) =>
      currentUser
        ? {
            ...currentUser,
            theme: nextTheme,
          }
        : currentUser
    );
  }

  async function loadSettingsData() {
    setLoading(true);
    try {
      const [profileRes, usersRes] = await Promise.all([
        api.getCurrentUser(),
        api.getUsers(),
      ]);

      setProfile(profileRes.user);
      setUsers(usersRes.users);
      setForm({
        timezone: profileRes.user.timezone,
        theme: profileRes.user.theme,
        workspaceName: profileRes.user.organizationName,
        notifications: profileRes.user.notifications,
        twoFactorEnabled: false,
      });
      applyAppearance({
        theme: profileRes.user.theme,
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSettingsData();
  }, []);

  useEffect(() => {
    const requestedTab = searchParams.get("tab");
    if (requestedTab && visibleTabs.some((tab) => tab.id === requestedTab)) {
      setActiveTab(requestedTab);
    }
  }, [searchParams, visibleTabs]);

  async function persistSettings(overrides = {}) {
    if (!profile) {
      return;
    }

    setSaving(true);
    try {
      const response = await api.updateProfile({
        name: profile.name,
        avatarUrl: profile.avatarUrl,
        timezone: overrides.timezone ?? form.timezone,
        theme: overrides.theme ?? form.theme,
        workspaceName:
          user.role === "admin"
            ? overrides.workspaceName ?? form.workspaceName
            : undefined,
        notifications: overrides.notifications ?? form.notifications,
      });
      setProfile(response.user);
      setUser(response.user);
      setForm((current) => ({
        ...current,
        timezone: response.user.timezone,
        theme: response.user.theme,
        workspaceName: response.user.organizationName,
        notifications: response.user.notifications,
      }));
      applyAppearance({
        theme: response.user.theme,
      });
      await refreshUser();
      pushToast(tr("Settings saved successfully."), "success");
    } catch (error) {
      pushToast(error.message, "error");
    } finally {
      setSaving(false);
    }
  }

  async function handlePasswordSubmit(event) {
    event.preventDefault();

    if (passwordForm.newPassword.length < 8) {
      pushToast(tr("New password must be at least 8 characters."), "error");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      pushToast(tr("Passwords do not match."), "error");
      return;
    }

    setPasswordSaving(true);
    try {
      await api.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      pushToast(tr("Password updated."), "success");
    } catch (error) {
      pushToast(error.message, "error");
    } finally {
      setPasswordSaving(false);
    }
  }

  async function handleInviteMember(event) {
    event.preventDefault();

    try {
      await api.createUser(memberForm);
      setMemberForm({
        name: "",
        email: "",
        password: "",
        role: "member",
      });
      await loadSettingsData();
      pushToast(tr("Member invited successfully."), "success");
    } catch (error) {
      pushToast(error.message, "error");
    }
  }

  async function handleRoleChange(userId, role) {
    try {
      await api.updateUserRole(userId, role);
      await loadSettingsData();
      pushToast(tr("Role updated successfully."), "success");
    } catch (error) {
      pushToast(error.message, "error");
    }
  }

  async function handleRemoveMember(userId) {
    if (!window.confirm(tr("Are you sure you want to remove this member? This action is permanent."))) {
      return;
    }

    try {
      await api.deleteUser(userId);
      pushToast(tr("Member removed successfully."), "success");
      await loadSettingsData();
    } catch (error) {
      pushToast(error.message, "error");
    }
  }

  if (loading || !profile) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-8 overflow-hidden">

      <SectionHeader
        kicker={t("English", "settings")}
        title={t("English", "settingsTitle")}
        description={t("English", "settingsDescription")}
      />

      <div className="grid flex-1 gap-6 xl:grid-cols-[240px_1fr] overflow-hidden">

        <aside className="glass-panel p-4 h-fit sticky top-0">

          <div className="space-y-2">
            {visibleTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  className={`nav-item w-full ${activeTab === tab.id ? "nav-item-active" : ""}`}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSearchParams({ tab: tab.id });
                  }}
                >
                  <Icon className="h-4 w-4" />
                  {t("English", tab.id)}
                </button>
              );
            })}
          </div>
        </aside>

        <div className="flex flex-col gap-6 overflow-y-auto pr-2 -mr-2">

          {activeTab === "general" ? (
            <section className="glass-panel p-6">
              <SectionHeader
                kicker={t("English", "general")}
                title={t("English", "preferences")}
                description={t("English", "generalDescription")}
              />
              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <div>
                  <label className="field-label">{t("English", "theme")}</label>
                  <select
                    className="field-input"
                    value={form.theme}
                    onChange={(event) => {
                      const nextTheme = event.target.value;
                      applyLocalPreference({ theme: nextTheme });
                    }}
                  >
                    <option value="light">{t("English", "light")}</option>
                    <option value="dark">{t("English", "dark")}</option>
                  </select>
                </div>
                <div>
                  <label className="field-label">{t("English", "timezone")}</label>
                  <input
                    className="field-input"
                    value={form.timezone}
                    onChange={(event) => setForm((current) => ({ ...current, timezone: event.target.value }))}
                  />
                </div>
              </div>
              <div className="mt-6">
                <button className="btn-primary" type="button" onClick={() => persistSettings()} disabled={saving}>
                  {saving ? t("English", "saving") : t("English", "saveGeneralSettings")}
                </button>
              </div>
            </section>
          ) : null}

          {activeTab === "security" ? (
            <section className="glass-panel p-6">
              <SectionHeader
                kicker={t("English", "security")}
                title={t("English", "accountProtection")}
                description={t("English", "accountProtectionDescription")}
              />
              <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                <form className="space-y-4" onSubmit={handlePasswordSubmit}>
                  <div>
                    <label className="field-label">{t("English", "currentPassword")}</label>
                    <input
                      className="field-input"
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(event) =>
                        setPasswordForm((current) => ({ ...current, currentPassword: event.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <label className="field-label">{t("English", "newPassword")}</label>
                    <input
                      className="field-input"
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(event) =>
                        setPasswordForm((current) => ({ ...current, newPassword: event.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <label className="field-label">{t("English", "confirmPassword")}</label>
                    <input
                      className="field-input"
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(event) =>
                        setPasswordForm((current) => ({ ...current, confirmPassword: event.target.value }))
                      }
                    />
                  </div>
                  <button className="btn-primary" type="submit" disabled={passwordSaving}>
                    {passwordSaving ? t("English", "updating") : t("English", "changePassword")}
                  </button>
                </form>

                <div className="space-y-4">
                  <article className="surface-panel p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-ink-950">{t("English", "twoFactor")}</p>
                        <p className="mt-1 text-sm text-ink-600">{t("English", "twoFactorDescription")}</p>
                      </div>
                      <button
                        type="button"
                        className={`relative inline-flex h-7 w-12 items-center rounded-full transition ${
                          form.twoFactorEnabled ? "bg-brand-600" : "bg-slate-300"
                        }`}
                        onClick={() =>
                          setForm((current) => ({
                            ...current,
                            twoFactorEnabled: !current.twoFactorEnabled,
                          }))
                        }
                      >
                        <span
                          className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
                            form.twoFactorEnabled ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  </article>

                  <article className="surface-panel p-5">
                    <p className="text-sm font-semibold text-ink-950">{t("English", "activeSession")}</p>
                    <div className="mt-3 flex items-center gap-3">
                      <ShieldCheck className="h-5 w-5 text-emerald-600" />
                      <div>
                        <p className="text-sm text-ink-700">{t("English", "currentBrowserSession")}</p>
                        <p className="text-xs text-ink-500">{t("English", "jwtSession")}</p>
                      </div>
                    </div>
                  </article>
                </div>
              </div>
            </section>
          ) : null}

          {activeTab === "notifications" ? (
            <section className="glass-panel p-6">
              <SectionHeader
                kicker={t("English", "notifications")}
                title={t("English", "deliveryPreferences")}
                description={t("English", "deliveryPreferencesDescription")}
              />
              <div className="mt-6 space-y-4">
                {[
                  { key: "email", label: t("English", "emailNotifications") },
                  { key: "taskUpdates", label: t("English", "taskUpdates") },
                  { key: "mentions", label: t("English", "mentions") },
                ].map((item) => (
                  <div key={item.key} className="surface-panel flex items-center justify-between gap-3 p-4">
                    <div>
                      <p className="text-sm font-semibold text-ink-950">{item.label}</p>
                      <p className="mt-1 text-sm text-ink-600">{t("English", "toggleChannel")}</p>
                    </div>
                    <button
                      type="button"
                      className={`relative inline-flex h-7 w-12 items-center rounded-full transition ${
                        form.notifications[item.key] ? "bg-brand-600" : "bg-slate-300"
                      }`}
                      onClick={() =>
                        setForm((current) => ({
                          ...current,
                          notifications: {
                            ...current.notifications,
                            [item.key]: !current.notifications[item.key],
                          },
                        }))
                      }
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
                          form.notifications[item.key] ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <button className="btn-primary" type="button" onClick={() => persistSettings()} disabled={saving}>
                  {saving ? t("English", "saving") : t("English", "saveNotificationSettings")}
                </button>
              </div>
            </section>
          ) : null}

          {activeTab === "workspace" && user.role === "admin" ? (
            <div className="space-y-6">
              <section className="glass-panel p-6">
                <SectionHeader
                  kicker={t("English", "workspace")}
                  title={t("English", "organizationSettings")}
                  description={t("English", "organizationSettingsDescription")}
                />
                <div className="mt-6">
                  <label className="field-label">{t("English", "workspaceName")}</label>
                  <input
                    className="field-input"
                    value={form.workspaceName}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, workspaceName: event.target.value }))
                    }
                  />
                </div>
                <div className="mt-6">
                  <button className="btn-primary" type="button" onClick={() => persistSettings()} disabled={saving}>
                    {saving ? t("English", "saving") : t("English", "updateWorkspace")}
                  </button>
                </div>
              </section>

              <section className="glass-panel p-6">
                <SectionHeader
                  kicker={t("English", "inviteMember")}
                  title={t("English", "inviteMembers")}
                  description={t("English", "inviteMembersDescription")}
                />
                <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleInviteMember}>
                  <input
                    className="field-input"
                    placeholder={t("English", "name")}
                    value={memberForm.name}
                    onChange={(event) => setMemberForm((current) => ({ ...current, name: event.target.value }))}
                    required
                  />
                  <select
                    className="field-input"
                    value={memberForm.role}
                    onChange={(event) => setMemberForm((current) => ({ ...current, role: event.target.value }))}
                  >
                    <option value="member">{t("English", "member")}</option>
                    <option value="admin">{t("English", "admin")}</option>
                  </select>
                  <input
                    className="field-input"
                    type="email"
                    placeholder={t("English", "email")}
                    value={memberForm.email}
                    onChange={(event) => setMemberForm((current) => ({ ...current, email: event.target.value }))}
                    required
                  />
                  <input
                    className="field-input"
                    type="password"
                    placeholder={t("English", "temporaryPassword")}
                    value={memberForm.password}
                    onChange={(event) => setMemberForm((current) => ({ ...current, password: event.target.value }))}
                    required
                  />
                  <div className="md:col-span-2">
                    <button className="btn-primary" type="submit">{t("English", "inviteMember")}</button>
                  </div>
                </form>
              </section>

              <section className="glass-panel p-6">
                <SectionHeader
                  kicker={t("English", "access")}
                  title={t("English", "roleManagement")}
                  description={t("English", "roleManagementDescription")}
                />
                  <div className="mt-6 max-h-[400px] overflow-y-auto space-y-4 pr-2">
                    {users.length ? (
                      users.map((member) => (
                        <article key={member.id} className="surface-panel flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar name={member.name} size="sm" />
                            <div>
                              <p className="text-sm font-semibold text-ink-950">{member.name}</p>
                              <p className="text-sm text-ink-500">{member.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <StatusBadge value={member.role} />
                            <select
                              className="field-input min-w-[140px]"
                              value={member.role}
                              onChange={(event) => handleRoleChange(member.id, event.target.value)}
                            >
                              <option value="member">{t("English", "member")}</option>
                              <option value="admin">{t("English", "admin")}</option>
                            </select>
                            {member.id !== user.id && (
                              <button
                                className="p-2 text-ink-400 hover:text-red-600 transition-colors"
                                onClick={() => handleRemoveMember(member.id)}
                                title={t("English", "removeMember")}
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </article>
                      ))
                    ) : (
                      <EmptyState
                        title={t("English", "noUsersFound")}
                        description={t("English", "noUsersFoundDescription")}
                      />
                    )}
                  </div>

              </section>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
