import { Activity, MessageSquareText, ScrollText } from "lucide-react";
import { EmptyState } from "../../components/ui/EmptyState";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { formatDateTime } from "../../utils/formatters";
import { tr } from "../../utils/i18n";

export function ActivityView({ activity, selectedTask, audit, comments }) {
  return (
    <div className="space-y-8">
      <SectionHeader
        kicker={tr("Activity", "एक्टिविटी")}
        title={tr("Follow the operational trail.", "ऑपरेशनल ट्रेल फॉलो करें।")}
        description={tr(
          "Timeline-first view for workspace events, audit records, and comment volume.",
          "वर्कस्पेस इवेंट्स, ऑडिट रिकॉर्ड और कमेंट्स के लिए टाइमलाइन-फर्स्ट व्यू।",
        )}
      />

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <section className="glass-panel p-6">
          <SectionHeader
            kicker={tr("Workspace", "वर्कस्पेस")}
            title={tr("Live timeline", "लाइव टाइमलाइन")}
            description={tr("The latest actions across the whole organization.", "पूरे संगठन की नई गतिविधियां।")}
          />

          <div className="mt-6 space-y-6">
            {activity.length ? (
              activity.map((item, index) => (
                <div key={item.id} className="relative flex gap-4">
                  <div className="relative flex w-8 justify-center">
                    <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 text-brand-700">
                      <Activity className="h-4 w-4" />
                    </div>
                    {index !== activity.length - 1 ? (
                      <div className="absolute top-9 h-full w-px bg-line" />
                    ) : null}
                  </div>
                  <div className="pb-5">
                    <p className="text-sm text-ink-700">
                      <span className="font-semibold text-ink-950">{item.actorName}</span> {item.action}{" "}
                      <span className="font-medium text-ink-950">{item.taskTitle}</span>
                    </p>
                    <p className="mt-1 text-xs text-ink-500">{formatDateTime(item.createdAt)}</p>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState
                title={tr("No workspace activity", "कोई वर्कस्पेस एक्टिविटी नहीं")}
                description={tr("Task creation, updates, and comments will appear here.", "टास्क बनना, अपडेट और कमेंट्स यहां दिखेंगे।")}
              />
            )}
          </div>
        </section>

        <section className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="surface-panel p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-ink-600">{tr("Workspace events", "वर्कस्पेस इवेंट्स")}</p>
                  <p className="mt-3 text-3xl font-semibold tracking-tight text-ink-950">{activity.length}</p>
                </div>
                <div className="rounded-xl bg-slate-100 p-2.5 text-brand-600">
                  <Activity className="h-5 w-5" />
                </div>
              </div>
            </div>
            <div className="surface-panel p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-ink-600">{tr("Task audit logs", "टास्क ऑडिट लॉग")}</p>
                  <p className="mt-3 text-3xl font-semibold tracking-tight text-ink-950">{audit.length}</p>
                </div>
                <div className="rounded-xl bg-amber-50 p-2.5 text-amber-600">
                  <ScrollText className="h-5 w-5" />
                </div>
              </div>
            </div>
            <div className="surface-panel p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-ink-600">{tr("Task comments", "टास्क कमेंट्स")}</p>
                  <p className="mt-3 text-3xl font-semibold tracking-tight text-ink-950">{comments.length}</p>
                </div>
                <div className="rounded-xl bg-cyan-50 p-2.5 text-cyan-600">
                  <MessageSquareText className="h-5 w-5" />
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6">
            <SectionHeader
              kicker={tr("Focused item", "फोकस आइटम")}
              title={selectedTask ? selectedTask.title : tr("No task selected", "कोई टास्क चयनित नहीं")}
              description={
                selectedTask
                  ? tr(
                      "This panel reflects the task currently selected in the task workspace.",
                      "यह पैनल टास्क वर्कस्पेस में चुने गए टास्क को दिखाता है।",
                    )
                  : tr(
                      "Select a task from the tasks view to make this panel richer.",
                      "इस पैनल को बेहतर देखने के लिए टास्क व्यू से एक टास्क चुनें।",
                    )
              }
            />

            {selectedTask ? (
              <div className="mt-6 space-y-4">
                <article className="rounded-2xl bg-surface-muted p-4">
                  <p className="text-sm text-ink-700">{selectedTask.description || tr("No description yet.", "अभी कोई विवरण नहीं।")}</p>
                </article>
                <article className="rounded-2xl bg-surface-muted p-4">
                  <p className="text-sm font-semibold text-ink-950">{tr("Latest audit events", "नए ऑडिट इवेंट्स")}</p>
                  <div className="mt-3 space-y-3">
                    {audit.slice(0, 3).map((entry) => (
                      <div key={entry.id} className="text-sm text-ink-600">
                        <span className="font-medium text-ink-950">{entry.actorName}</span> {entry.action}
                      </div>
                    ))}
                  </div>
                </article>
              </div>
            ) : (
              <div className="mt-6">
                <EmptyState
                  title={tr("Nothing selected", "कुछ चयनित नहीं")}
                  description={tr(
                    "Use the task workspace to select a task, then return here for a deeper operational view.",
                    "टास्क वर्कस्पेस में टास्क चुनें, फिर गहरे ऑपरेशनल व्यू के लिए यहां लौटें।",
                  )}
                />
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
