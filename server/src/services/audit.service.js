export async function logTaskAction(
  client,
  { organizationId, taskId, actorId, action, changes = {} }
) {
  await client.query(
    `INSERT INTO task_audit_logs (organization_id, task_id, actor_id, action, changes)
     VALUES ($1, $2, $3, $4, $5)`,
    [organizationId, taskId, actorId, action, JSON.stringify(changes)]
  );
}
