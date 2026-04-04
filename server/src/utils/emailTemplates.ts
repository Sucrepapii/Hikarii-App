/**
 * Base email layout for Hikari system emails with vibrant styling.
 */
export const getBaseTemplate = (
  title: string,
  content: string,
  buttonText?: string,
  buttonUrl?: string,
  footerText?: string,
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

  const defaultFooter =
    "This email was sent to identify and secure your account.";

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
          <div class="header" style="text-align: center;">
            <div style="display: inline-flex; align-items: center; justify-content: center; gap: 12px;">
              <img src="${process.env.CLIENT_URL || 'https://www.hikarii.org'}/logo.png" width="45" height="45" alt="Hikari Logo" style="display: block; border: 0; outline: none; text-decoration: none;" />
              <div class="header-logo">HIKARI</div>
            </div>
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
            <p style="margin: 0;">${footerText || defaultFooter}</p>
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
    "You received this email because you have pending tasks in your Hikari workspace.",
  );
};

/**
 * Template for Contact Form submissions (Admin Notification).
 */
export const getContactFormTemplate = (
  firstName: string,
  lastName: string,
  email: string,
  subject: string,
  message: string,
) => {
  const content = `
    <p>You received a new message from the <strong>Hikari Contact Form</strong>.</p>
    
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 24px; border-radius: 16px; margin: 24px 0;">
      <p style="margin: 0 0 12px 0;"><strong>Name:</strong> ${firstName} ${lastName}</p>
      <p style="margin: 0 0 12px 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #6366f1;">${email}</a></p>
      <p style="margin: 0 0 12px 0;"><strong>Subject:</strong> ${subject}</p>
      <div style="margin-top: 16px; padding-top: 16px; border-top: 1px dashed #cbd5e1;">
        <p style="margin: 0 0 8px 0; font-size: 12px; text-transform: uppercase; color: #64748b; font-weight: 700;">Message:</p>
        <p style="margin: 0; white-space: pre-wrap; color: #334155;">${message}</p>
      </div>
    </div>
    
    <div style="text-align: center;">
      <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject)}" style="background: #1e293b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px; display: inline-block;">
        Reply to User
      </a>
    </div>
  `;

  return getBaseTemplate(
    `New Contact: ${subject}`,
    content,
    undefined,
    undefined,
    "This message was sent via the Hikari website contact form.",
  );
};

/**
 * Template for Contact Form Auto-Reply (User Confirmation).
 */
export const getContactAutoReplyTemplate = (firstName: string) => {
  const content = `
    <p>Hello <strong>${firstName}</strong>,</p>
    <p>Thanks for reaching out to Hikari! We've received your message and our team is reviewing it.</p>
    <p>We typically reply within 24-48 hours. In the meantime, you might find answers in our <a href="https://www.hikarii.org/help" style="color: #6366f1;">Help Center</a>.</p>
    
    <p>Talk soon,</p>
  `;

  return getBaseTemplate(
    "We received your message",
    content,
    "Visit Help Center",
    "https://www.hikarii.org/help",
    "You received this because you contacted Hikari Support.",
  );
};

/**
 * Template for Account Suspension notification.
 */
export const getSuspensionTemplate = (
  name: string,
  reason?: string,
  expires?: Date,
) => {
  const content = `
    <p>Hello <strong>${name}</strong>,</p>
    <p>Your Hikari account has been <strong style="color: #e11d48;">suspended</strong> due to a violation of our terms or suspicious activity.</p>
    
    <div style="background-color: #fff1f2; border: 1px solid #fecaca; padding: 24px; border-radius: 16px; margin: 24px 0;">
      <p style="margin: 0 0 12px 0;"><strong>Reason:</strong> ${reason || "Terms of Service Violation"}</p>
      ${expires ? `<p style="margin: 0;"><strong>Suspension Expires:</strong> ${expires.toLocaleDateString()}</p>` : '<p style="margin: 0;"><strong>Duration:</strong> Indefinite</p>'}
    </div>
    
    <p>While suspended, you will not be able to access your projects or financial data. If you believe this is a mistake, please contact our support team.</p>
  `;

  return getBaseTemplate(
    "Account Suspended",
    content,
    "Contact Support",
    "mailto:support@hikarii.org",
    "This is a mandatory security notification regarding your account status.",
  );
};

