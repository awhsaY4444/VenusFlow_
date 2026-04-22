import express from "express";
import { OAuth2Client } from "google-auth-library";
import { asyncHandler } from "../utils/async-handler.js";
import { pool } from "../db.js";
import jwt from "jsonwebtoken";
import { config } from "../config.js";

export const oauthRouter = express.Router();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * Handle Google Login (Token Swap)
 */
oauthRouter.post(
  "/google",
  asyncHandler(async (req, res) => {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ success: false, message: "ID Token is required" });
    }

    try {
      const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      const { sub: googleId, email, name, picture: avatarUrl } = payload;

      // Find or create user
      let userResult = await pool.query(
        "SELECT * FROM users WHERE google_id = $1 OR email = $2",
        [googleId, email]
      );

      let user = userResult.rows[0];

      if (!user) {
        // Handle new user creation (simplified: requires an organization)
        // In a real flow, you might redirect to "Create Organization" if no invite
        return res.status(403).json({ 
          success: false, 
          message: "Account not found. Please join via invitation first." 
        });
      }

      // Link Google ID if not linked
      if (!user.google_id) {
        await pool.query(
          "UPDATE users SET google_id = $1, auth_provider = 'google', avatar_url = $2 WHERE id = $3",
          [googleId, avatarUrl, user.id]
        );
      }

      const token = jwt.sign(
        { id: user.id, organizationId: user.organization_id, role: user.role, permissions: user.permissions },
        config.jwtSecret,
        { expiresIn: "7d" }
      );

      res.json({
        success: true,
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatarUrl: user.avatar_url,
          organizationId: user.organization_id,
        },
      });
    } catch (error) {
      console.error("Google Auth Error", error);
      res.status(401).json({ success: false, message: "Invalid Google Token" });
    }
  })
);
