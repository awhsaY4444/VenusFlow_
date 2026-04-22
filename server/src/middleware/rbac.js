import { ForbiddenError } from "../utils/errors.js";

export function requireRole(...roles) {
  return function roleMiddleware(req, _res, next) {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ForbiddenError("You do not have the required role for this action"));
    }

    next();
  };
}

export function requirePermission(...permissions) {
  return function permissionMiddleware(req, _res, next) {
    if (!req.user) {
      return next(new ForbiddenError("Authentication required"));
    }

    const userPermissions = req.user.permissions || [];
    const hasPermission = permissions.every(p => userPermissions.includes(p));

    if (!hasPermission && req.user.role !== 'admin') {
      return next(new ForbiddenError(`Missing required permission(s): ${permissions.join(', ')}`));
    }

    next();
  };
}

