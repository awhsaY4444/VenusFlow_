import { formatDate, formatDateTime } from "../utils/formatters";

export function TaskInspector({
  selectedTask,
  audit,
  comments,
  commentBody,
  onCommentChange,
  onCommentSubmit,
}) {
  return (
    <section className="panel panel--detail">
      <div className="section-heading">
        <h3>{selectedTask ? selectedTask.title : "Task Detail"}</h3>
        <p>
          {selectedTask
            ? "Inspect metadata, audit events, and discussion for the selected task."
            : "Select a task to view its full activity trail."}
        </p>
      </div>

      {selectedTask ? (
        <>
          <div className="detail-hero">
            <p>{selectedTask.description || "No description yet."}</p>
            <div className="task-meta">
              <span>Status: {selectedTask.status}</span>
              <span>Priority: {selectedTask.priority}</span>
              <span>Creator: {selectedTask.creatorName}</span>
              <span>Assignee: {selectedTask.assigneeName || "Unassigned"}</span>
              <span>Due: {formatDate(selectedTask.dueDate)}</span>
            </div>
          </div>

          <div className="detail-section">
            <h4>Audit Timeline</h4>
            <div className="feed-list">
              {audit.map((entry) => (
                <article key={entry.id} className="feed-card">
                  <strong>{entry.actorName}</strong>
                  <p>{entry.action}</p>
                  <small>{formatDateTime(entry.createdAt)}</small>
                </article>
              ))}
            </div>
          </div>

          <div className="detail-section">
            <h4>Comments</h4>
            <form className="comment-form" onSubmit={onCommentSubmit}>
              <textarea
                rows="4"
                value={commentBody}
                onChange={(event) => onCommentChange(event.target.value)}
                placeholder="Add context, blockers, or updates"
              />
              <button className="button button--primary" type="submit">
                Post comment
              </button>
            </form>

            <div className="feed-list">
              {comments.length ? (
                comments.map((comment) => (
                  <article key={comment.id} className="feed-card">
                    <strong>{comment.authorName}</strong>
                    <p>{comment.body}</p>
                    <small>{formatDateTime(comment.createdAt)}</small>
                  </article>
                ))
              ) : (
                <div className="empty-state">
                  <strong>No comments yet.</strong>
                  <span>Start the discussion for this task here.</span>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="empty-state empty-state--large">
          <strong>No task selected</strong>
          <span>Choose a task from the list to inspect its full timeline.</span>
        </div>
      )}
    </section>
  );
}
