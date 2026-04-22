import { Plus } from "lucide-react";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { TaskComposerPanel } from "./TaskComposerPanel";
import { TaskDetailPanel } from "./TaskDetailPanel";
import { TaskTable } from "./TaskTable";
import { tr } from "../../utils/i18n";

export function TasksView(props) {
  const {
    users,
    taskForm,
    editingTaskId,
    filters,
    tasks,
    selectedTask,
    userRole,
    onTaskChange,
    onCancelEdit,
    onTaskSubmit,
    onFilterChange,
    onSelectTask,
    onEditTask,
    onDeleteTask,
    onRestoreTask,
    audit,
    comments,
    commentBody,
    onCommentChange,
    onCommentSubmit,
  } = props;

  return (
    <div className="space-y-8">
      <SectionHeader
        kicker={tr("Tasks", "टास्क")}
        title={tr("Operate on tasks without clutter.", "टास्क पर साफ और व्यवस्थित तरीके से काम करें।")}
        description={tr(
          "The creation flow and the operational list are separated so each area has a clear job.",
          "बनाने का फॉर्म और काम की सूची अलग हैं, ताकि हर हिस्से का काम साफ रहे।",
        )}
        actions={
          <button className="btn-secondary" type="button" onClick={onCancelEdit}>
            <Plus className="h-4 w-4" />
            {tr("New task", "नया टास्क")}
          </button>
        }
      />

      <TaskComposerPanel
        users={users}
        taskForm={taskForm}
        editingTaskId={editingTaskId}
        onChange={onTaskChange}
        onCancel={onCancelEdit}
        onSubmit={onTaskSubmit}
      />

      <div className="grid gap-6 2xl:grid-cols-[minmax(0,1.1fr)_minmax(420px,0.9fr)]">
        <TaskTable
          tasks={tasks}
          selectedTask={selectedTask}
          userRole={userRole}
          filters={filters}
          onFilterChange={onFilterChange}
          onSelect={onSelectTask}
          onEdit={onEditTask}
          onDelete={onDeleteTask}
          onRestore={onRestoreTask}
        />

        <TaskDetailPanel
          selectedTask={selectedTask}
          audit={audit}
          comments={comments}
          commentBody={commentBody}
          onCommentChange={onCommentChange}
          onCommentSubmit={onCommentSubmit}
        />
      </div>
    </div>
  );
}
