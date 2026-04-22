import { AppError } from "./errors.js";

function base64UrlDecode(value) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  return Buffer.from(padded, "base64").toString("utf8");
}

export function parseGoogleCredential(credential) {
  if (!credential) {
    throw new AppError(400, "Google credential is required");
  }

  const parts = credential.split(".");
  if (parts.length < 2) {
    throw new AppError(400, "Invalid Google credential");
  }

  try {
    return JSON.parse(base64UrlDecode(parts[1]));
  } catch {
    throw new AppError(400, "Unable to parse Google credential");
  }
}
