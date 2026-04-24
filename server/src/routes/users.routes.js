import express from "express";
import bcrypt from "bcryptjs";
import { asyncHandler } from "../utils/async-handler.js";
import { query } from "../db.js";
import { AppError } from "../utils/errors.js";
import { requireRole } from "../middleware/rbac.js";
import { sendMemberInvitationEmail } from "../utils/email.js";

export const usersRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management APIs
 */

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
usersRouter.get(
  "/me",
  asyncHandler(async (req, res) => {
    const result = await query(
      `SELECT u.id, u.name, u.email, u.role, u.auth_provider, u.avatar_url, u.timezone,
              u.language, u.theme, u.email_notifications, u.task_updates_notifications,
              u.mentions_notifications, u.created_at, u.updated_at,
              o.id AS organization_id, o.name AS organization_name, o.slug AS organization_slug
       FROM users u
       JOIN organizations o ON o.id = u.organization_id
       WHERE u.id = $1`,
      [req.user.id]
    );

    const user = result.rows[0];

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        authProvider: user.auth_provider,
        avatarUrl: user.avatar_url,
        timezone: user.timezone,
        language: user.language,
        theme: user.theme,
        notifications: {
          email: user.email_notifications,
          taskUpdates: user.task_updates_notifications,
          mentions: user.mentions_notifications,
        },
        organizationId: user.organization_id,
        organizationName: user.organization_name,
        organizationSlug: user.organization_slug,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      },
    });
  })
);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users in organization
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
usersRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const result = await query(
      `SELECT id, name, email, role, auth_provider, avatar_url, created_at
       FROM users
       WHERE organization_id = $1
       ORDER BY created_at ASC`,
      [req.user.organizationId]
    );

    res.json({
      success: true,
      users: result.rows.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        authProvider: user.auth_provider,
        avatarUrl: user.avatar_url,
        createdAt: user.created_at,
      })),
    });
  })
);

/**
 * @swagger
 * /api/users/update:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
usersRouter.put(
  "/update",
  asyncHandler(async (req, res) => {
    const {
      name,
      avatarUrl,
      timezone,
      language,
      theme,
      notifications,
      workspaceName,
    } = req.body;

    if (!name?.trim()) {
      throw new AppError(400, "Name is required");
    }

    await query(
      `UPDATE users
       SET name = $2,
           avatar_url = $3,
           timezone = $4,
           language = $5,
           theme = $6,
           email_notifications = $7,
           task_updates_notifications = $8,
           mentions_notifications = $9,
           updated_at = NOW()
       WHERE id = $1`,
      [
        req.user.id,
        name.trim(),
        avatarUrl || null,
        timezone || "Asia/Calcutta",
        language || "English",
        theme || "light",
        notifications?.email ?? true,
        notifications?.taskUpdates ?? true,
        notifications?.mentions ?? true,
      ]
    );

    if (workspaceName && req.user.role === "admin") {
      await query(
        `UPDATE organizations
         SET name = $2
         WHERE id = $1`,
        [req.user.organizationId, workspaceName.trim()]
      );
    }

    const result = await query(
      `SELECT u.id, u.name, u.email, u.role, u.auth_provider, u.avatar_url, u.timezone,
              u.language, u.theme, u.email_notifications, u.task_updates_notifications,
              u.mentions_notifications, u.created_at, u.updated_at,
              o.id AS organization_id, o.name AS organization_name, o.slug AS organization_slug
       FROM users u
       JOIN organizations o ON o.id = u.organization_id
       WHERE u.id = $1`,
      [req.user.id]
    );

    const user = result.rows[0];

    res.json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  })
);

/**
 * @swagger
 * /api/users/change-password:
 *   put:
 *     summary: Change user password
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
usersRouter.put(
  "/change-password",
  asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      throw new AppError(400, "Current password and new password are required");
    }

    if (newPassword.length < 8) {
      throw new AppError(400, "New password must be at least 8 characters long");
    }

    const result = await query(
      `SELECT password_hash FROM users WHERE id = $1`,
      [req.user.id]
    );

    const passwordHash = result.rows[0]?.password_hash;

    if (!passwordHash) {
      throw new AppError(400, "Password cannot be changed for this account");
    }

    const isValid = await bcrypt.compare(currentPassword, passwordHash);
    if (!isValid) {
      throw new AppError(401, "Current password is incorrect");
    }

    const nextPasswordHash = await bcrypt.hash(newPassword, 10);
    await query(
      `UPDATE users SET password_hash = $2, updated_at = NOW() WHERE id = $1`,
      [req.user.id, nextPasswordHash]
    );

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  })
);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create new user (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
usersRouter.post(
  "/",
  requireRole("admin"),
  asyncHandler(async (req, res) => {
    const { name, email, password, role = "member" } = req.body;

    if (!name || !email || !password) {
      throw new AppError(400, "Name, email, and password are required");
    }

    if (!["admin", "member"].includes(role)) {
      throw new AppError(400, "Role must be admin or member");
    }

    const existingUser = await query("SELECT id FROM users WHERE email = $1", [
      email.toLowerCase(),
    ]);

    if (existingUser.rows[0]) {
      throw new AppError(409, "A user with this email already exists");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const orgResult = await query("SELECT name FROM organizations WHERE id = $1", [req.user.organizationId]);
    const organizationName = orgResult.rows[0]?.name || "VenusFlow";

    const result = await query(
      `INSERT INTO users (organization_id, name, email, password_hash, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, email, role, auth_provider, created_at`,
      [
        req.user.organizationId,
        name,
        email.toLowerCase(),
        passwordHash,
        role,
      ]
    );

    const user = result.rows[0];

    sendMemberInvitationEmail(email.toLowerCase(), name, organizationName, password).catch(console.error);

    res.status(201).json({ success: true, user });
  })
);

/**
 * @swagger
 * /api/users/{userId}/role:
 *   put:
 *     summary: Update user role (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
usersRouter.put(
  "/:userId/role",
  requireRole("admin"),
  asyncHandler(async (req, res) => {
    const { role } = req.body;

    if (!["admin", "member"].includes(role)) {
      throw new AppError(400, "Role must be admin or member");
    }

    const result = await query(
      `UPDATE users
       SET role = $3, updated_at = NOW()
       WHERE id = $1 AND organization_id = $2
       RETURNING id, name, email, role, auth_provider, avatar_url, created_at`,
      [req.params.userId, req.user.organizationId, role]
    );

    const updatedUser = result.rows[0];

    if (!updatedUser) {
      throw new AppError(404, "User not found");
    }

    res.json({ success: true, user: updatedUser });
  })
);

/**
 * @swagger
 * /api/users/{userId}:
 *   delete:
 *     summary: Remove user from organization (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
usersRouter.delete(
  "/:userId",
  requireRole("admin"),
  asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (userId === req.user.id) {
      throw new AppError(400, "You cannot remove yourself from the workspace");
    }

    const result = await query(
      "DELETE FROM users WHERE id = $1 AND organization_id = $2 RETURNING id, name",
      [userId, req.user.organizationId]
    );

    if (result.rowCount === 0) {
      throw new AppError(404, "Member not found in your organization");
    }

    res.json({
      success: true,
      message: `Member ${result.rows[0].name} has been strictly removed`,
    });
  })
);