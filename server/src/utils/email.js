import nodemailer from "nodemailer";
import { config } from "../config.js";

/**
 * Creates a Nodemailer transporter configured for Gmail SMTP.
 * Note: Gmail requires an "App Password" to be used as EMAIL_PASS.
 */
const transporter = nodemailer.createTransport({
  host: config.mail.host, // smtp.gmail.com
  port: config.mail.port, // 587
  secure: false, // true for 465, false for other ports
  auth: {
    user: config.mail.user,
    pass: config.mail.pass,
  },
});

/**
 * Robust function to send an email.
 * @param {Object} options - { to, subject, html, text }
 * @returns {Promise<boolean>} - Returns true if sent successfully, false otherwise.
 */
export async function sendEmail({ to, subject, html, text }) {
  console.log(`[Email] Attempting to send email to: ${to} (Subject: "${subject}")`);

  try {
    const info = await transporter.sendMail({
      from: config.mail.from,
      to,
      subject,
      html,
      text,
    });

    console.log(`[Email] Success! Message sent. ID: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error("[Email] Critical delivery failure:");
    console.error(error); // Logs full error stack as requested
    return false;
  }
}

/**
 * Specifically sends a password reset email.
 * @returns {Promise<boolean>}
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
          <a href="${config.clientUrl}" style="background-color: #059669; color: white; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block;">
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

