/**
 * Base email layout for Hikari system emails with vibrant styling.
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
      <div style="margin: 32px 0; text-align: center;">
        <a href="${buttonUrl}" style="background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(99, 102, 241, 0.4);">
          ${buttonText}
        </a>
      </div>`
      : "";

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; color: #334155; margin: 0; padding: 0; background-color: #f1f5f9; }
        .wrapper { width: 100%; background-color: #f1f5f9; padding: 40px 0; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025); }
        .header { background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%); padding: 40px 20px; text-align: center; }
        .header-logo { color: #ffffff; font-size: 28px; font-weight: 800; letter-spacing: -0.05em; text-transform: uppercase; margin: 0; text-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .header-subtitle { color: rgba(255,255,255,0.9); font-size: 14px; font-weight: 500; margin-top: 8px; letter-spacing: 0.1em; text-transform: uppercase; }
        .content { padding: 40px 32px; }
        h1 { color: #0f172a; font-size: 24px; font-weight: 700; margin-top: 0; margin-bottom: 24px; text-align: center; letter-spacing: -0.025em; }
        p { margin-bottom: 16px; font-size: 16px; color: #475569; }
        .footer { padding: 32px; background-color: #f8fafc; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; }
        .otp-container { background: #eef2ff; padding: 24px; border-radius: 16px; text-align: center; margin: 32px 0; border: 2px dashed #818cf8; }
        .otp-label { color: #6366f1; font-weight: 600; text-transform: uppercase; font-size: 12px; letter-spacing: 0.1em; margin-bottom: 8px; }
        .otp-code { font-size: 36px; font-weight: 800; letter-spacing: 12px; color: #4338ca; margin: 0; font-family: monospace; }
        .highlight { color: #6366f1; font-weight: 700; }
        .divider { height: 1px; background-color: #e2e8f0; margin: 32px 0; }
        
        /* Mobile adjustments */
        @media screen and (max-width: 600px) {
          .content { padding: 32px 20px; }
          .otp-code { font-size: 28px; letter-spacing: 8px; }
        }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="container">
          <!-- Colorful Header -->
          <div class="header">
            <div class="header-logo">HIKARI</div>
            <div class="header-subtitle">Light & Clarity</div>
          </div>
          
          <!-- Main Content -->
          <div class="content">
            <h1>${title}</h1>
            ${content}
            ${buttonHtml}
            
            <div class="divider"></div>
            <p style="margin: 0; font-size: 14px; color: #64748b;">
              Shine bright,<br>
              <strong>The Hikari Team</strong>
            </p>
          </div>
          
          <!-- Footer -->
          <div class="footer">
            <p style="margin-bottom: 8px;">&copy; ${new Date().getFullYear()} Hikari App. All rights reserved.</p>
            <p style="margin: 0;">This email was sent to identify and secure your account.</p>
          </div>
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
    <p>Hello <strong>${name}</strong>,</p>
    <p>Welcome to <strong>Hikari</strong>! You are stepping into a world of clarity and productivity. To activate your account, please verify your email address.</p>
    
    <div class="otp-container">
      <div class="otp-label">Verification Code</div>
      <div class="otp-code">${otp}</div>
    </div>
    
    <p style="text-align: center; font-size: 14px; color: #64748b;">This secure code will expire in <span class="highlight">1 hour</span>.</p>
    <p style="text-align: center; font-size: 14px; color: #94a3b8; margin-top: 8px;">If you didn't create an account, you can safely ignore this email.</p>
  `;
  return getBaseTemplate("Verify Your Account", content);
};

/**
 * Template for password reset code.
 */
export const getPasswordResetTemplate = (name: string, otp: string) => {
  const content = `
    <p>Hello <strong>${name}</strong>,</p>
    <p>We received a request to reset the password for your Hikari account. No worries, we're here to help you get back on track.</p>
    
    <div class="otp-container" style="background-color: #fff1f2; border-color: #fda4af;">
      <div class="otp-label" style="color: #e11d48;">Password Reset Code</div>
      <div class="otp-code" style="color: #be123c;">${otp}</div>
    </div>
    
    <p style="text-align: center; font-size: 14px; color: #64748b;">This code is valid for <span class="highlight" style="color: #e11d48;">15 minutes</span>.</p>
    <p style="text-align: center; font-size: 14px; color: #94a3b8; margin-top: 8px;">If you didn't request this change, please secure your account immediately.</p>
  `;
  return getBaseTemplate("Reset Your Password", content);
};

/**
 * Template for overdue task reminders.
 */
export const getOverdueReminderTemplate = (name: string, tasksHtml: string) => {
  const content = `
    <p>Hello <strong>${name}</strong>,</p>
    <p>It looks like a few things have slipped through the cracks. We found pending items in your workspace that need your attention.</p>
    
    <div style="background-color: #fff1f2; border: 1px solid #fecaca; padding: 24px; border-radius: 16px; margin: 24px 0;">
      <h3 style="margin-top: 0; color: #991b1b; font-size: 16px; margin-bottom: 16px;">⚠️ Overdue Items</h3>
      <ul style="margin: 0; padding-left: 20px; color: #be123c; line-height: 1.8;">
        ${tasksHtml}
      </ul>
    </div>
    
    <p>Keeping your workspace clean helps the Hikari intelligence engine give you better insights!</p>
  `;

  const clientUrl =
    process.env.CLIENT_URL ||
    "https://checkmate-production-7067.up.railway.app/";

  return getBaseTemplate(
    "Action Required: Overdue Tasks",
    content,
    "Go to Workspace",
    clientUrl,
  );
};
