import dotenv from "dotenv";

dotenv.config();

function parseAllowedOrigins(value) {
  return (value || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

const appUrl = process.env.APP_URL || process.env.CLIENT_URL || "http://localhost:5173";
const allowedOrigins = parseAllowedOrigins(
  process.env.CORS_ALLOWED_ORIGINS || appUrl
);
const smtpPort = Number(process.env.SMTP_PORT || 587);
const smtpSecure = process.env.SMTP_SECURE
  ? process.env.SMTP_SECURE === "true"
  : smtpPort === 465;

export const config = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 4000),
  databaseUrl:
    process.env.DATABASE_URL ||
    "postgres://postgres@localhost:5433/postgres",
  jwtSecret: process.env.JWT_SECRET || "replace-this-with-a-long-random-string",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",
  clientUrl: appUrl,
  appUrl,
  allowedOrigins,
  googleClientId: process.env.GOOGLE_CLIENT_ID || "",
  mail: {
    host: process.env.SMTP_HOST || "",
    port: smtpPort,
    secure: smtpSecure,
    user: process.env.SMTP_USER || process.env.EMAIL_USER || "",
    pass: process.env.SMTP_PASS || process.env.EMAIL_PASS || "",
    from:
      process.env.EMAIL_FROM ||
      process.env.SMTP_FROM ||
      '"VenusFlow" <noreply@venusflow.com>',
  },
};

