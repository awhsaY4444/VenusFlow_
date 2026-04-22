import crypto from "crypto";

/**
 * Hashes a token using SHA256.
 * @param {string} token - The raw token to hash.
 * @returns {string} - The hex-encoded SHA256 hash.
 */
export function hashToken(token) {
  if (!token) return null;
  return crypto.createHash("sha256").update(token).digest("hex");
}
