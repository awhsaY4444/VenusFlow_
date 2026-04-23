import express from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { requireAuth } from "../middleware/auth.js";
import { listNotifications, markAsRead } from "../services/notification.service.js";

export const notificationRouter = express.Router();

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Get user notifications
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of notifications
 *       401:
 *         description: Unauthorized
 */
notificationRouter.get(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const notifications = await listNotifications({
      userId: req.user.id
    });
    res.json({ success: true, notifications });
  })
);

/**
 * @swagger
 * /api/notifications/{id}/read:
 *   patch:
 *     summary: Mark notification as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Notification ID
 *     responses:
 *       200:
 *         description: Notification marked as read
 *       401:
 *         description: Unauthorized
 */
notificationRouter.patch(
  "/:id/read",
  requireAuth,
  asyncHandler(async (req, res) => {
    await markAsRead(req.params.id, req.user.id);
    res.json({ success: true });
  })
);