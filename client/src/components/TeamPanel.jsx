export function TeamPanel({ users, memberForm, onChange, onSubmit }) {
  return (
    <form className="panel" onSubmit={onSubmit}>
      <div className="section-heading">
        <h3>Add Team Member</h3>
        <p>Create organization-scoped users directly from the admin workspace.</p>
      </div>

      <div className="field-grid">
        <label>
          Name
          <input
            value={memberForm.name}
            onChange={(event) => onChange("name", event.target.value)}
            required
          />
        </label>

        <label>
          Role
          <select
            value={memberForm.role}
            onChange={(event) => onChange("role", event.target.value)}
          >
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>
        </label>
      </div>

      <label>
        Email
        <input
          type="email"
          value={memberForm.email}
          onChange={(event) => onChange("email", event.target.value)}
          required
        />
      </label>

      <label>
        Temporary password
        <input
          type="password"
          value={memberForm.password}
          onChange={(event) => onChange("password", event.target.value)}
          required
        />
      </label>

      <button className="button button--primary" type="submit">
        Add member
      </button>

      <div className="member-summary">
        {users.map((member) => (
          <div key={member.id} className="member-summary__row">
            <div>
              <strong>{member.name}</strong>
              <p>{member.email}</p>
            </div>
            <span className="badge">{member.role}</span>
          </div>
        ))}
      </div>
    </form>
  );
}
