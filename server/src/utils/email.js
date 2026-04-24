import nodemailer from "nodemailer";
import { config } from "../config.js";
import { EmailServiceError } from "./errors.js";

let transporter;

function redactEmailConfig() {
  return {
    host: config.mail.host,
    port: config.mail.port,
    secure: config.mail.secure,
    user: config.mail.user,
    from: config.mail.from,
    hasPassword: Boolean(config.mail.pass),
  };
}

function getTransporter() {
  if (!config.mail.host || !config.mail.user || !config.mail.pass) {
    throw new EmailServiceError(
      "Email service failed: missing SMTP configuration",
      redactEmailConfig()
    );
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: config.mail.host,
      port: config.mail.port,
      secure: config.mail.secure,
      requireTLS: !config.mail.secure,
      auth: {
        user: config.mail.user,
        pass: config.mail.pass,
      },
    });
  }

  return transporter;
}

function formatEmailError(error) {
  return (
    error?.response ||
    error?.message ||
    "Unknown SMTP error"
  ).replace(/\s+/g, " ").trim();
}

/**
 * Sends an email and throws a meaningful API-safe error on failure.
 */
export async function sendEmail({ to, subject, html, text }) {
  console.log("[Email] Attempting delivery", {
    to,
    subject,
    ...redactEmailConfig(),
  });

  try {
    const activeTransporter = getTransporter();
    const info = await activeTransporter.sendMail({
      from: config.mail.from,
      to,
      subject,
      html,
      text,
    });

    console.log("[Email] Success", {
      to,
      subject,
      messageId: info.messageId,
      response: info.response,
    });

    return info;
  } catch (error) {
    const details = {
      message: error?.message,
      code: error?.code,
      command: error?.command,
      response: error?.response,
      responseCode: error?.responseCode,
      config: redactEmailConfig(),
    };

    console.error("[Email] Critical delivery failure", {
      ...details,
      smtp_user: config.mail.user,
      smtp_host: config.mail.host,
    });

    throw new EmailServiceError(
      `Email service failed: ${formatEmailError(error)}`,
      details
    );
  }
}

/**
 * Specifically sends a password reset email.
 * @returns {Promise<object>}
 */
export async function sendPasswordResetEmail(email, name, resetUrl) {
  const subject = "Reset your VenusFlow Password";
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
      <div style="background-color: #2563eb; padding: 40px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">VenusFlow</h1>
      </div>
      <div style="padding: 40px; border: 1px solid #e2e8f0; border-top: 0; border-radius: 0 0 12px 12px;">
        <h2 style="margin-top: 0;">Hi ${name},</h2>
        <p style="font-size: 16px; line-height: 24px;">
          We received a request to reset your password for your VenusFlow account.
          Click the button below to set a new password. This link will expire in 15 minutes.
        </p>
        <div style="text-align: center; margin: 40px 0;">
          <a href="${resetUrl}" style="background-color: #2563eb; color: white; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p style="font-size: 14px; color: #64748b; line-height: 20px;">
          If you didn't request this, you can safely ignore this email.
        </p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 40px 0;" />
        <p style="font-size: 12px; color: #94a3b8; text-align: center;">
          © 2026 VenusFlow Systems. All rights reserved.
        </p>
      </div>
    </div>
  `;

  return sendEmail({ to: email, subject, html });
}

export async function sendInviteLinkEmail(email, workspaceName, inviteUrl, role) {
  const subject = `You're invited to join ${workspaceName} on VenusFlow`;
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
      <div style="background-color: #2563eb; padding: 40px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">VenusFlow</h1>
      </div>
      <div style="padding: 40px; border: 1px solid #e2e8f0; border-top: 0; border-radius: 0 0 12px 12px;">
        <h2 style="margin-top: 0;">You're invited</h2>
        <p style="font-size: 16px; line-height: 24px;">
          You have been invited to join <strong>${workspaceName}</strong> as a <strong>${role}</strong>.
        </p>
        <div style="text-align: center; margin: 40px 0;">
          <a href="${inviteUrl}" style="background-color: #2563eb; color: white; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block;">
            Accept Invitation
          </a>
        </div>
      </div>
    </div>
  `;

  return sendEmail({ to: email, subject, html });
}

/**
 * Sends an invitation email to a new team member.
 * @param {string} email - Recipient email.
 * @param {string} name - Recipient name.
 * @param {string} workspaceName - Organization name.
 * @param {string} tempPassword - The temporary password created by admin.
 * @returns {Promise<boolean>}
 */
export async function sendMemberInvitationEmail(email, name, workspaceName, tempPassword) {
  const subject = `You've been invited to join ${workspaceName} on VenusFlow`;
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
      <div style="background-color: #059669; padding: 40px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">VenusFlow</h1>
      </div>
      <div style="padding: 40px; border: 1px solid #e2e8f0; border-top: 0; border-radius: 0 0 12px 12px;">
        <h2 style="margin-top: 0;">Welcome, ${name}!</h2>
        <p style="font-size: 16px; line-height: 24px;">
          You have been invited to join the <strong>${workspaceName}</strong> workspace on VenusFlow.
          A new account has been created for you.
        </p>
        <div style="background-color: #f8fafc; padding: 24px; border-radius: 8px; margin: 32px 0; border: 1px dashed #cbd5e1;">
          <p style="margin: 0 0 8px 0; font-size: 14px; color: #64748b;">Temporary Password:</p>
          <p style="margin: 0; font-size: 20px; font-weight: bold; color: #0f172a; letter-spacing: 1px;">${tempPassword}</p>
        </div>
        <div style="text-align: center; margin: 40px 0;">
          <a href="${config.appUrl}" style="background-color: #059669; color: white; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block;">
            Sign In Now
          </a>
        </div>
        <p style="font-size: 14px; color: #64748b; line-height: 20px;">
          For security, we recommend changing this temporary password immediately after your first login.
        </p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 40px 0;" />
        <p style="font-size: 12px; color: #94a3b8; text-align: center;">
          © 2026 VenusFlow Systems. All rights reserved.
        </p>
      </div>
    </div>
  `;

  return sendEmail({ to: email, subject, html });
}
