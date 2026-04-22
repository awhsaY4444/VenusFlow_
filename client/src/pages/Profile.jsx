import {
  BadgeCheck,
  Camera,
  Clock3,
  KeyRound,
  Save,
  UserRound,
} from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../api";
import { Avatar } from "../components/ui/Avatar";
import { SectionHeader } from "../components/ui/SectionHeader";
import { StatusBadge } from "../components/ui/StatusBadge";
import { Skeleton } from "../components/ui/Skeleton";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { formatDateTime } from "../utils/formatters";
import { tr } from "../utils/i18n";

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function ProfilePage() {
  const { refreshUser } = useAuth();
  const { pushToast } = useToast();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    avatarUrl: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  async function loadProfile() {
    setLoading(true);
    try {
      const response = await api.getCurrentUser();
      setProfile(response.user);
      setForm({
        name: response.user.name,
        email: response.user.email,
        avatarUrl: response.user.avatarUrl || "",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  async function handleAvatarChange(event) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      pushToast(tr("Please choose a valid image file.", "कृपया सही इमेज फाइल चुनें।"), "error");
      return;
    }

    const preview = await readFileAsDataUrl(file);
    setForm((current) => ({ ...current, avatarUrl: preview }));
  }

  async function handleProfileSubmit(event) {
    event.preventDefault();

    if (!form.name.trim()) {
      pushToast(tr("Full name is required.", "पूरा नाम जरूरी है।"), "error");
      return;
    }

    setSaving(true);
    try {
      const response = await api.updateProfile({
        name: form.name,
        avatarUrl: form.avatarUrl,
        timezone: profile.timezone,
        theme: profile.theme,
        notifications: profile.notifications,
      });
      setProfile(response.user);
      await refreshUser();
      pushToast(tr("Profile updated successfully.", "प्रोफाइल सफलतापूर्वक अपडेट हुई।"), "success");
    } catch (error) {
      pushToast(error.message, "error");
    } finally {
      setSaving(false);
    }
  }

  async function handlePasswordSubmit(event) {
    event.preventDefault();

    if (passwordForm.newPassword.length < 8) {
      pushToast(tr("New password must be at least 8 characters.", "नया पासवर्ड कम से कम 8 अक्षरों का होना चाहिए।"), "error");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      pushToast(tr("Passwords do not match.", "पासवर्ड मेल नहीं खाते।"), "error");
      return;
    }

    setChangingPassword(true);
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
      pushToast(tr("Password changed successfully.", "पासवर्ड सफलतापूर्वक बदल गया।"), "success");
    } catch (error) {
      pushToast(error.message, "error");
    } finally {
      setChangingPassword(false);
    }
  }

  if (loading || !profile) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        kicker={tr("Profile", "प्रोफाइल")}
        title={tr("Your account profile", "आपकी अकाउंट प्रोफाइल")}
        description={tr(
          "Manage personal identity, account details, and password security.",
          "अपनी पहचान, अकाउंट विवरण और पासवर्ड सुरक्षा मैनेज करें।",
        )}
      />

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <form className="glass-panel p-6" onSubmit={handleProfileSubmit}>
          <SectionHeader
            kicker={tr("User info", "यूजर जानकारी")}
            title={tr("Profile information", "प्रोफाइल जानकारी")}
            description={tr("Update your visible identity across the workspace.", "वर्कस्पेस में दिखने वाली अपनी पहचान अपडेट करें।")}
          />

          <div className="mt-6 flex flex-col gap-6 md:flex-row">
            <div className="flex flex-col items-center gap-4">
              {form.avatarUrl ? (
                <img
                  src={form.avatarUrl}
                  alt={form.name}
                  className="h-24 w-24 rounded-full object-cover shadow-sm"
                />
              ) : (
                <Avatar name={form.name} />
              )}
              <label className="btn-secondary cursor-pointer">
                <Camera className="h-4 w-4" />
                {tr("Upload avatar", "अवतार अपलोड करें")}
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </label>
            </div>

            <div className="grid flex-1 gap-5">
              <div>
                <label className="field-label">{tr("Full name", "पूरा नाम")}</label>
                <input
                  className="field-input"
                  value={form.name}
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                />
              </div>
              <div>
                <label className="field-label">{tr("Email", "ईमेल")}</label>
                <input className="field-input bg-surface-muted" value={form.email} readOnly />
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge value={profile.role} />
                <div className="rounded-xl bg-surface-muted px-3 py-2 text-sm text-ink-600">
                  {tr("Auth via", "ऑथ द्वारा")} {profile.authProvider}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button className="btn-primary" type="submit" disabled={saving}>
              <Save className="h-4 w-4" />
              {saving ? tr("Saving...", "सेव हो रहा है...") : tr("Update profile", "प्रोफाइल अपडेट करें")}
            </button>
          </div>
        </form>

        <div className="space-y-6">
          <section className="surface-panel p-6">
            <SectionHeader
              kicker={tr("Account", "अकाउंट")}
              title={tr("Account details", "अकाउंट विवरण")}
              description={tr("Reference information for your user identity.", "आपकी यूजर पहचान की संदर्भ जानकारी।")}
            />
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl bg-surface-muted p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-500">{tr("Organization", "संगठन")}</p>
                <p className="mt-2 text-sm font-medium text-ink-950">{profile.organizationName}</p>
              </div>
              <div className="rounded-2xl bg-surface-muted p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-500">{tr("Joined", "जुड़े")}</p>
                <p className="mt-2 text-sm text-ink-700">{formatDateTime(profile.createdAt)}</p>
              </div>
              <div className="rounded-2xl bg-surface-muted p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-500">{tr("User ID", "यूजर ID")}</p>
                <p className="mt-2 break-all text-xs text-ink-600">{profile.id}</p>
              </div>
            </div>
          </section>

          <section className="surface-panel p-6">
            <SectionHeader
              kicker={tr("Security", "सुरक्षा")}
              title={tr("Change password", "पासवर्ड बदलें")}
              description={tr("Keep your account secure with a fresh password.", "नए पासवर्ड से अपना अकाउंट सुरक्षित रखें।")}
            />

            <form className="mt-6 space-y-4" onSubmit={handlePasswordSubmit}>
              <div>
                <label className="field-label">{tr("Current password", "वर्तमान पासवर्ड")}</label>
                <input
                  className="field-input"
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(event) =>
                    setPasswordForm((current) => ({
                      ...current,
                      currentPassword: event.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <label className="field-label">{tr("New password", "नया पासवर्ड")}</label>
                <input
                  className="field-input"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(event) =>
                    setPasswordForm((current) => ({
                      ...current,
                      newPassword: event.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <label className="field-label">{tr("Confirm password", "पासवर्ड पुष्टि")}</label>
                <input
                  className="field-input"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(event) =>
                    setPasswordForm((current) => ({
                      ...current,
                      confirmPassword: event.target.value,
                    }))
                  }
                />
              </div>
              <button className="btn-primary" type="submit" disabled={changingPassword}>
                <KeyRound className="h-4 w-4" />
                {changingPassword ? tr("Updating...", "अपडेट हो रहा है...") : tr("Change password", "पासवर्ड बदलें")}
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
