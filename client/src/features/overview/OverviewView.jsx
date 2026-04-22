import { CheckCircle2, Clock3, ListChecks, Trash2, TriangleAlert } from "lucide-react";
import { MetricCard } from "../../components/ui/MetricCard";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { EmptyState } from "../../components/ui/EmptyState";
import { Avatar } from "../../components/ui/Avatar";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { formatDateTime } from "../../utils/formatters";
import { tr } from "../../utils/i18n";

export function OverviewView({ dashboard, tasks, users, onNavigate, onDeleteTask }) {
  const stats = dashboard?.stats || {};
  const activity = dashboard?.activity || [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* ... previous sections ... */}
      {/* Header Section */}
      <section className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-4">
          <p className="section-kicker">{tr("Overview", "ओवरव्यू")}</p>
          <h1 className="font-[var(--font-display)] text-5xl font-bold tracking-tight text-ink-950">
            {tr(
              "Intelligence at a glance.",
              "एक नज़र में वर्कस्पेस की स्थिति।"
            )}
          </h1>
          <p className="max-w-xl text-lg text-ink-600">
            {tr(
              "Your high-density operational summary for task health and team momentum.",
              "टास्क और टीम की प्रगति का आपका मुख्य ऑपरेशनल सारांश।"
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-primary" type="button" onClick={() => onNavigate("tasks")}>
            {tr("Go to tasks", "टास्क पर जाएं")}
          </button>
          <button className="btn-secondary" type="button" onClick={() => onNavigate("activity")}>
            {tr("Full activity", "पूरी एक्टिविटी")}
          </button>
        </div>
      </section>

      {/* Metric Anchor Row */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={ListChecks} label={tr("Total tasks", "कुल टास्क")} value={stats.totalTasks || 0} />
        <MetricCard icon={CheckCircle2} label={tr("Completed", "पूरे हुए")} value={stats.completedTasks || 0} tone="success" />
        <MetricCard icon={Clock3} label={tr("In progress", "प्रगति में")} value={stats.inProgressTasks || 0} tone="warning" />
        <MetricCard icon={TriangleAlert} label={tr("Overdue", "देरी से")} value={stats.overdueTasks || 0} tone="danger" />
      </section>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] 2xl:grid-cols-[1.25fr_0.75fr]">
        <section className="glass-panel overflow-hidden">
          <div className="border-b border-line/50 p-6">
            <SectionHeader
              title={tr("Recent activity", "हाल की एक्टिविटी")}
              description={tr("Real-time pulse of your workspace updates.", "वर्कस्पेस अपडेट की रीयल-टाइम जानकारी।")}
              actions={
                <button className="btn-ghost text-xs" type="button" onClick={() => onNavigate("activity")}>
                  {tr("View full timeline", "पूरी टाइमलाइन देखें")}
                </button>
              }
            />
          </div>
          
          <div className="p-8">
            {activity.length ? (
              <div className="space-y-8">
                {activity.slice(0, 8).map((item, index) => (
                  <div key={item.id} className="relative flex gap-6">
                    <div className="relative flex w-8 justify-center">
                      <div className="mt-1.5 h-3 w-3 rounded-full bg-brand-500 ring-4 ring-brand-50" />
                      {index !== activity.slice(0, 8).length - 1 ? (
                        <div className="absolute top-5 h-full w-px bg-line" />
                      ) : null}
                    </div>
                    <div className="pb-2">
                       <p className="text-base font-medium text-ink-900">
                          <span className="font-bold text-ink-950">{item.actorName}</span>
                          <span className="mx-2 text-ink-400">•</span>
                          {item.action}
                          <span className="ml-1.5 font-bold text-brand-600">"{item.taskTitle}"</span>
                       </p>
                       <p className="mt-1 text-sm font-medium text-ink-400">{formatDateTime(item.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                title={tr("No activity yet", "अभी कोई एक्टिविटी नहीं")}
                description={tr("Activity updates will appear here automatically.", "एक्टिविटी अपडेट यहां अपने आप दिखेंगे।")}
              />
            )}
          </div>
        </section>

        <div className="space-y-8">
          <section className="glass-panel p-6">
            <SectionHeader
              kicker={tr("Collective", "टीम")}
              title={tr(`${users.length} active members`, `${users.length} सक्रिय सदस्य`)}
              description={tr("Core workspace contributors.", "मुख्य वर्कस्पेस योगदानकर्ता।")}
            />
            <div className="mt-6 grid gap-3">
              {users.slice(0, 6).map((member) => (
                <div key={member.id} className="flex items-center justify-between rounded-2xl bg-surface-muted/50 p-3 ring-1 ring-line/40">
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar name={member.name} size="sm" />
                    <div className="min-w-0">
                      <p className="truncate text-base font-bold text-ink-950">{member.name}</p>
                      <p className="truncate text-xs uppercase tracking-widest text-ink-500">{member.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="glass-panel p-6">
            <SectionHeader
              title={tr("Current work", "मौजूदा काम")}
              description={tr("Recently modified tasks.", "हाल ही में बदले गए टास्क।")}
              actions={
                 <button className="btn-ghost text-xs" type="button" onClick={() => onNavigate("tasks")}>
                    {tr("All tasks", "सभी टास्क")}
                 </button>
              }
            />
            <div className="mt-6 space-y-3">
              {tasks.length ? (
                tasks.slice(0, 4).map((task) => (
                  <div key={task.id} className="group relative rounded-2xl border border-line/60 bg-surface p-4 transition hover:border-brand-200 hover:shadow-sm">
                    <div className="absolute right-3 top-3 opacity-0 transition-opacity group-hover:opacity-100">
                       <button
                         type="button"
                         className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-50 text-rose-600 shadow-sm transition hover:bg-rose-100"
                         onClick={(e) => {
                            e.stopPropagation();
                            onDeleteTask(task.id);
                         }}
                         title={tr("Quick Delete", "त्वरित हटाना")}
                       >
                          <Trash2 className="h-3.5 w-3.5" />
                       </button>
                    </div>
                    <div className="flex items-center justify-between gap-3 pr-8">
                       <p className="truncate text-base font-bold text-ink-900 group-hover:text-brand-600 transition">{task.title}</p>
                       <StatusBadge value={task.priority} />
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-2 border-t border-line/40 pt-3">
                       <StatusBadge value={task.status} />
                       <p className="text-xs font-medium text-ink-400">{tr("Recent", "हाल के")}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-ink-500 italic py-4">{tr("No recent tasks.", "कोई हालिया टास्क नहीं।")}</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