/**
 * Template for Account Reactivation notification.
 */
export const getReactivationTemplate = (name: string) => {
  const content = `
    <p>Hello <strong>${name}</strong>,</p>
    <p>Great news! Your Hikari account has been <strong style="color: #059669;">reactivated</strong>. You now have full access to all your features and data.</p>
    
    <p>We're glad to have you back. Shine bright!</p>
  `;

  return getBaseTemplate(
    "Account Reactivated",
    content,
    "Go to Dashboard",
    process.env.CLIENT_URL ||
      "https://checkmate-production-7067.up.railway.app/",
    "Welcome back to Hikari!",
  );
};
/**
 * Template for new Admin onboarding.
 */
export const getAdminOnboardingTemplate = (
  name: string,
  email: string,
  temporaryPassword: string,
) => {
  const loginUrl =
    process.env.CLIENT_URL ||
    "https://checkmate-production-7067.up.railway.app/";

  const content = `
    <p>Hello <strong>${name}</strong>,</p>
    <p>You have been added as an <strong>Administrator</strong> for the Hikari Platform. This role grants you access to manage users, view system analytics, and maintain platform health.</p>
    
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 24px; border-radius: 16px; margin: 24px 0;">
      <p style="margin: 0 0 12px 0;"><strong>Email:</strong> ${email}</p>
      <p style="margin: 0;"><strong>Temporary Password:</strong> <code style="background: #eef2ff; padding: 4px 8px; border-radius: 4px; color: #4338ca;">${temporaryPassword}</code></p>
    </div>
    
    <p>For security reasons, you will be <span class="highlight">required to change your password</span> upon your first login.</p>
    
    <p style="text-align: center; font-size: 14px; color: #94a3b8; margin-top: 8px;">If you were not expecting this invitation, please contact the system administrator immediately.</p>
  `;

  return getBaseTemplate(
    "Welcome to the Admin Team",
    content,
    "Login to Admin Console",
    loginUrl,
    "This is a mandatory administrative notification.",
  );
};

/**
 * Template for Lead Magnet (Hikari Method Notion Template).
 */
export const getLeadMagnetTemplate = (email: string) => {
  const content = `
    <p>Success! You're one step closer to radical clarity.</p>
    <p>As promised, here is your access to the <strong>Hikari Method Guide</strong>. This is the exact system we use to bridge the gap between tasks and finances.</p>
    
    <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 24px; border-radius: 16px; margin: 24px 0; text-align: center;">
      <h3 style="margin-top: 0; color: #166534; font-size: 18px; margin-bottom: 8px;">🎁 Your Hikari Method Guide is Ready</h3>
      <p style="color: #15803d; margin-bottom: 0;">Clarity. Focus. Freedom. The guide to mastering your life & money.</p>
    </div>
    
    <p><strong>Inside the guide:</strong></p>
    <ul style="color: #475569; line-height: 1.8;">
      <li><strong>Pillar 1: Clarity</strong> - How to visualize the chaos.</li>
      <li><strong>Pillar 2: Focus</strong> - The logic behind 15-minute block splitting.</li>
      <li><strong>Pillar 3: Freedom</strong> - Turning productivity into profit (ROI tracking).</li>
    </ul>
    
    <p>Once you've had a look, we'd love to hear how it helps your workflow!</p>
  `;

  const leadMagnetUrl =
    (process.env.CLIENT_URL ||
      "https://checkmate-production-7067.up.railway.app") +
    "/resources/HIKARI_METHOD_GUIDE.pdf";

  return getBaseTemplate(
    "Your Hikari Method Guide Inside!",
    content,
    "Read the Hikari Method Guide",
    leadMagnetUrl,
    "You received this because you requested the Hikari Method magnet on our website.",
  );
};
