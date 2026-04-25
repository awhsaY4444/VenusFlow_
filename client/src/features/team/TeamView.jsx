import { Shield, Trash2, UserPlus, Users } from "lucide-react";
import { Avatar } from "../../components/ui/Avatar";
import { EmptyState } from "../../components/ui/EmptyState";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { tr } from "../../utils/i18n";

export function TeamView({
  user,
  users,
  memberForm,
  onMemberChange,
  onMemberSubmit,
  onRemoveMember,
}) {
  return (
    <div className="w-full flex flex-col gap-8">

      <SectionHeader
        kicker={tr("Team", "टीम")}
        title={tr("People, roles, and access in one place.", "लोग, रोल और एक्सेस एक जगह।")}
        description={tr(
          "A cleaner workspace directory with role clarity and admin controls.",
          "रोल स्पष्टता और एडमिन कंट्रोल के साथ साफ वर्कस्पेस डायरेक्टरी।",
        )}
      />

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">

        <section className="glass-panel p-6 h-fit">
          {user.role === "admin" ? (
            <>
              <SectionHeader
                kicker={tr("Invite", "आमंत्रण")}
                title={tr("Add a workspace member", "वर्कस्पेस सदस्य जोड़ें")}
                description={tr(
                  "Admins can create tenant-scoped users directly from the product.",
                  "एडमिन सीधे ऐप से टेनेंट-स्कोप्ड यूजर बना सकते हैं।",
                )}
              />

              <form className="mt-6 space-y-5" onSubmit={onMemberSubmit}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="min-w-0">
                    <label className="field-label">{tr("Name", "नाम")}</label>
                    <input
                      className="field-input w-full"
                      value={memberForm.name}
                      onChange={(event) => onMemberChange("name", event.target.value)}
                      required
                    />
                  </div>

                  <div className="min-w-0">
                    <label className="field-label">{tr("Role", "रोल")}</label>
                    <select
                      className="field-input w-full"
                      value={memberForm.role}
                      onChange={(event) => onMemberChange("role", event.target.value)}
                    >
                      <option value="member">{tr("Member", "मेंबर")}</option>
                      <option value="admin">{tr("Admin", "एडमिन")}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="field-label">{tr("Email", "ईमेल")}</label>
                  <input
                    className="field-input w-full"
                    type="email"
                    value={memberForm.email}
                    onChange={(event) => onMemberChange("email", event.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="field-label">{tr("Temporary password", "अस्थायी पासवर्ड")}</label>
                  <input
                    className="field-input w-full"
                    type="password"
                    value={memberForm.password}
                    onChange={(event) => onMemberChange("password", event.target.value)}
                    required
                  />
                </div>

                <button className="btn-primary" type="submit">
                  <UserPlus className="h-4 w-4" />
                  {tr("Add member", "सदस्य जोड़ें")}
                </button>
              </form>
            </>
          ) : (
            <EmptyState
              title={tr("Admin-only area", "केवल एडमिन क्षेत्र")}
              description={tr(
                "Only workspace admins can add or manage members here.",
                "यहां केवल वर्कस्पेस एडमिन सदस्य जोड़ या मैनेज कर सकते हैं।",
              )}
            />
          )}
        </section>

        <section className="flex flex-col gap-4 min-w-0">
          <SectionHeader
            kicker={tr("Directory", "डायरेक्टरी")}
            title={tr(`${users.length} people in this workspace`, `इस वर्कस्पेस में ${users.length} लोग`)}
            description={tr("Avatar-based people view with role context.", "रोल संदर्भ के साथ अवतार-आधारित लोगों का दृश्य।")}
          />

          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              {users.map((member) => (
                <article
                  key={member.id}
                  className="surface-panel flex items-center gap-3 p-4 transition hover:-translate-y-0.5 hover:shadow-sm min-w-0"
                >
                  <Avatar name={member.name} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-ink-950 truncate">{member.name}</p>
                    <p className="text-sm text-ink-500 truncate">{member.email}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <StatusBadge value={member.role} />
                    {user.role === "admin" && member.id !== user.id && (
                      <button
                        className="p-2 text-ink-400 hover:text-red-600 transition-colors"
                        onClick={() => onRemoveMember(member.id)}
                        title={tr("Remove member", "सदस्य निकालें")}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="surface-panel p-5 min-w-0">
                <Users className="h-5 w-5 text-brand-600" />
                <h3 className="mt-4 text-base font-semibold break-words">{tr("Tenant-scoped users", "टेनेंट-स्कोप्ड यूजर")}</h3>
                <p className="mt-2 text-sm text-ink-600 break-words">
                  {tr(
                    "Every team member belongs only to the current organization.",
                    "हर टीम सदस्य केवल मौजूदा संगठन से जुड़ा है।",
                  )}
                </p>
              </div>
              <div className="surface-panel p-5 min-w-0">
                <Shield className="h-5 w-5 text-emerald-600" />
                <h3 className="mt-4 text-base font-semibold break-words">{tr("Role-aware access", "रोल-आधारित एक्सेस")}</h3>
                <p className="mt-2 text-sm text-ink-600 break-words">
                  {tr(
                    "UI and backend permission boundaries stay aligned.",
                    "UI और बैकएंड परमिशन सीमाएं एक जैसी रहती हैं।",
                  )}
                </p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
