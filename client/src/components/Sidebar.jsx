const navItems = [
  { id: "overview", label: "Overview" },
  { id: "tasks", label: "Tasks" },
  { id: "team", label: "Team" },
  { id: "activity", label: "Activity" },
];

export function Sidebar({
  user,
  filters,
  currentView,
  onFilterChange,
  onViewChange,
  onLogout,
}) {
  return (
    <aside className="sidebar">
      <div className="brand-block">
        <div className="brand-mark">OP</div>
        <div>
          <p className="eyebrow">Workspace</p>
          <h2>{user.organizationName}</h2>
          <span className="muted">{user.organizationSlug}</span>
        </div>
      </div>

      <section className="panel panel--subtle">
        <p className="eyebrow">Current User</p>
        <strong>{user.name}</strong>
        <span className="muted">{user.email}</span>
        <span className="badge">{user.role}</span>
      </section>

      <section className="panel panel--subtle">
        <div className="section-heading">
          <h3>Navigation</h3>
          <p>Move through the workspace one focused area at a time.</p>
        </div>

        <div className="nav-list">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`nav-button ${currentView === item.id ? "is-active" : ""}`}
              onClick={() => onViewChange(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </section>

      <section className="panel panel--subtle">
        <div className="section-heading">
          <h3>Filters</h3>
          <p>Focus the workspace by state, priority, or keyword.</p>
        </div>

        <label>
          Status
          <select
            value={filters.status}
            onChange={(event) => onFilterChange("status", event.target.value)}
          >
            <option value="">All statuses</option>
            <option value="todo">Todo</option>
            <option value="in_progress">In progress</option>
            <option value="done">Done</option>
          </select>
        </label>

        <label>
          Priority
          <select
            value={filters.priority}
            onChange={(event) => onFilterChange("priority", event.target.value)}
          >
            <option value="">All priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </label>

        <label>
          Search
          <input
            value={filters.search}
            onChange={(event) => onFilterChange("search", event.target.value)}
            placeholder="Search title or description"
          />
        </label>

        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={filters.includeDeleted === "true"}
            onChange={(event) =>
              onFilterChange("includeDeleted", event.target.checked ? "true" : "false")
            }
          />
          Show archived tasks
        </label>
      </section>

      <button className="button button--ghost" onClick={onLogout}>
        Logout
      </button>
    </aside>
  );
}
