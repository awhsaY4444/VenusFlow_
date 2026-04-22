import { formatDate } from "../utils/formatters";

export function TaskList({
  tasks,
  selectedTask,
  userRole,
  onSelect,
  onEdit,
  onDelete,
  onRestore,
}) {
  return (
    <section className="panel">
      <div className="panel-header">
        <div className="section-heading">
          <h3>Workspace Tasks</h3>
          <p>Review live work items across the organization.</p>
        </div>
        <span className="muted">{tasks.length} visible</span>
      </div>

      <div className="task-list">
        {tasks.map((task) => (
          <article
            key={task.id}
            className={`task-card ${selectedTask?.id === task.id ? "is-selected" : ""}`}
            onClick={() => onSelect(task)}
          >
            <div className="task-card__top">
              <div>
                <strong>{task.title}</strong>
                <p>{task.description || "No description added yet."}</p>
              </div>
              <span className={`badge badge--${task.priority}`}>{task.priority}</span>
            </div>

            <div className="task-meta">
              <span>{task.status}</span>
              <span>Creator: {task.creatorName}</span>
              <span>Assignee: {task.assigneeName || "Unassigned"}</span>
              <span>Due: {formatDate(task.dueDate)}</span>
            </div>

            <div className="task-actions">
              {!task.deletedAt ? (
                <>
                  <button
                    type="button"
                    className="button button--text"
                    onClick={(event) => {
                      event.stopPropagation();
                      onEdit(task);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="button button--text danger"
                    onClick={(event) => {
                      event.stopPropagation();
                      onDelete(task.id);
                    }}
                  >
                    Archive
                  </button>
                </>
              ) : userRole === "admin" ? (
                <button
                  type="button"
                  className="button button--text"
                  onClick={(event) => {
                    event.stopPropagation();
                    onRestore(task.id);
                  }}
                >
                  Restore
                </button>
              ) : (
                <span className="muted">Archived</span>
              )}
            </div>
          </article>
        ))}

        {!tasks.length ? (
          <div className="empty-state">
            <strong>No tasks match the current filters.</strong>
            <span>Try changing the filters or create a new task.</span>
          </div>
        ) : null}
      </div>
    </section>
  );
}
