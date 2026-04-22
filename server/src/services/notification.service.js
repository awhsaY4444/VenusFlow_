import { pool } from "../db.js";

/**
 * Creates an in-app notification.
 */
export async function createNotification({ organizationId, userId, type, data }) {
  const result = await pool.query(
    `INSERT INTO notifications (organization_id, user_id, type, data)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [organizationId, userId, type, JSON.stringify(data)]
  );

  return result.rows[0];
}

/**
 * Lists notifications for a user.
 */
export async function listNotifications({ userId, limit = 20 }) {
  const result = await pool.query(
    `SELECT * FROM notifications 
     WHERE user_id = $1 
     ORDER BY created_at DESC 
     LIMIT $2`,
    [userId, limit]
  );

  return result.rows.map(row => ({
    id: row.id,
    type: row.type,
    data: row.data,
    isRead: row.is_read,
    createdAt: row.created_at
  }));
}

/**
 * Marks notification as read.
 */
export async function markAsRead(notificationId, userId) {
  await pool.query(
    "UPDATE notifications SET is_read = TRUE WHERE id = $1 AND user_id = $2",
    [notificationId, userId]
  );
}
