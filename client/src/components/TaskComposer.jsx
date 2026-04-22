export function TaskComposer({
  users,
  taskForm,
  editingTaskId,
  onChange,
  onCancelEdit,
  onSubmit,
}) {
  return (
    <form className="panel" onSubmit={onSubmit}>
      <div className="panel-header">
        <div className="section-heading">
          <h3>{editingTaskId ? "Edit Task" : "Create Task"}</h3>
          <p>Capture the work, assign ownership, and set the execution state.</p>
        </div>
        {editingTaskId ? (
          <button type="button" className="button button--text" onClick={onCancelEdit}>
            Cancel
          </button>
        ) : null}
      </div>

      <label>
        Title
        <input
          value={taskForm.title}
          onChange={(event) => onChange("title", event.target.value)}
          required
        />
      </label>

      <label>
        Description
        <textarea
          rows="5"
          value={taskForm.description}
          onChange={(event) => onChange("description", event.target.value)}
        />
      </label>

      <div className="field-grid">
        <label>
          Status
          <select
            value={taskForm.status}
            onChange={(event) => onChange("status", event.target.value)}
          >
            <option value="todo">Todo</option>
            <option value="in_progress">In progress</option>
            <option value="done">Done</option>
          </select>
        </label>

        <label>
          Priority
          <select
            value={taskForm.priority}
            onChange={(event) => onChange("priority", event.target.value)}
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </label>
      </div>

      <div className="field-grid">
        <label>
          Due date
          <input
            type="date"
            value={taskForm.dueDate}
            onChange={(event) => onChange("dueDate", event.target.value)}
          />
        </label>

        <label>
          Assignee
          <select
            value={taskForm.assigneeId}
            onChange={(event) => onChange("assigneeId", event.target.value)}
          >
            <option value="">Assign to creator</option>
            {users.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name} ({member.role})
              </option>
            ))}
          </select>
        </label>
      </div>

      <button className="button button--primary" type="submit">
        {editingTaskId ? "Save changes" : "Create task"}
      </button>
    </form>
  );
}
