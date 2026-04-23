import express from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { requireAuth } from "../middleware/auth.js";
import { requirePermission } from "../middleware/rbac.js";
import { createInvite, verifyInvite } from "../services/invite.service.js";
import { tenantMiddleware } from "../middleware/tenant.js";

export const inviteRouter = express.Router();

/**
 * @swagger
 * /api/invites:
 *   post:
 *     summary: Send an invitation (Admin only)
 *     tags: [Invites]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, role]
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               role:
 *                 type: string
 *                 example: member
 *     responses:
 *       201:
 *         description: Invitation created
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (missing permission)
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
 * @swagger
 * /api/invites/{token}:
 *   get:
 *     summary: Verify an invitation token
 *     tags: [Invites]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Invitation token
 *     responses:
 *       200:
 *         description: Invite is valid
 *       404:
 *         description: Invite not found or expired
 */
inviteRouter.get(
  "/:token",
  asyncHandler(async (req, res) => {
    const invite = await verifyInvite(req.params.token);
    res.json({ success: true, invite });
  })
);