import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { requirePermission } from "../middleware/rbac.js";
import { tenantMiddleware } from "../middleware/tenant.js";
import { getOrgAnalytics } from "../controllers/analytics.controller.js";

export const analyticsRouter = express.Router();

analyticsRouter.get(
  "/",
  requireAuth,
  tenantMiddleware,
  requirePermission("VIEW_ANALYTICS"),
  getOrgAnalytics
);
