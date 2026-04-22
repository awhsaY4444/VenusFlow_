import crypto from "node:crypto";
import { pool, withTransaction } from "../db.js";
import { AppError, NotFoundError, ConflictError } from "../utils/errors.js";

/**
 * Creates a unique invitation token and stores it.
 */
export async function createInvite({ organizationId, email, role = 'member' }) {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

  const result = await pool.query(
    `INSERT INTO organization_invites (organization_id, email, token, role, expires_at)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (token) DO NOTHING
     RETURNING *`,
    [organizationId, email, token, role, expiresAt]
  );

  if (result.rowCount === 0) {
    throw new ConflictError("Failed to generate a unique invite token. Please try again.");
  }

  const invite = result.rows[0];

  // In a real app, you would send an email here.
  console.log(`[INVITE MOCK] Sending invite to ${email} with token: ${token}`);

  return {
    id: invite.id,
    email: invite.email,
    token: invite.token,
    expiresAt: invite.expires_at,
  };
}

/**
 * Verifies if a token is valid and returns invite details.
 */
export async function verifyInvite(token) {
  const result = await pool.query(
    `SELECT i.*, o.name as organization_name
     FROM organization_invites i
     JOIN organizations o ON o.id = i.organization_id
     WHERE i.token = $1 AND i.status = 'pending'`,
    [token]
  );

  const invite = result.rows[0];

  if (!invite) {
    throw new NotFoundError("Invalid or expired invitation");
  }

  if (new Date(invite.expires_at) < new Date()) {
    await pool.query(
      "UPDATE organization_invites SET status = 'expired' WHERE id = $1",
      [invite.id]
    );
    throw new AppError(400, "Invitation has expired");
  }

  return {
    id: invite.id,
    email: invite.email,
    organizationId: invite.organization_id,
    organizationName: invite.organization_name,
    role: invite.role,
  };
}

/**
 * Marks invite as accepted.
 */
export async function acceptInvite(client, inviteId) {
  await client.query(
    "UPDATE organization_invites SET status = 'accepted' WHERE id = $1",
    [inviteId]
  );
}
