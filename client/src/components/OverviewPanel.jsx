export function OverviewPanel({ dashboard, taskCount }) {
  const stats = dashboard?.stats || {
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    overdueTasks: 0,
  };

  return (
    <section className="overview">
      <div className="overview__copy">
        <p className="eyebrow">Ops Dashboard</p>
        <h1>Secure task operations for a modern multi-tenant workspace.</h1>
        <p>
          Admins can govern the organization. Members stay scoped to their own task
          responsibilities. Every change stays visible through audit history.
        </p>
      </div>

      <div className="overview__stats">
        <article className="stat-card">
          <span>Total tasks</span>
          <strong>{stats.totalTasks}</strong>
        </article>
        <article className="stat-card">
          <span>Completed</span>
          <strong>{stats.completedTasks}</strong>
        </article>
        <article className="stat-card">
          <span>In progress</span>
          <strong>{stats.inProgressTasks}</strong>
        </article>
        <article className="stat-card">
          <span>Visible now</span>
          <strong>{taskCount}</strong>
        </article>
      </div>
    </section>
  );
}
