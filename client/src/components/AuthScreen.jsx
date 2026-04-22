export function AuthScreen({
  mode,
  busy,
  message,
  authForm,
  onModeChange,
  onChange,
  onSubmit,
}) {
  return (
    <div className="auth-page">
      <section className="auth-promo">
        <div className="auth-promo__badge">VenusFlow Workspace OS</div>
        <h1>Task management that looks like a real internal platform.</h1>
        <p>
          Built for multi-tenant teams with strict data isolation, JWT authentication,
          audit logs, and role-aware workflows.
        </p>
        <div className="auth-promo__grid">
          <div>
            <strong>Tenant-safe</strong>
            <span>Every query is scoped to the organization.</span>
          </div>
          <div>
            <strong>Role-based</strong>
            <span>Admins manage the workspace, members stay scoped.</span>
          </div>
          <div>
            <strong>Auditable</strong>
            <span>Task updates and comments are tracked over time.</span>
          </div>
        </div>
      </section>

      <form className="auth-panel" onSubmit={onSubmit}>
        <div className="auth-panel__switch">
          <button
            type="button"
            className={mode === "login" ? "active" : ""}
            onClick={() => onModeChange("login")}
          >
            Login
          </button>
          <button
            type="button"
            className={mode === "register" ? "active" : ""}
            onClick={() => onModeChange("register")}
          >
            Create Workspace
          </button>
        </div>

        <div className="section-heading">
          <h2>{mode === "register" ? "Launch a workspace" : "Welcome back"}</h2>
          <p>
            {mode === "register"
              ? "Create your organization and start managing tasks securely."
              : "Sign in to view tasks, members, and the audit timeline."}
          </p>
        </div>

        {mode === "register" ? (
          <>
            <label>
              Workspace name
              <input
                value={authForm.organizationName}
                onChange={(event) => onChange("organizationName", event.target.value)}
                placeholder="Acme Labs"
                required
              />
            </label>
            <label>
              Your name
              <input
                value={authForm.name}
                onChange={(event) => onChange("name", event.target.value)}
                placeholder="Aarav Sharma"
                required
              />
            </label>
          </>
        ) : null}

        <label>
          Email
          <input
            type="email"
            value={authForm.email}
            onChange={(event) => onChange("email", event.target.value)}
            placeholder="you@company.com"
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={authForm.password}
            onChange={(event) => onChange("password", event.target.value)}
            placeholder="Enter your password"
            required
          />
        </label>

        {message ? <div className="notice notice--info">{message}</div> : null}

        <button className="button button--primary" type="submit" disabled={busy}>
          {busy
            ? "Working..."
            : mode === "register"
              ? "Create workspace"
              : "Login"}
        </button>
      </form>
    </div>
  );
}
