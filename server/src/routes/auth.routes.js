import express from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { AppError } from "../utils/errors.js";
import { registerUser, loginUser, loginWithGoogle } from "../services/auth.service.js";
import { forgotPasswordHandler, resetPasswordHandler } from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { query } from "../db.js";
import { parseGoogleCredential } from "../utils/oauth.js";
import { sendEmail } from "../utils/email.js";
import { config } from "../config.js";

export const authRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication APIs
 */

/**
 * @swagger
 * /api/auth/test-email:
 *   get:
 *     summary: Send test email
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Email sent successfully
 */
authRouter.get(
  "/test-email",
  asyncHandler(async (req, res) => {
    const isSent = await sendEmail({
      to: config.mail.user,
      subject: "VenusFlow SMTP Test",
      html: "<h1>Email System Works!</h1><p>Your Gmail SMTP configuration is correct.</p>",
    });

    if (!isSent) {
      throw new Error("SMTP Test failed. Check server console for full error logs.");
    }

    res.json({ success: true, message: `Test email sent successfully to ${config.mail.user}` });
  })
);

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               organizationName:
 *                 type: string
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 */
authRouter.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { organizationName, name, email, password } = req.body;

    if (!organizationName || !name || !email || !password) {
      throw new AppError(400, "Organization, name, email, and password are required");
    }

    const result = await registerUser({ organizationName, name, email, password });
    res.status(201).json({ success: true, ...result });
  })
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
authRouter.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError(400, "Email and password are required");
    }

    const result = await loginUser({ email, password });
    res.json({ success: true, ...result });
  })
);

/**
 * @swagger
 * /api/auth/google:
 *   post:
 *     summary: Login with Google
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Google login successful
 */
authRouter.post(
  "/google",
  asyncHandler(async (req, res) => {
    const { credential, organizationName } = req.body;
    const payload = parseGoogleCredential(credential);

    if (!payload.email || !payload.name || !payload.sub) {
      throw new AppError(400, "Google payload is missing required fields");
    }

    const result = await loginWithGoogle({
      email: payload.email,
      name: payload.name,
      googleId: payload.sub,
      organizationName,
    });

    res.json({ success: true, ...result });
  })
);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User data fetched successfully
 */
authRouter.get(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    const result = await query(
      `SELECT u.id, u.name, u.email, u.role, u.permissions, u.auth_provider, u.avatar_url, u.timezone,
              u.language, u.theme, u.email_notifications, u.task_updates_notifications,
              u.mentions_notifications, u.created_at, u.updated_at,
              o.id AS organization_id, o.name AS organization_name, o.slug AS organization_slug
       FROM users u
       JOIN organizations o ON o.id = u.organization_id
       WHERE u.id = $1`,
      [req.user.id]
    );

    const user = result.rows[0];
    if (!user) {
      throw new AppError(404, "User not found");
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        permissions: user.permissions || [],
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
 * /api/auth/forgot-password:
 *   post:
 *     summary: Send reset password email
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Reset email sent
 */
authRouter.post("/forgot-password", forgotPasswordHandler);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset user password
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Password reset successful
 */
authRouter.post("/reset-password", resetPasswordHandler);

authRouter.get("/debug-smtp", (req, res) => {
  const pass = config.mail.pass || "";
  const maskedPass = pass.length > 4 
    ? `${pass.substring(0, 2)}...${pass.substring(pass.length - 2)}`
    : "****";
    
  res.json({
    host: config.mail.host,
    user: config.mail.user,
    pass: maskedPass,
    passLength: pass.length,
    env_smtp_pass: process.env.SMTP_PASS ? "Set" : "Not Set",
    env_email_pass: process.env.EMAIL_PASS ? "Set" : "Not Set"
  });
});