const viewContent = {
  overview: {
    eyebrow: "Overview",
    title: "A cleaner command center for the whole workspace.",
    description:
      "Review health, momentum, and recent changes without having every workflow open at once.",
    action: "Open tasks",
    target: "tasks",
  },
  tasks: {
    eyebrow: "Tasks",
    title: "Create, assign, and inspect work with better focus.",
    description:
      "Use this section for actual task operations, editing, and drilling into history.",
    action: "Review activity",
    target: "activity",
  },
  team: {
    eyebrow: "Team",
    title: "Manage people and roles inside the organization.",
    description:
      "Admins can onboard members here while everyone can review who belongs to the workspace.",
    action: "Back to overview",
    target: "overview",
  },
  activity: {
    eyebrow: "Activity",
    title: "Audit history and discussion in one focused view.",
    description:
      "Track changes, comments, and operational context without distractions from other panels.",
    action: "Open tasks",
    target: "tasks",
  },
};

export function WorkspaceHeader({ currentView, onNavigate }) {
  const content = viewContent[currentView];

  return (
    <section className="workspace-header">
      <div className="workspace-header__copy">
        <p className="eyebrow">{content.eyebrow}</p>
        <h1>{content.title}</h1>
        <p>{content.description}</p>
      </div>

      <button
        type="button"
        className="button button--primary"
        onClick={() => onNavigate(content.target)}
      >
        {content.action}
      </button>
    </section>
  );
}
