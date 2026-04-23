import { query } from "../db.js";
import { AppError } from "../utils/errors.js";
import { verifyToken } from "../utils/jwt.js";

export async function requireAuth(req, _res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : null;

  if (!token) {
    return next(new AppError(401, "Authentication required"));
  }

  try {
    const decoded = verifyToken(token);
    const result = await query(
      `SELECT id, organization_id, name, email, role, auth_provider, permissions
       FROM users
       WHERE id = $1`,
      [decoded.sub]
    );


    const user = result.rows[0];
    if (!user) {
      return next(new AppError(401, "User not found"));
    }

    req.user = {
      id: user.id,
      organizationId: user.organization_id,
      name: user.name,
      email: user.email,
      role: user.role,
      permissions: user.permissions || [],
      authProvider: user.auth_provider,
    };


    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    next(new AppError(401, "Invalid or expired token"));
  }
}
