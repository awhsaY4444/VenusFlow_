import { tenantStorage } from "../db.js";

export function tenantMiddleware(req, res, next) {
  const organizationId = req.user?.organizationId;

  if (!organizationId) {
    return next();
  }

  // Wrap the next middleware/route handler in the tenant context
  tenantStorage.run({ organizationId }, () => {
    next();
  });
}
