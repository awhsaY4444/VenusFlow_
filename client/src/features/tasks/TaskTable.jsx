import { ArrowUpDown, RotateCcw, SquarePen, Trash2 } from "lucide-react";
import { Avatar } from "../../components/ui/Avatar";
import { EmptyState } from "../../components/ui/EmptyState";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { formatDate } from "../../utils/formatters";
import { tr } from "../../utils/i18n";

export function TaskTable({
  tasks,
  selectedTask,
  userRole,
  filters,
  onFilterChange,
  onSelect,
  onEdit,
  onDelete,
  onRestore,
}) {
  return (
    <section className="space-y-4">
      <SectionHeader
        kicker={tr("Task board", "टास्क बोर्ड")}
        title={tr("All tasks", "सभी टास्क")}
        description={tr(
          "A compact, Linear-style list tuned for scanning and action.",
          "तेजी से देखने और काम करने के लिए कॉम्पैक्ट सूची।",
        )}
      />

      <div className="flex flex-wrap gap-3">
        <select
          className="field-input max-w-[180px]"
          value={filters.status}
          onChange={(event) => onFilterChange("status", event.target.value)}
        >
          <option value="">{tr("All statuses", "सभी स्टेटस")}</option>
          <option value="todo">{tr("Todo", "करना है")}</option>
          <option value="in_progress">{tr("In progress", "प्रगति में")}</option>
          <option value="done">{tr("Done", "पूरा")}</option>
        </select>
        <select
          className="field-input max-w-[180px]"
          value={filters.priority}
          onChange={(event) => onFilterChange("priority", event.target.value)}
        >
          <option value="">{tr("All priorities", "सभी प्राथमिकताएं")}</option>
          <option value="high">{tr("High", "उच्च")}</option>
          <option value="medium">{tr("Medium", "मध्यम")}</option>
          <option value="low">{tr("Low", "कम")}</option>
        </select>
        <label className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-3 py-2.5 text-base text-ink-600">
          <input
            type="checkbox"
            checked={filters.includeDeleted === "true"}
            onChange={(event) =>
              onFilterChange("includeDeleted", event.target.checked ? "true" : "false")
            }
          />
          {tr("Show archived", "आर्काइव दिखाएं")}
        </label>
      </div>

      <div className="overflow-hidden rounded-2xl border border-line bg-white">
        {tasks.length ? (
          <>
            <div className="hidden task-grid items-center border-b border-line bg-surface-muted px-5 py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-ink-500 md:grid">
              <div className="flex items-center gap-2">
                {tr("Task", "टास्क")}
                <ArrowUpDown className="h-3.5 w-3.5" />
              </div>
              <div className="whitespace-nowrap">{tr("Status", "स्टेटस")}</div>
              <div className="whitespace-nowrap">{tr("Priority", "प्राथमिकता")}</div>
              <div className="whitespace-nowrap">{tr("Assignee", "असाइनी")}</div>
              <div className="whitespace-nowrap">{tr("Due Date", "देय तिथि")}</div>
              <div className="whitespace-nowrap">{tr("Actions", "एक्शन")}</div>
            </div>
            <div className="divide-y divide-line">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`group relative z-10 task-grid min-h-[64px] items-center px-5 py-2.5 transition-all duration-300 hover:z-20 hover:-translate-y-[1px] hover:bg-surface-muted hover:shadow-md ${
                    selectedTask?.id === task.id ? "bg-brand-50/50" : ""
                  }`}
                >
                  <button
                    type="button"
                    className="flex min-w-0 flex-col justify-center text-left"
                    onClick={() => onSelect(task)}
                  >
                    <p className="truncate text-sm font-semibold text-ink-950 leading-tight">{task.title}</p>
                    <p className="truncate text-xs font-medium text-ink-500 mt-0.5">
                      {task.description || tr("No description", "कोई विवरण नहीं")}
                    </p>
                  </button>
                  <div className="flex items-center">
                    <StatusBadge value={task.status} />
                  </div>
                  <div className="flex items-center">
                    <StatusBadge value={task.priority} />
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Avatar name={task.assigneeName || tr("Unassigned", "असाइन नहीं")} size="sm" />
                    <span className="truncate text-sm font-medium text-ink-700">
                      {task.assigneeName || tr("Unassigned", "असाइन नहीं")}
                    </span>
                  </div>
                  <div className="flex items-center text-sm font-medium tabular-nums text-ink-600 whitespace-nowrap">
                    {formatDate(task.dueDate)}
                  </div>
                  <div className="flex items-center gap-1">
                    {!task.deletedAt ? (
                      <>
                        <button type="button" className="btn-ghost" onClick={() => onEdit(task)}>
                          <SquarePen className="h-5 w-5" />
                        </button>
                        <button
                          type="button"
                          className="flex h-11 w-11 items-center justify-center rounded-xl text-rose-500 transition-all duration-200 hover:bg-rose-50 hover:text-rose-700 active:scale-95"
                          onClick={() => onDelete(task.id)}
                          title={tr("Delete Task", "टास्क हटाएं")}
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </>
                    ) : userRole === "admin" ? (
                      <button type="button" className="btn-ghost" onClick={() => onRestore(task.id)}>
                        <RotateCcw className="h-5 w-5" />
                      </button>
                    ) : (
                      <span className="text-sm text-ink-500">{tr("Archived", "आर्काइव")}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="p-6">
            <EmptyState
              title={tr("No matching tasks", "मेल खाते टास्क नहीं मिले")}
              description={tr(
                "Try adjusting your filters or create a new task to get started.",
                "फिल्टर बदलें या शुरू करने के लिए नया टास्क बनाएं।",
              )}
            />
          </div>
        )}
      </div>
    </section>
  );
}
