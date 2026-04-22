import { pool, tenantQuery } from "../db.js";
import { asyncHandler } from "../utils/async-handler.js";

/**
 * Aggregates task stats for the organization.
 */
export const getOrgAnalytics = asyncHandler(async (req, res) => {
  const orgId = req.user.organizationId;

  // 1. Tasks per day (last 7 days)
  const taskVolume = await tenantQuery(
    `SELECT DATE_TRUNC('day', created_at) as date, COUNT(*) as count
     FROM tasks
     WHERE created_at > NOW() - INTERVAL '7 days'
     GROUP BY date
     ORDER BY date ASC`
  );

  // 2. Task status distribution
  const statusDist = await tenantQuery(
    `SELECT status, COUNT(*) as count
     FROM tasks
     GROUP BY status`
  );

  // 3. Most active users (by task completion/creation)
  const activeUsers = await tenantQuery(
    `SELECT u.name, COUNT(t.id) as task_count
     FROM users u
     JOIN tasks t ON t.creator_id = u.id
     WHERE t.created_at > NOW() - INTERVAL '30 days'
     GROUP BY u.name
     ORDER BY task_count DESC
     LIMIT 5`
  );

  res.json({
    success: true,
    data: {
      taskVolume: taskVolume.rows,
      statusDistribution: statusDist.rows,
      mostActiveUsers: activeUsers.rows
    }
  });
});
