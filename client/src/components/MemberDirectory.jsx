export function MemberDirectory({ users }) {
  return (
    <section className="panel">
      <div className="section-heading">
        <h3>People Directory</h3>
        <p>Everyone inside the current organization workspace.</p>
      </div>

      <div className="directory-list">
        {users.map((member) => (
          <article key={member.id} className="directory-card">
            <div>
              <strong>{member.name}</strong>
              <p>{member.email}</p>
            </div>
            <span className="badge">{member.role}</span>
          </article>
        ))}
      </div>
    </section>
  );
}
