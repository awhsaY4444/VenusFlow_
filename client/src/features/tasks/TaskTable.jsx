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
            <div className="hidden grid-cols-[minmax(0,2.1fr)_140px_120px_170px_120px_130px] items-center gap-4 border-b border-line bg-surface-muted px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-ink-500 md:grid">
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
                  className={`group grid items-center gap-4 px-5 py-4 transition-all duration-300 hover:bg-surface-muted hover:-translate-y-0.5 hover:shadow-sm md:grid-cols-[minmax(0,2.1fr)_140px_120px_170px_120px_130px] ${
                    selectedTask?.id === task.id ? "bg-brand-50/50" : ""
                  }`}
                >
                  <button
                    type="button"
                    className="min-w-0 text-left"
                    onClick={() => onSelect(task)}
                  >
                    <p className="truncate text-base font-medium text-ink-950">{task.title}</p>
                    <p className="mt-1 truncate text-base text-ink-500">
                      {task.description || tr("No description", "कोई विवरण नहीं")}
                    </p>
                  </button>
                  <div className="flex items-center">
                    <StatusBadge value={task.status} />
                  </div>
                  <div className="flex items-center">
                    <StatusBadge value={task.priority} />
                  </div>
                  <div className="flex items-center gap-3">
                    <Avatar name={task.assigneeName || tr("Unassigned", "असाइन नहीं")} size="sm" />
                    <span className="truncate text-base text-ink-700">
                      {task.assigneeName || tr("Unassigned", "असाइन नहीं")}
                    </span>
                  </div>
                  <div className="flex items-center text-base text-ink-600">
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
