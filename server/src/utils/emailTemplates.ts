/**
 * Base email layout for Hikari system emails.
 */
export const getBaseTemplate = (
  title: string,
  content: string,
  buttonText?: string,
  buttonUrl?: string,
) => {
  const buttonHtml =
    buttonText && buttonUrl
      ? `
      <div style="margin: 30px 0; text-align: center;">
        <a href="${buttonUrl}" style="background-color: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
          ${buttonText}
        </a>
      </div>`
      : "";

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #f8fafc; }
        .card { background-color: #ffffff; border-radius: 16px; padding: 40px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); border: 1px solid #e2e8f0; }
        .logo { margin-bottom: 24px; text-align: center; }
        .logo-text { font-size: 24px; font-weight: 800; color: #6366f1; letter-spacing: -0.025em; }
        h1 { font-size: 20px; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 16px; text-align: center; }
        p { margin-bottom: 16px; font-size: 16px; color: #475569; }
        .footer { margin-top: 32px; text-align: center; font-size: 12px; color: #94a3b8; }
        .otp-container { background-color: #f1f5f9; padding: 20px; border-radius: 12px; text-align: center; margin: 24px 0; border: 2px dashed #cbd5e1; }
        .otp-code { font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #0f172a; margin: 0; }
        .highlight { color: #6366f1; font-weight: 600; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="card">
          <div class="logo">
            <span class="logo-text">HIKARI</span>
          </div>
          <h1>${title}</h1>
          ${content}
          ${buttonHtml}
          <p style="margin-top: 32px; font-size: 14px; border-top: 1px solid #f1f5f9; pt-24px;">
            Best regards,<br>
            <strong>The Hikari Team</strong>
          </p>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} Hikari. All rights reserved.<br>
          This is an automated system message. Please do not reply directly.
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Template for email verification code.
 */
export const getVerificationTemplate = (name: string, otp: string) => {
  const content = `
    <p>Hello ${name},</p>
    <p>Welcome to Hikari! To get started with your account, please verify your email address using the secure code below.</p>
    <div class="otp-container">
      <p style="margin-bottom: 10px; font-size: 14px; color: #64748b; text-transform: uppercase; font-weight: 600;">Verification Code</p>
      <div class="otp-code">${otp}</div>
    </div>
    <p>For your security, this code will expire in <span class="highlight">1 hour</span>. If you did not create an account with Hikari, you can safely ignore this email.</p>
  `;
  return getBaseTemplate("Verify your email", content);
};

/**
 * Template for password reset code.
 */
export const getPasswordResetTemplate = (name: string, otp: string) => {
  const content = `
    <p>Hello ${name},</p>
    <p>We received a request to reset your password. Use the following code to proceed with the reset process:</p>
    <div class="otp-container">
      <p style="margin-bottom: 10px; font-size: 14px; color: #64748b; text-transform: uppercase; font-weight: 600;">Reset Code</p>
      <div class="otp-code">${otp}</div>
    </div>
    <p>This code is valid for <span class="highlight">15 minutes</span>. If you did not request a password reset, please ensure your account security or contact our support team.</p>
  `;
  return getBaseTemplate("Reset your password", content);
};

/**
 * Template for overdue task reminders.
 */
export const getOverdueReminderTemplate = (name: string, tasksHtml: string) => {
  const content = `
    <p>Hello ${name},</p>
    <p>You have pending items in your workspace that require immediate attention. Below is a summary of your overdue tasks:</p>
    <div style="background-color: #fff1f2; border: 1px solid #fecaca; padding: 20px; border-radius: 12px; margin: 24px 0;">
      <ul style="margin: 0; padding-left: 20px; color: #991b1b;">
        ${tasksHtml}
      </ul>
    </div>
    <p>Keeping your workspace up to date ensures your insights and recommendations remain accurate.</p>
  `;
  // Assuming the client URL is available in env or hardcoded for now as it's a demo
  const clientUrl = process.env.CLIENT_URL || "https://hikari-app.vercel.app";
  return getBaseTemplate(
    "Action Required: Overdue Tasks",
    content,
    "View Workspace",
    clientUrl,
  );
};
