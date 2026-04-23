import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { requirePermission } from "../middleware/rbac.js";
import { tenantMiddleware } from "../middleware/tenant.js";
import { getOrgAnalytics } from "../controllers/analytics.controller.js";

export const analyticsRouter = express.Router();

/**
 * @swagger
 * /api/analytics:
 *   get:
 *     summary: Get organization analytics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Analytics data retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (missing permission)
 */
analyticsRouter.get(
  "/",
  requireAuth,
  tenantMiddleware,
  requirePermission("VIEW_ANALYTICS"),
  getOrgAnalytics
);