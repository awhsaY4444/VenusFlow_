import bcrypt from "bcryptjs";
import crypto from "crypto";

import { withTransaction } from "../db.js";
import { AppError } from "../utils/errors.js";
import { signToken } from "../utils/jwt.js";
import { slugify } from "../utils/slug.js";
import { hashToken } from "../utils/hash.js";

function buildAuthPayload(user) {
  return {
    token: signToken({
      sub: user.id,
      organizationId: user.organization_id,
      role: user.role,
    }),
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      organizationId: user.organization_id,
      organizationName: user.organization_name,
      organizationSlug: user.organization_slug,
      authProvider: user.auth_provider,
      theme: user.theme || "light",
    },
  };
}

async function createUniqueSlug(client, organizationName) {
  const baseSlug = slugify(organizationName) || "workspace";
  let slug = baseSlug;
  let suffix = 1;

  while (true) {
    const result = await client.query(
      "SELECT id FROM organizations WHERE slug = $1",
      [slug]
    );

    if (!result.rows[0]) {
      return slug;
    }

    suffix += 1;
    slug = `${baseSlug}-${suffix}`;
  }
}

export async function registerUser({ organizationName, name, email, password }) {
  return withTransaction(async (client) => {
    const existingUser = await client.query(
      "SELECT id FROM users WHERE email = $1",
      [email.toLowerCase()]
    );

    if (existingUser.rows[0]) {
      throw new AppError(409, "An account with this email already exists");
    }

    const slug = await createUniqueSlug(client, organizationName);
    const organizationResult = await client.query(
      `INSERT INTO organizations (name, slug)
       VALUES ($1, $2)
       RETURNING id, name, slug`,
      [organizationName, slug]
    );

    const organization = organizationResult.rows[0];
    const passwordHash = await bcrypt.hash(password, 10);
    const userResult = await client.query(
      `INSERT INTO users (organization_id, name, email, password_hash, role)
       VALUES ($1, $2, $3, $4, 'admin')
       RETURNING id, organization_id, name, email, role, auth_provider, theme`,
      [organization.id, name, email.toLowerCase(), passwordHash]
    );

    return buildAuthPayload({
      ...userResult.rows[0],
      organization_name: organization.name,
      organization_slug: organization.slug,
    });
  });
}

export async function loginUser({ email, password }) {
  return withTransaction(async (client) => {
    const userResult = await client.query(
      `SELECT u.id, u.organization_id, u.name, u.email, u.role, u.password_hash, u.auth_provider, u.theme,
              o.name AS organization_name, o.slug AS organization_slug
       FROM users u
       JOIN organizations o ON o.id = u.organization_id
       WHERE u.email = $1`,
      [email.toLowerCase()]
    );

    const user = userResult.rows[0];
    if (!user || !user.password_hash) {
      throw new AppError(401, "Invalid email or password");
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      throw new AppError(401, "Invalid email or password");
    }

    return buildAuthPayload(user);
  });
}

export async function loginWithGoogle({
  email,
  name,
  googleId,
  organizationName,
}) {
  return withTransaction(async (client) => {
    const existingUserResult = await client.query(
      `SELECT u.id, u.organization_id, u.name, u.email, u.role, u.auth_provider, u.theme,
              o.name AS organization_name, o.slug AS organization_slug
       FROM users u
       JOIN organizations o ON o.id = u.organization_id
       WHERE u.email = $1`,
      [email.toLowerCase()]
    );

    let user = existingUserResult.rows[0];

    if (!user) {
      const workspaceName = organizationName || `${name}'s Workspace`;
      const slug = await createUniqueSlug(client, workspaceName);
      const organizationResult = await client.query(
        `INSERT INTO organizations (name, slug)
         VALUES ($1, $2)
         RETURNING id, name, slug`,
        [workspaceName, slug]
      );

      const organization = organizationResult.rows[0];
      const userResult = await client.query(
        `INSERT INTO users (organization_id, name, email, role, auth_provider, google_id)
         VALUES ($1, $2, $3, 'admin', 'google', $4)
         RETURNING id, organization_id, name, email, role, auth_provider, theme`,
        [organization.id, name, email.toLowerCase(), googleId]
      );

      user = {
        ...userResult.rows[0],
        organization_name: organization.name,
        organization_slug: organization.slug,
      };
    }

    return buildAuthPayload(user);
  });
}

export async function forgotPassword(email) {
  return withTransaction(async (client) => {
    const userResult = await client.query(
      "SELECT id, name FROM users WHERE email = $1",
      [email.toLowerCase()]
    );

    const user = userResult.rows[0];
    if (!user) {
      throw new AppError(404, "No account found with this email");
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = hashToken(rawToken);
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 15);

    await client.query(
      "UPDATE users SET reset_password_token = $1, reset_password_expires = $2 WHERE id = $3",
      [hashedToken, expires, user.id]
    );

    return { token: rawToken, name: user.name };
  });
}

export async function resetPassword(token, newPassword) {
  return withTransaction(async (client) => {
    const hashedToken = hashToken(token);
    
    const userResult = await client.query(
      "SELECT id FROM users WHERE reset_password_token = $1 AND reset_password_expires > NOW()",
      [hashedToken]
    );

    const user = userResult.rows[0];
    if (!user) {
      throw new AppError(400, "Password reset token is invalid or has expired");
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await client.query(
      "UPDATE users SET password_hash = $1, reset_password_token = NULL, reset_password_expires = NULL WHERE id = $2",
      [passwordHash, user.id]
    );

    return { success: true };
  });
}
