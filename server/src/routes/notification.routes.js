import express from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { requireAuth } from "../middleware/auth.js";
import { listNotifications, markAsRead } from "../services/notification.service.js";

export const notificationRouter = express.Router();

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

notificationRouter.patch(
  "/:id/read",
  requireAuth,
  asyncHandler(async (req, res) => {
    await markAsRead(req.params.id, req.user.id);
    res.json({ success: true });
  })
);
