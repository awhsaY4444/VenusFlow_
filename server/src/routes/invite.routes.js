import express from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { requireAuth } from "../middleware/auth.js";
import { requirePermission } from "../middleware/rbac.js";
import { createInvite, verifyInvite } from "../services/invite.service.js";
import { tenantMiddleware } from "../middleware/tenant.js";

export const inviteRouter = express.Router();

/**
 * Send an invitation (Admin only)
 */
inviteRouter.post(
  "/",
  requireAuth,
  tenantMiddleware,
  requirePermission("INVITE_USERS"),
  asyncHandler(async (req, res) => {
    const { email, role } = req.body;
    const invite = await createInvite({
      organizationId: req.user.organizationId,
      email,
      role,
    });

    res.status(201).json({ success: true, invite });
  })
);

/**
 * Verify a token (Public)
 */
inviteRouter.get(
  "/:token",
  asyncHandler(async (req, res) => {
    const invite = await verifyInvite(req.params.token);
    res.json({ success: true, invite });
  })
);
