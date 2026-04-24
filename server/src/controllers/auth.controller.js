import { forgotPassword, resetPassword } from "../services/auth.service.js";
import { sendPasswordResetEmail } from "../utils/email.js";
import { asyncHandler } from "../utils/async-handler.js";
import { AppError } from "../utils/errors.js";
import { config } from "../config.js";

/**
 * Handles the forgot password request.
 */
export const forgotPasswordHandler = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new AppError(400, "Email is required");
  }

  // We await the service to verify the user and generate the token
  const { token, name } = await forgotPassword(email);

  // Generate the absolute reset URL
  const resetUrl = `${req.get("origin") || config.clientUrl}/reset-password?token=${token}`;

  await sendPasswordResetEmail(email, name, resetUrl);

  res.json({
    success: true,
    message: "If an account exists with this email, a reset link has been generated.",
  });
});


/**
 * Handles the password reset request.
 */
export const resetPasswordHandler = asyncHandler(async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    throw new AppError(400, "Token and password are required");
  }

  await resetPassword(token, password);

  res.json({
    success: true,
    message: "Password has been reset successfully. You can now log in.",
  });
});
