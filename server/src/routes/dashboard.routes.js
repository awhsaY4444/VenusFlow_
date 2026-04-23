import express from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { query } from "../db.js";

export const dashboardRouter = express.Router();

/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     summary: Get dashboard statistics and recent activity
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 stats:
 *                   type: object
 *                   properties:
 *                     totalTasks:
 *                       type: number
 *                       example: 25
 *                     completedTasks:
 *                       type: number
 *                       example: 10
 *                     inProgressTasks:
 *                       type: number
 *                       example: 8
 *                     overdueTasks:
 *                       type: number
 *                       example: 3
 *                 activity:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                       action:
 *                         type: string
 *                       actorName:
 *                         type: string
 *                       taskTitle:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Unauthorized
 */

dashboardRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const [statsResult, activityResult] = await Promise.all([
      query(
        `SELECT
           COUNT(*) FILTER (WHERE deleted_at IS NULL) AS total_tasks,
           COUNT(*) FILTER (WHERE deleted_at IS NULL AND status = 'done') AS completed_tasks,
           COUNT(*) FILTER (WHERE deleted_at IS NULL AND status = 'in_progress') AS in_progress_tasks,
           COUNT(*) FILTER (WHERE deleted_at IS NULL AND due_date < CURRENT_DATE AND status <> 'done') AS overdue_tasks
         FROM tasks
         WHERE organization_id = $1`,
        [req.user.organizationId]
      ),
      query(
        `SELECT l.id, l.action, l.created_at, u.name AS actor_name, t.title
         FROM task_audit_logs l
         LEFT JOIN users u ON u.id = l.actor_id
         JOIN tasks t ON t.id = l.task_id
         WHERE l.organization_id = $1
         ORDER BY l.created_at DESC
         LIMIT 8`,
        [req.user.organizationId]
      ),
    ]);

    res.json({
      success: true,
      stats: {
        totalTasks: Number(statsResult.rows[0].total_tasks || 0),
        completedTasks: Number(statsResult.rows[0].completed_tasks || 0),
        inProgressTasks: Number(statsResult.rows[0].in_progress_tasks || 0),
        overdueTasks: Number(statsResult.rows[0].overdue_tasks || 0),
      },
      activity: activityResult.rows.map((item) => ({
        id: item.id,
        action: item.action,
        actorName: item.actor_name || "Unknown user",
        taskTitle: item.title,
        createdAt: item.created_at,
      })),
    });
  })
);