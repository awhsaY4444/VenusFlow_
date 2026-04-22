import { formatDateTime } from "../utils/formatters";

export function ActivityFeed({ activity }) {
  return (
    <section className="panel">
      <div className="section-heading">
        <h3>Workspace Activity</h3>
        <p>Recent audit events across the organization.</p>
      </div>

      <div className="feed-list">
        {activity?.length ? (
          activity.map((item) => (
            <article key={item.id} className="feed-card">
              <strong>{item.actorName}</strong>
              <p>
                {item.action} <span>{item.taskTitle}</span>
              </p>
              <small>{formatDateTime(item.createdAt)}</small>
            </article>
          ))
        ) : (
          <div className="empty-state">
            <strong>No recent activity yet.</strong>
            <span>Audit events will appear here as tasks change.</span>
          </div>
        )}
      </div>
    </section>
  );
}
