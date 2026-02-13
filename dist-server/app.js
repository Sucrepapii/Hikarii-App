var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/src/config/db.ts
import { PrismaClient } from "@prisma/client";
var prisma, db_default;
var init_db = __esm({
  "server/src/config/db.ts"() {
    prisma = new PrismaClient();
    db_default = prisma;
  }
});

// server/src/services/email.service.ts
import { Resend } from "resend";
import dotenv from "dotenv";
var sendEmail;
var init_email_service = __esm({
  "server/src/services/email.service.ts"() {
    dotenv.config();
    sendEmail = async (to, subject, html) => {
      try {
        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) {
          console.log("Skipping email: No RESEND_API_KEY provided.");
          return;
        }
        const resend = new Resend(apiKey);
        const emailDomain = process.env.EMAIL_DOMAIN || "hikarii.org";
        const fromEmail = `Hikari <noreply@${emailDomain}>`;
        const { data, error } = await resend.emails.send({
          from: fromEmail,
          to: [to],
          subject,
          html
        });
        if (error) {
          console.error("Resend API Error:", error);
          throw error;
        }
        console.log("Email sent successfully:", data);
        return data;
      } catch (error) {
        console.error("Error sending email:", error);
        throw error;
      }
    };
  }
});

// server/src/utils/emailTemplates.ts
var getBaseTemplate, getVerificationTemplate, getPasswordResetTemplate, getOverdueReminderTemplate, getContactFormTemplate, getContactAutoReplyTemplate, getSuspensionTemplate, getReactivationTemplate, getAdminOnboardingTemplate, getLeadMagnetTemplate;
var init_emailTemplates = __esm({
  "server/src/utils/emailTemplates.ts"() {
    getBaseTemplate = (title, content, buttonText, buttonUrl, footerText) => {
      const buttonHtml = buttonText && buttonUrl ? `
      <div style="margin: 32px 0; text-align: center;">
        <a href="${buttonUrl}" style="background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(99, 102, 241, 0.4);">
          ${buttonText}
        </a>
      </div>` : "";
      const defaultFooter = "This email was sent to identify and secure your account.";
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
            <p style="margin-bottom: 8px;">&copy; ${(/* @__PURE__ */ new Date()).getFullYear()} Hikari App. All rights reserved.</p>
            <p style="margin: 0;">${footerText || defaultFooter}</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
    };
    getVerificationTemplate = (name, otp) => {
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
    getPasswordResetTemplate = (name, otp) => {
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
    getOverdueReminderTemplate = (name, tasksHtml) => {
      const content = `
    <p>Hello <strong>${name}</strong>,</p>
    <p>It looks like a few things have slipped through the cracks. We found pending items in your workspace that need your attention.</p>
    
    <div style="background-color: #fff1f2; border: 1px solid #fecaca; padding: 24px; border-radius: 16px; margin: 24px 0;">
      <h3 style="margin-top: 0; color: #991b1b; font-size: 16px; margin-bottom: 16px;">\u26A0\uFE0F Overdue Items</h3>
      <ul style="margin: 0; padding-left: 20px; color: #be123c; line-height: 1.8;">
        ${tasksHtml}
      </ul>
    </div>
    
    <p>Keeping your workspace clean helps the Hikari intelligence engine give you better insights!</p>
  `;
      const clientUrl = process.env.CLIENT_URL || "https://checkmate-production-7067.up.railway.app/";
      return getBaseTemplate(
        "Action Required: Overdue Tasks",
        content,
        "Go to Workspace",
        clientUrl,
        "You received this email because you have pending tasks in your Hikari workspace."
      );
    };
    getContactFormTemplate = (firstName, lastName, email, subject, message) => {
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
        void 0,
        void 0,
        "This message was sent via the Hikari website contact form."
      );
    };
    getContactAutoReplyTemplate = (firstName) => {
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
        "You received this because you contacted Hikari Support."
      );
    };
    getSuspensionTemplate = (name, reason, expires) => {
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
        "This is a mandatory security notification regarding your account status."
      );
    };
    getReactivationTemplate = (name) => {
      const content = `
    <p>Hello <strong>${name}</strong>,</p>
    <p>Great news! Your Hikari account has been <strong style="color: #059669;">reactivated</strong>. You now have full access to all your features and data.</p>
    
    <p>We're glad to have you back. Shine bright!</p>
  `;
      return getBaseTemplate(
        "Account Reactivated",
        content,
        "Go to Dashboard",
        process.env.CLIENT_URL || "https://checkmate-production-7067.up.railway.app/",
        "Welcome back to Hikari!"
      );
    };
    getAdminOnboardingTemplate = (name, email, temporaryPassword) => {
      const loginUrl = process.env.CLIENT_URL || "https://checkmate-production-7067.up.railway.app/";
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
        "This is a mandatory administrative notification."
      );
    };
    getLeadMagnetTemplate = (email) => {
      const content = `
    <p>Success! You're one step closer to radical clarity.</p>
    <p>As promised, here is your access to the <strong>Hikari Method Notion Template</strong>. This is the exact system we use to bridge the gap between tasks and finances.</p>
    
    <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 24px; border-radius: 16px; margin: 24px 0; text-align: center;">
      <h3 style="margin-top: 0; color: #166534; font-size: 18px; margin-bottom: 8px;">\u{1F381} Your Lead Magnet is Ready</h3>
      <p style="color: #15803d; margin-bottom: 0;">The Hikari Method: Task-Budget Integration System</p>
    </div>
    
    <p><strong>What's inside:</strong></p>
    <ul style="color: #475569; line-height: 1.8;">
      <li>Custom Task-Expense Linking Database</li>
      <li>Monthly Financial Reflection Framework</li>
      <li>The "Smart Split" Project Planner</li>
    </ul>
    
    <p>Once you've had a look, we'd love to hear how it helps your workflow!</p>
  `;
      const templateStoreUrl = "https://www.notion.so/templates/hikari-method-task-budget-linking";
      return getBaseTemplate(
        "Your Hikari Method Template Inside!",
        content,
        "Download Notion Template",
        templateStoreUrl,
        "You received this because you requested the Hikari Method magnet on our website."
      );
    };
  }
});

// server/src/services/google.calendar.service.ts
var google_calendar_service_exports = {};
__export(google_calendar_service_exports, {
  createCalendarEvent: () => createCalendarEvent,
  exchangeCodeForToken: () => exchangeCodeForToken,
  getAuthUrl: () => getAuthUrl,
  syncTaskBlocks: () => syncTaskBlocks
});
import { google } from "googleapis";
import fs from "fs";
import path from "path";
var logToFile, oauth2Client, SCOPES, exchangeCodeForToken, createCalendarEvent, syncTaskBlocks, getAuthUrl;
var init_google_calendar_service = __esm({
  "server/src/services/google.calendar.service.ts"() {
    init_db();
    logToFile = (message, data) => {
      console.log(`[DEBUG] ${message}`, data ? JSON.stringify(data, null, 2) : "");
      try {
        const logPath = path.join(process.cwd(), "debug.log");
        const timestamp = (/* @__PURE__ */ new Date()).toISOString();
        const logEntry = `[${timestamp}] ${message} ${data ? JSON.stringify(data, null, 2) : ""}
`;
        fs.appendFileSync(logPath, logEntry);
      } catch (e) {
        console.error("Failed to write to debug.log", e);
      }
    };
    oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      "postmessage"
      // For React One-Tap/Popup flow which handles redirect differently
    );
    SCOPES = [
      "https://www.googleapis.com/auth/calendar",
      "https://www.googleapis.com/auth/calendar.events",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile"
    ];
    exchangeCodeForToken = async (userId, code) => {
      try {
        logToFile("CWD:", process.cwd());
        logToFile("Exchanging code for token");
        logToFile(
          "Client ID prefix:",
          process.env.GOOGLE_CLIENT_ID?.substring(0, 10)
        );
        logToFile("Redirect URI (Configured):", oauth2Client.redirectUri);
        logToFile("Redirect URI (Internal):", oauth2Client._redirectUri);
        const { tokens } = await oauth2Client.getToken(code);
        const updatedUser = await db_default.user.update({
          where: { id: userId },
          data: {
            googleAccessToken: tokens.access_token,
            googleRefreshToken: tokens.refresh_token
            // Only returned on first consent
          }
        });
        return updatedUser;
      } catch (error) {
        const errorDetails = error.response?.data || error.message;
        logToFile("Error exchanging code:", errorDetails);
        console.error("Error exchanging code for token details:", errorDetails);
        throw new Error(
          `Google Auth Failed: ${error.response?.data?.error || error.message}`
        );
      }
    };
    createCalendarEvent = async (userId, task) => {
      try {
        const user = await db_default.user.findUnique({ where: { id: userId } });
        if (!user?.googleAccessToken) {
          console.log("No Google Access Token for user", userId);
          return null;
        }
        oauth2Client.setCredentials({
          access_token: user.googleAccessToken,
          refresh_token: user.googleRefreshToken
        });
        const calendar = google.calendar({ version: "v3", auth: oauth2Client });
        const event = {
          summary: task.title,
          description: task.description || "",
          start: {
            dateTime: (/* @__PURE__ */ new Date()).toISOString(),
            // Default to now if no due date, logic can be improved
            timeZone: "UTC"
            // Use user's timezone if available
          },
          end: {
            dateTime: new Date((/* @__PURE__ */ new Date()).getTime() + 60 * 60 * 1e3).toISOString(),
            // +1 hour default
            timeZone: "UTC"
          },
          // If task has specific due date:
          ...task.dueDate && {
            start: {
              dateTime: new Date(task.dueDate).toISOString(),
              timeZone: "UTC"
            },
            end: {
              // Use estimated duration if available, otherwise default to 1 hour
              dateTime: new Date(
                new Date(task.dueDate).getTime() + (task.estimatedDuration ? task.estimatedDuration * 6e4 : 60 * 60 * 1e3)
              ).toISOString(),
              timeZone: "UTC"
            }
          },
          reminders: {
            useDefault: true
          }
        };
        const response = await calendar.events.insert({
          calendarId: "primary",
          requestBody: event
        });
        return response.data;
      } catch (error) {
        console.error("Error creating calendar event:", error);
        return null;
      }
    };
    syncTaskBlocks = async (userId, taskId, blocks) => {
      try {
        const user = await db_default.user.findUnique({ where: { id: userId } });
        if (!user?.googleAccessToken) return null;
        oauth2Client.setCredentials({
          access_token: user.googleAccessToken,
          refresh_token: user.googleRefreshToken
        });
        const calendar = google.calendar({ version: "v3", auth: oauth2Client });
        const parentTask = await db_default.task.findUnique({
          where: { id: taskId },
          select: { title: true, dueDate: true }
        });
        const parentTitle = parentTask?.title || "Task";
        let startDate = /* @__PURE__ */ new Date();
        if (parentTask?.dueDate) {
          startDate = new Date(parentTask.dueDate);
        } else {
          startDate.setDate(startDate.getDate() + 1);
        }
        startDate.setHours(9, 0, 0, 0);
        let currentStartTime = startDate;
        const results = [];
        for (const block of blocks) {
          if (!block.duration) continue;
          const endTime = new Date(
            currentStartTime.getTime() + block.duration * 6e4
          );
          const event = {
            summary: `[${parentTitle}] ${block.title}`,
            // e.g. "[Write Essay] Research"
            description: `Block ${block.order + 1} of task: ${parentTitle}`,
            colorId: "5",
            // "5" is Banana (Yellow) in Google Calendar standard colors
            start: {
              dateTime: currentStartTime.toISOString(),
              timeZone: "UTC"
              // or user timezone
            },
            end: {
              dateTime: endTime.toISOString(),
              timeZone: "UTC"
            }
          };
          try {
            const response = await calendar.events.insert({
              calendarId: "primary",
              requestBody: event
            });
            results.push({ blockId: block.id, googleEventId: response.data.id });
            currentStartTime = new Date(endTime.getTime() + 5 * 6e4);
          } catch (err) {
            console.error("Failed to sync block", block.title, err);
          }
        }
        return results;
      } catch (error) {
        console.error("Batch sync failed", error);
        throw error;
      }
    };
    getAuthUrl = () => {
      return oauth2Client.generateAuthUrl({
        access_type: "offline",
        // Essential for refresh token
        scope: SCOPES,
        prompt: "consent"
        // Force consent to get refresh token
      });
    };
  }
});

// server/src/services/task.splitter.service.ts
var task_splitter_service_exports = {};
__export(task_splitter_service_exports, {
  TaskSplitterService: () => TaskSplitterService,
  taskSplitterService: () => taskSplitterService
});
import { GoogleGenerativeAI } from "@google/generative-ai";
var TEMPLATES, DEFAULT_TEMPLATE, TaskSplitterService, taskSplitterService;
var init_task_splitter_service = __esm({
  "server/src/services/task.splitter.service.ts"() {
    TEMPLATES = [
      {
        keywords: ["write", "draft", "essay", "report", "blog", "article", "paper"],
        blocks: [
          { title: "Research & Notes", weight: 0.25 },
          { title: "Outline Structure", weight: 0.15 },
          { title: "Drafting", weight: 0.4 },
          { title: "Review & Polish", weight: 0.2 }
        ]
      },
      {
        keywords: ["study", "learn", "read", "prepare for exam", "course"],
        blocks: [
          { title: "Review Materials", weight: 0.3 },
          { title: "Practice / Exercises", weight: 0.4 },
          { title: "Summarize Key Points", weight: 0.3 }
        ]
      },
      {
        keywords: [
          "build",
          "code",
          "develop",
          "implement",
          "program",
          "fix",
          "debug"
        ],
        blocks: [
          { title: "Design & Plan", weight: 0.2 },
          { title: "Implementation", weight: 0.5 },
          { title: "Testing & Validation", weight: 0.3 }
        ]
      },
      {
        keywords: ["plan", "organize", "schedule"],
        blocks: [
          { title: "Brainstorming", weight: 0.3 },
          { title: "Categorization", weight: 0.3 },
          { title: "Finalizing Plan", weight: 0.4 }
        ]
      }
    ];
    DEFAULT_TEMPLATE = {
      blocks: [
        { title: "Preparation", weight: 0.1 },
        { title: "Core Work", weight: 0.8 },
        { title: "Wrap-up & Review", weight: 0.1 }
      ]
    };
    TaskSplitterService = class {
      constructor() {
        this.genAI = null;
        this.model = null;
        this.isInitialized = false;
      }
      initialize() {
        if (this.isInitialized) return;
        if (!process.env.GEMINI_API_KEY) {
          try {
            const dotenv3 = __require("dotenv");
            dotenv3.config();
          } catch (e) {
          }
        }
        const apiKey = process.env.GEMINI_API_KEY;
        console.log(
          `[TaskSplitter] Initialize called. API Key present in env: ${!!apiKey}`
        );
        console.log(`[TaskSplitter] Current working directory: ${process.cwd()}`);
        if (apiKey) {
          try {
            this.genAI = new GoogleGenerativeAI(apiKey);
            this.model = this.genAI.getGenerativeModel({
              model: "gemini-flash-latest",
              generationConfig: { responseMimeType: "application/json" }
            });
            console.log("[TaskSplitter] Gemini model initialized successfully.");
          } catch (error) {
            console.error("Failed to initialize Gemini AI:", error);
          }
        } else {
          console.warn("[TaskSplitter] No API Key provided. AI features disabled.");
        }
        this.isInitialized = true;
      }
      /**
       * Analyzes a task title/description and suggests blocks.
       * Assume 60 minutes default if no duration capable logic yet.
       * In a real app, we might ask user for "Total Duration" first.
       */
      async suggestBlocks(title, totalDurationMinutes = 60) {
        this.initialize();
        if (this.model) {
          try {
            console.log(`[TaskSplitter] Attempting AI split for: "${title}"`);
            const prompt = `
          You are a productivity expert. Break down the task "${title}" into 3-5 subtasks (blocks) that fit within a total of ${totalDurationMinutes} minutes.
          
          CRITICAL INSTRUCTION:
          - The titles MUST be specific to the task content ("${title}").
          - Do NOT use generic titles like "Preparation", "Core Work", "Execution", or "Review".
          - Instead, use specific actions like "Research flight prices", "Draft introduction", "Debug authentication logic", etc.
          - Make it obvious that these suggestions were generated specifically for this task.

          Return a JSON ARRAY. Schema:
          Array<{ title: string, duration: number }>
          
          Example:
          [
            { "title": "Research destination safety", "duration": 15 },
            { "title": "Compare flight costs", "duration": 30 },
            { "title": "Book hotel", "duration": 15 }
          ]
          
          The sum of durations should equal exactly ${totalDurationMinutes}.
        `;
            const result = await this.model.generateContent(prompt);
            let responseText = result.response.text();
            console.log("[TaskSplitter] Raw AI Response:", responseText);
            responseText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
            const aiBlocks = JSON.parse(responseText);
            if (Array.isArray(aiBlocks) && aiBlocks.length > 0) {
              console.log(
                "[TaskSplitter] AI parsed valid blocks:",
                aiBlocks.length
              );
              return aiBlocks.map((block, index) => ({
                title: block.title,
                duration: Number(block.duration),
                order: index
              }));
            } else {
              console.warn("[TaskSplitter] AI response was not a valid array.");
            }
          } catch (error) {
            console.error(
              "!!! [TaskSplitter] AI generation FAILED !!!",
              error?.message,
              error?.stack
            );
          }
        } else {
          console.log(
            "[TaskSplitter] Skipping AI (Model not initialized). Keys present:",
            !!process.env.GEMINI_API_KEY
          );
        }
        const normalizedTitle = title.toLowerCase();
        const template = TEMPLATES.find(
          (t) => t.keywords.some((k) => normalizedTitle.includes(k))
        );
        const blocksToUse = template ? template.blocks : DEFAULT_TEMPLATE.blocks;
        let topic = "";
        if (template) {
          const matchedKeyword = template.keywords.find(
            (k) => normalizedTitle.includes(k)
          );
          if (matchedKeyword) {
            const parts = normalizedTitle.split(matchedKeyword);
            if (parts.length > 1) {
              topic = parts.slice(1).join(matchedKeyword).trim();
              const prepositions = ["about", "a", "an", "the", "for", "on"];
              for (const prep of prepositions) {
                if (topic.startsWith(prep + " ")) {
                  topic = topic.substring(prep.length + 1).trim();
                }
              }
            }
          }
        }
        const formattedTopic = topic.length > 0 ? topic.charAt(0).toUpperCase() + topic.slice(1) : "";
        return blocksToUse.map((block, index) => {
          let blockTitle = block.title;
          if (formattedTopic) {
            if (blockTitle.includes("Review") || blockTitle.includes("Drafting") || blockTitle.includes("Research")) {
              blockTitle = `${blockTitle} ${formattedTopic}`;
            } else if (blockTitle === "Implementation" || blockTitle === "Design & Plan") {
              blockTitle = `${blockTitle} for ${formattedTopic}`;
            }
          }
          return {
            title: blockTitle,
            duration: Math.round(totalDurationMinutes * block.weight),
            order: index
          };
        });
      }
    };
    taskSplitterService = new TaskSplitterService();
  }
});

// server/src/services/whatsapp.service.ts
import twilio from "twilio";
import dotenv2 from "dotenv";
var accountSid, authToken, fromNumber, sendWhatsAppMessage;
var init_whatsapp_service = __esm({
  "server/src/services/whatsapp.service.ts"() {
    dotenv2.config();
    accountSid = process.env.TWILIO_ACCOUNT_SID;
    authToken = process.env.TWILIO_AUTH_TOKEN;
    fromNumber = process.env.TWILIO_WHATSAPP_FROM || "whatsapp:+14155238886";
    sendWhatsAppMessage = async (to, message) => {
      try {
        if (!accountSid || !authToken) {
          console.log("Skipping WhatsApp: No TWILIO credentials provided.");
          return;
        }
        const client = twilio(accountSid, authToken);
        const formattedTo = to.startsWith("whatsapp:") ? to : `whatsapp:${to}`;
        const response = await client.messages.create({
          from: fromNumber,
          body: message,
          to: formattedTo
        });
        console.log("WhatsApp message sent successfully:", response.sid);
        return response;
      } catch (error) {
        console.error("Error sending WhatsApp message:", error);
        throw error;
      }
    };
  }
});

// server/src/jobs/reminder.job.ts
var reminder_job_exports = {};
__export(reminder_job_exports, {
  startReminderJob: () => startReminderJob
});
import cron from "node-cron";
var startReminderJob;
var init_reminder_job = __esm({
  "server/src/jobs/reminder.job.ts"() {
    init_db();
    init_email_service();
    init_whatsapp_service();
    init_emailTemplates();
    startReminderJob = () => {
      if (process.env.VERCEL) {
        console.log(
          "Cron jobs are not supported on Vercel Serverless. Skipping..."
        );
        return;
      }
      cron.schedule("0 9 * * *", async () => {
        console.log("Running daily reminder job...");
        try {
          const users = await db_default.user.findMany({});
          const today = /* @__PURE__ */ new Date();
          today.setHours(0, 0, 0, 0);
          for (const user of users) {
            const overdueTasks = await db_default.task.findMany({
              where: {
                userId: user.id,
                status: { not: "COMPLETED" },
                // Prisma enum string matching
                dueDate: { lt: today }
              }
            });
            if (overdueTasks.length > 0) {
              const taskListHtml = overdueTasks.map(
                (t) => `<li><strong>${t.title}</strong> (Due: ${t.dueDate ? new Date(t.dueDate).toLocaleDateString() : "No date"})</li>`
              ).join("");
              await sendEmail(
                user.email,
                `Action Required: ${overdueTasks.length} Overdue Tasks on Hikari`,
                getOverdueReminderTemplate(user.name, taskListHtml)
              );
              if (user.waTasksEnabled && user.phoneNumber) {
                const taskList = overdueTasks.map(
                  (t) => `- ${t.title} (Due: ${t.dueDate ? new Date(t.dueDate).toLocaleDateString() : "No date"})`
                ).join("\n");
                await sendWhatsAppMessage(
                  user.phoneNumber,
                  `Hi ${user.name}, you have ${overdueTasks.length} overdue tasks:
${taskList}`
                );
              }
            }
            if (user.waBudgetEnabled && user.phoneNumber) {
              const budgets = await db_default.budget.findMany({
                where: { userId: user.id }
              });
              for (const budget of budgets) {
                if (budget.spent >= budget.limit) {
                  await sendWhatsAppMessage(
                    user.phoneNumber,
                    `Budget Alert! You have reached your limit for ${budget.category}: Spent ${budget.spent}/${budget.limit}`
                  );
                }
              }
            }
            if (user.waProjectsEnabled && user.phoneNumber) {
              const overdueProjects = await db_default.project.findMany({
                where: {
                  userId: user.id,
                  status: "ACTIVE",
                  endDate: { lt: today }
                }
              });
              if (overdueProjects.length > 0) {
                const projectList = overdueProjects.map(
                  (p) => `- ${p.title} (Ended: ${new Date(p.endDate).toLocaleDateString()})`
                ).join("\n");
                await sendWhatsAppMessage(
                  user.phoneNumber,
                  `Project Alert! The following projects have passed their end date:
${projectList}`
                );
              }
            }
          }
        } catch (error) {
          console.error("Error in reminder job:", error);
        }
      });
    };
  }
});

// server/src/app.ts
import "dotenv/config";
import express4 from "express";
import cors from "cors";
import path2 from "path";
import fs2 from "fs";

// server/src/routes/auth.routes.ts
import { Router } from "express";

// server/src/controllers/auth.controller.ts
init_db();

// server/src/utils/jwt.ts
import jwt from "jsonwebtoken";
var JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key";
var JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
var generateToken = (payload) => {
  const options = {
    expiresIn: JWT_EXPIRES_IN
  };
  return jwt.sign(payload, JWT_SECRET, options);
};
var verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};

// server/src/controllers/auth.controller.ts
init_email_service();
init_emailTemplates();
var generateOTP = () => Math.floor(1e5 + Math.random() * 9e5).toString();
var signup = async (req, res) => {
  console.log("Signup request received for:", req.body?.email);
  try {
    const { name, email, password, phoneNumber } = req.body;
    if (!name || !email || !password) {
      console.log("Missing fields in signup request");
      res.status(400).json({ error: "Name, email, and password are required" });
      return;
    }
    console.log("Finding existing user...");
    const existingUser = await db_default.user.findUnique({ where: { email } });
    if (existingUser) {
      console.log("User already exists:", email);
      res.status(400).json({ error: "User already exists with this email" });
      return;
    }
    console.log("Creating new user...");
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 60 * 60 * 1e3);
    const bcrypt2 = await import("bcryptjs");
    const salt = await bcrypt2.default.genSalt(10);
    const hashedPassword = await bcrypt2.default.hash(password, salt);
    const user = await db_default.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        isVerified: false,
        verificationToken: otp,
        verificationTokenExpires: otpExpires,
        phoneNumber: phoneNumber || null
      }
    });
    try {
      await sendEmail(
        email,
        "Verify your Hikari Account",
        getVerificationTemplate(name, otp)
      );
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
    }
    res.status(201).json({
      message: "Registration successful. Please check your email for a verification code.",
      email: user.email,
      requiresVerification: true
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
var login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await db_default.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    if (!user.isVerified) {
      res.status(403).json({
        error: "Account not verified. Please verify your email.",
        requiresVerification: true,
        email: user.email
      });
      return;
    }
    if (user.isSuspended) {
      if (user.suspensionExpires && user.suspensionExpires < /* @__PURE__ */ new Date()) {
        await db_default.user.update({
          where: { id: user.id },
          data: {
            isSuspended: false,
            suspensionReason: null,
            suspensionExpires: null
          }
        });
      } else {
        res.status(403).json({
          error: `Account suspended. Reason: ${user.suspensionReason || "No reason provided"}`,
          isSuspended: true,
          expiresAt: user.suspensionExpires
        });
        return;
      }
    }
    if (user.password !== password) {
    }
    const bcrypt2 = await import("bcryptjs");
    const isMatch = await bcrypt2.default.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    const token = generateToken({
      userId: user.id,
      email: user.email
    });
    await db_default.user.update({
      where: { id: user.id },
      data: { lastLoginAt: /* @__PURE__ */ new Date() }
    });
    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        subscriptionStatus: user.subscriptionStatus,
        stripeCustomerId: user.stripeCustomerId,
        currentPeriodEnd: user.currentPeriodEnd,
        requiresPasswordChange: user.requiresPasswordChange
      },
      token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
var verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;
    const user = await db_default.user.findUnique({ where: { email } });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    if (user.isVerified) {
      res.status(400).json({ error: "User already verified. Please login." });
      return;
    }
    if (user.verificationToken !== code) {
      res.status(400).json({ error: "Invalid verification code" });
      return;
    }
    if (!user.verificationTokenExpires || user.verificationTokenExpires < /* @__PURE__ */ new Date()) {
      res.status(400).json({
        error: "Verification code expired. Please request a new one."
      });
      return;
    }
    await db_default.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationToken: null,
        verificationTokenExpires: null
      }
    });
    const token = generateToken({
      userId: user.id,
      email: user.email
    });
    res.json({
      message: "Email verified successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        subscriptionStatus: user.subscriptionStatus,
        stripeCustomerId: user.stripeCustomerId,
        currentPeriodEnd: user.currentPeriodEnd,
        requiresPasswordChange: user.requiresPasswordChange
      },
      token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
var resendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await db_default.user.findUnique({ where: { email } });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    if (user.isVerified) {
      res.status(400).json({ error: "User already verified" });
      return;
    }
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 60 * 60 * 1e3);
    await db_default.user.update({
      where: { id: user.id },
      data: {
        verificationToken: otp,
        verificationTokenExpires: otpExpires
      }
    });
    await sendEmail(
      email,
      "Resend: Verify your Hikari Account",
      getVerificationTemplate(user.name, otp)
    );
    res.json({ message: "Verification code resent" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
var getMe = async (req, res) => {
  try {
    const user = await db_default.user.findUnique({ where: { id: req.userId } });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        subscriptionStatus: user.subscriptionStatus,
        stripeCustomerId: user.stripeCustomerId,
        currentPeriodEnd: user.currentPeriodEnd,
        phoneNumber: user.phoneNumber,
        waTasksEnabled: user.waTasksEnabled,
        waBudgetEnabled: user.waBudgetEnabled,
        waProjectsEnabled: user.waProjectsEnabled,
        requiresPasswordChange: user.requiresPasswordChange
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
var forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ error: "Email is required" });
      return;
    }
    const user = await db_default.user.findUnique({ where: { email } });
    if (!user) {
      console.log("Forgot password attempt for non-existent email:", email);
      res.json({
        message: "If an account exists with that email, a reset code has been sent."
      });
      return;
    }
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 15 * 60 * 1e3);
    await db_default.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: otp,
        resetPasswordExpires: otpExpires
      }
    });
    try {
      await sendEmail(
        email,
        "Reset your Hikari Password",
        getPasswordResetTemplate(user.name, otp)
      );
    } catch (emailError) {
      console.error("Failed to send reset email:", emailError);
    }
    res.json({
      message: "If an account exists with that email, a reset code has been sent."
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
var resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    if (!email || !code || !newPassword) {
      res.status(400).json({ error: "Email, code, and new password are required" });
      return;
    }
    const user = await db_default.user.findUnique({ where: { email } });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    if (user.resetPasswordToken !== code) {
      res.status(400).json({ error: "Invalid or expired reset code" });
      return;
    }
    if (!user.resetPasswordExpires || user.resetPasswordExpires < /* @__PURE__ */ new Date()) {
      res.status(400).json({ error: "Reset code has expired" });
      return;
    }
    const bcrypt2 = await import("bcryptjs");
    const salt = await bcrypt2.default.genSalt(10);
    const hashedPassword = await bcrypt2.default.hash(newPassword, salt);
    await db_default.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
        isVerified: true
        // Resetting password counts as verification if they were stuck
      }
    });
    res.json({ message: "Password reset successful. You can now login." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
var updateProfile = async (req, res) => {
  try {
    const {
      name,
      phoneNumber,
      waTasksEnabled,
      waBudgetEnabled,
      waProjectsEnabled
    } = req.body;
    const data = {};
    if (name) data.name = name;
    if (phoneNumber !== void 0) data.phoneNumber = phoneNumber;
    if (waTasksEnabled !== void 0) data.waTasksEnabled = waTasksEnabled;
    if (waBudgetEnabled !== void 0) data.waBudgetEnabled = waBudgetEnabled;
    if (waProjectsEnabled !== void 0)
      data.waProjectsEnabled = waProjectsEnabled;
    const user = await db_default.user.update({
      where: { id: req.userId },
      data
    });
    res.json({
      message: "Profile updated successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        subscriptionStatus: user.subscriptionStatus,
        stripeCustomerId: user.stripeCustomerId,
        currentPeriodEnd: user.currentPeriodEnd,
        phoneNumber: user.phoneNumber,
        waTasksEnabled: user.waTasksEnabled,
        waBudgetEnabled: user.waBudgetEnabled,
        waProjectsEnabled: user.waProjectsEnabled,
        requiresPasswordChange: user.requiresPasswordChange
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
var changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      res.status(400).json({ error: "Current and new password are required" });
      return;
    }
    const user = await db_default.user.findUnique({ where: { id: req.userId } });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    const bcrypt2 = await import("bcryptjs");
    const isMatch = await bcrypt2.default.compare(
      currentPassword,
      user.password
    );
    if (!isMatch) {
      res.status(400).json({ error: "Incorrect current password" });
      return;
    }
    const salt = await bcrypt2.default.genSalt(10);
    const hashedPassword = await bcrypt2.default.hash(newPassword, salt);
    await db_default.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        requiresPasswordChange: false
      }
    });
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
var debugInfo = async (_req, res) => {
  res.json({
    env: {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: process.env.VERCEL,
      HAS_DATABASE_URL: !!process.env.DATABASE_URL,
      HAS_JWT_SECRET: !!process.env.JWT_SECRET,
      HAS_RESEND_KEY: !!process.env.RESEND_API_KEY,
      CLIENT_URL: process.env.CLIENT_URL
    },
    dbStatus: "connected"
    // Prisma manages connection pool
  });
};

// server/src/middleware/auth.middleware.ts
init_db();
var authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      res.status(401).json({ error: "No token provided" });
      return;
    }
    const decoded = verifyToken(token);
    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    const user = await db_default.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        subscriptionStatus: true,
        stripeCustomerId: true,
        isSuspended: true
      }
    });
    if (!user) {
      res.status(401).json({ error: "User not found" });
      return;
    }
    if (user.isSuspended) {
      res.status(403).json({ error: "Your account is suspended. Please contact support." });
      return;
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

// server/src/routes/auth.routes.ts
var router = Router();
router.post("/signup", signup);
router.post("/login", login);
router.post("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerification);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.put("/profile", authenticate, updateProfile);
router.post("/change-password", authenticate, changePassword);
router.get("/me", authenticate, getMe);
router.get("/debug", debugInfo);
var auth_routes_default = router;

// server/src/routes/task.routes.ts
import { Router as Router2 } from "express";

// server/src/controllers/task.controller.ts
init_db();
init_google_calendar_service();
var getTasks = async (req, res) => {
  try {
    const tasks = await db_default.task.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: "desc" }
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
var createTask = async (req, res) => {
  try {
    const { addToCalendar, ...rest } = req.body;
    const task = await db_default.task.create({
      data: {
        ...rest,
        userId: req.userId,
        projectId: rest.projectId || null
      }
    });
    if (addToCalendar && task.dueDate) {
      try {
        await createCalendarEvent(req.userId, task);
      } catch (err) {
        console.error("Failed to sync to calendar during creation", err);
      }
    }
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
var getTaskById = async (req, res) => {
  try {
    const task = await db_default.task.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId
      }
    });
    if (!task) {
      res.status(404).json({ error: "Task not found" });
      return;
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
var updateTask = async (req, res) => {
  try {
    const existingTask = await db_default.task.findFirst({
      where: { id: req.params.id, userId: req.userId }
    });
    if (!existingTask) {
      res.status(404).json({ error: "Task not found" });
      return;
    }
    const task = await db_default.task.update({
      where: { id: req.params.id },
      data: {
        ...req.body,
        projectId: req.body.projectId || (req.body.projectId === "" ? null : void 0)
      }
    });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
var deleteTask = async (req, res) => {
  try {
    const existingTask = await db_default.task.findFirst({
      where: { id: req.params.id, userId: req.userId }
    });
    if (!existingTask) {
      res.status(404).json({ error: "Task not found" });
      return;
    }
    await db_default.task.delete({
      where: { id: req.params.id }
    });
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
var toggleTaskStatus = async (req, res) => {
  try {
    const task = await db_default.task.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId
      }
    });
    if (!task) {
      res.status(404).json({ error: "Task not found" });
      return;
    }
    const newStatus = task.status === "COMPLETED" /* COMPLETED */ ? "TODO" /* TODO */ : "COMPLETED" /* COMPLETED */;
    const updatedTask = await db_default.task.update({
      where: { id: task.id },
      data: { status: newStatus }
    });
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
var analyzeTaskSplit = async (req, res) => {
  try {
    const { id } = req.params;
    const { force } = req.body;
    const task = await db_default.task.findFirst({
      where: { id, userId: req.userId },
      include: { blocks: true }
    });
    if (!task) {
      res.status(404).json({ error: "Task not found" });
      return;
    }
    if (task.blocks && task.blocks.length > 0) {
      if (!force) {
        res.json({ blocks: task.blocks, message: "Blocks already exist" });
        return;
      }
      await db_default.taskBlock.deleteMany({
        where: { taskId: task.id }
      });
    }
    const { taskSplitterService: taskSplitterService2 } = await Promise.resolve().then(() => (init_task_splitter_service(), task_splitter_service_exports));
    const suggestions = await taskSplitterService2.suggestBlocks(task.title);
    const createdBlocks = await db_default.$transaction(
      suggestions.map(
        (block) => db_default.taskBlock.create({
          data: {
            title: block.title,
            duration: block.duration,
            order: block.order,
            taskId: task.id
          }
        })
      )
    );
    res.json({
      blocks: createdBlocks,
      message: "Blocks generated successfully"
    });
  } catch (error) {
    console.error("Split analysis failed:", error);
    res.status(500).json({ error: error.message || "Failed to analyze task" });
  }
};
var scheduleBlocks = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await db_default.task.findUnique({
      where: { id, userId: req.userId },
      include: { blocks: true }
    });
    if (!task || !task.blocks || task.blocks.length === 0) {
      res.status(404).json({ error: "Task or blocks not found" });
      return;
    }
    const { syncTaskBlocks: syncTaskBlocks2 } = await Promise.resolve().then(() => (init_google_calendar_service(), google_calendar_service_exports));
    const results = await syncTaskBlocks2(
      req.userId,
      id,
      task.blocks
    );
    if (!results) {
      res.status(400).json({ error: "Calendar sync failed. Is Google Calendar connected?" });
      return;
    }
    if (results && results.length > 0) {
      await db_default.$transaction(
        results.map(
          (r) => db_default.taskBlock.update({
            where: { id: r.blockId },
            data: { googleEventId: r.googleEventId }
          })
        )
      );
    }
    res.json({ message: "Blocks scheduled", results });
  } catch (error) {
    console.error("Scheduling failed:", error);
    res.status(500).json({ error: error.message || "Failed to schedule blocks" });
  }
};

// server/src/routes/task.routes.ts
var router2 = Router2();
router2.use(authenticate);
router2.get("/", getTasks);
router2.post("/", createTask);
router2.get("/:id", getTaskById);
router2.put("/:id", updateTask);
router2.delete("/:id", deleteTask);
router2.patch("/:id/toggle", toggleTaskStatus);
router2.post("/:id/analyze-split", analyzeTaskSplit);
router2.post("/:id/schedule-blocks", scheduleBlocks);
var task_routes_default = router2;

// server/src/routes/project.routes.ts
import express from "express";

// server/src/controllers/project.controller.ts
init_db();
var createProject = async (req, res) => {
  try {
    const { title, description, startDate, endDate, budgetLimit } = req.body;
    const project = await db_default.project.create({
      data: {
        title,
        description,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        budgetLimit: budgetLimit ? parseFloat(budgetLimit) : null,
        userId: req.userId
      }
    });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
var getProjects = async (req, res) => {
  try {
    console.log("Fetching projects for user:", req.userId);
    const projects = await db_default.project.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: "desc" },
      include: {
        tasks: {
          select: { status: true }
        }
      }
    });
    const projectsWithProgress = projects.map((project) => {
      const totalTasks = project.tasks.length;
      const completedTasks = project.tasks.filter(
        (t) => t.status === "COMPLETED"
      ).length;
      const progress = totalTasks > 0 ? completedTasks / totalTasks * 100 : 0;
      return {
        ...project,
        progress: Math.round(progress)
        // specific cleanup if we don't want to send all tasks back, though select: {status} is small
      };
    });
    console.log("Found projects:", projectsWithProgress.length);
    res.json(projectsWithProgress);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ error: error.message });
  }
};
var getProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await db_default.project.findUnique({
      where: { id, userId: req.userId },
      include: {
        tasks: true,
        budgets: true,
        expenses: {
          orderBy: { date: "desc" },
          take: 10
        }
      }
    });
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
var updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, budgetLimit, startDate, endDate } = req.body;
    const project = await db_default.project.update({
      where: { id, userId: req.userId },
      data: {
        title,
        description,
        status,
        budgetLimit: budgetLimit ? parseFloat(budgetLimit) : void 0,
        startDate: startDate ? new Date(startDate) : void 0,
        endDate: endDate ? new Date(endDate) : void 0
      }
    });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
var deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    await db_default.project.delete({
      where: { id, userId: req.userId }
    });
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
var getProjectSummary = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await db_default.project.findUnique({
      where: { id, userId: req.userId },
      include: {
        tasks: true,
        budgets: true,
        expenses: true
      }
    });
    if (!project) return res.status(404).json({ error: "Project not found" });
    const totalTasks = project.tasks.length;
    const completedTasks = project.tasks.filter(
      (t) => t.status === "COMPLETED"
    ).length;
    const progress = totalTasks > 0 ? completedTasks / totalTasks * 100 : 0;
    const totalSpent = project.expenses.reduce(
      (sum, e) => sum + e.amount,
      0
    );
    const budgetHealth = project.budgetLimit ? totalSpent / project.budgetLimit * 100 : 0;
    res.json({
      projectId: project.id,
      progress: Math.round(progress),
      totalSpent,
      budgetLimit: project.budgetLimit || 0,
      budgetHealth: Math.round(budgetHealth),
      daysRemaining: project.endDate ? Math.ceil(
        (new Date(project.endDate).getTime() - Date.now()) / (1e3 * 60 * 60 * 24)
      ) : null
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// server/src/routes/project.routes.ts
var router3 = express.Router();
router3.use(authenticate);
router3.post("/", createProject);
router3.get("/", getProjects);
router3.get("/:id", getProject);
router3.put("/:id", updateProject);
router3.delete("/:id", deleteProject);
router3.get("/:id/summary", getProjectSummary);
var project_routes_default = router3;

// server/src/routes/budget.routes.ts
import { Router as Router3 } from "express";

// server/src/controllers/budget.controller.ts
init_db();
init_whatsapp_service();
var getBudgets = async (req, res) => {
  try {
    const budgets = await db_default.budget.findMany({
      where: { userId: req.userId }
    });
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
var createBudget = async (req, res) => {
  try {
    const expenses = await db_default.expense.findMany({
      where: {
        userId: req.userId,
        category: req.body.category
      }
    });
    const spent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const existingBudget = await db_default.budget.findUnique({
      where: {
        userId_category: {
          userId: req.userId,
          category: req.body.category
        }
      }
    });
    let budget;
    if (existingBudget) {
      budget = await db_default.budget.update({
        where: { id: existingBudget.id },
        data: {
          ...req.body,
          spent,
          projectId: req.body.projectId || (req.body.projectId === "" ? null : void 0)
        }
      });
    } else {
      budget = await db_default.budget.create({
        data: {
          ...req.body,
          userId: req.userId,
          spent,
          projectId: req.body.projectId || null
        }
      });
    }
    res.status(201).json(budget);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
var deleteBudget = async (req, res) => {
  try {
    const existing = await db_default.budget.findFirst({
      where: { id: req.params.id, userId: req.userId }
    });
    if (!existing) {
      res.status(404).json({ error: "Budget not found" });
      return;
    }
    await db_default.budget.delete({ where: { id: req.params.id } });
    res.json({ message: "Budget deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
var getExpenses = async (req, res) => {
  try {
    const expenses = await db_default.expense.findMany({
      where: { userId: req.userId },
      orderBy: { date: "desc" }
    });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
var createExpense = async (req, res) => {
  try {
    const expense = await db_default.expense.create({
      data: {
        ...req.body,
        userId: req.userId,
        projectId: req.body.projectId || null,
        linkedTaskId: req.body.linkedTaskId || null
      }
    });
    const budget = await db_default.budget.findUnique({
      where: {
        userId_category: {
          userId: req.userId,
          category: expense.category
        }
      }
    });
    if (budget) {
      const updatedBudget = await db_default.budget.update({
        where: { id: budget.id },
        data: { spent: { increment: expense.amount } },
        include: { user: true }
      });
      if (updatedBudget.user.waBudgetEnabled && updatedBudget.user.phoneNumber && updatedBudget.spent >= updatedBudget.limit) {
        await sendWhatsAppMessage(
          updatedBudget.user.phoneNumber,
          `Budget Alert! You have reached your limit for ${updatedBudget.category}: Spent ${updatedBudget.spent}/${updatedBudget.limit}`
        );
      }
    }
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
var updateExpense = async (req, res) => {
  try {
    const existingExpense = await db_default.expense.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId
      }
    });
    if (!existingExpense) {
      res.status(404).json({ error: "Expense not found" });
      return;
    }
    const updatedExpense = await db_default.expense.update({
      where: { id: req.params.id },
      data: {
        ...req.body,
        projectId: req.body.projectId || (req.body.projectId === "" ? null : void 0),
        linkedTaskId: req.body.linkedTaskId || (req.body.linkedTaskId === "" ? null : void 0)
      }
    });
    if (existingExpense.amount !== updatedExpense.amount || existingExpense.category !== updatedExpense.category) {
      const oldBudget = await db_default.budget.findUnique({
        where: {
          userId_category: {
            userId: req.userId,
            category: existingExpense.category
          }
        }
      });
      if (oldBudget) {
        await db_default.budget.update({
          where: { id: oldBudget.id },
          data: { spent: { decrement: existingExpense.amount } }
        });
      }
      const newBudget = await db_default.budget.findUnique({
        where: {
          userId_category: {
            userId: req.userId,
            category: updatedExpense.category
          }
        }
      });
      if (newBudget) {
        await db_default.budget.update({
          where: { id: newBudget.id },
          data: { spent: { increment: updatedExpense.amount } }
        });
      }
    }
    res.json(updatedExpense);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
var deleteExpense = async (req, res) => {
  try {
    const existingExpense = await db_default.expense.findFirst({
      where: { id: req.params.id, userId: req.userId }
    });
    if (!existingExpense) {
      res.status(404).json({ error: "Expense not found" });
      return;
    }
    const deletedExpense = await db_default.expense.delete({
      where: { id: req.params.id }
    });
    const budget = await db_default.budget.findUnique({
      where: {
        userId_category: {
          userId: req.userId,
          category: deletedExpense.category
        }
      }
    });
    if (budget) {
      await db_default.budget.update({
        where: { id: budget.id },
        data: { spent: { decrement: deletedExpense.amount } }
      });
    }
    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// server/src/routes/budget.routes.ts
var router4 = Router3();
router4.use(authenticate);
router4.get("/budgets", getBudgets);
router4.post("/budgets", createBudget);
router4.delete("/budgets/:id", deleteBudget);
router4.get("/expenses", getExpenses);
router4.post("/expenses", createExpense);
router4.put("/expenses/:id", updateExpense);
router4.delete("/expenses/:id", deleteExpense);
var budget_routes_default = router4;

// server/src/routes/insights.routes.ts
import { Router as Router4 } from "express";

// server/src/controllers/insights.controller.ts
init_db();
var getInsights = async (req, res) => {
  try {
    const [tasks, budgets] = await Promise.all([
      db_default.task.findMany({ where: { userId: req.userId } }),
      db_default.budget.findMany({ where: { userId: req.userId } })
    ]);
    const insights = [];
    const availableFunds = budgets.reduce(
      (sum, b) => sum + (b.limit - b.spent),
      0
    );
    if (availableFunds < 1e4) {
      const incomeTasks = tasks.filter(
        (t) => t.financials?.type === "INCOME" /* INCOME */ && t.status !== "COMPLETED" /* COMPLETED */
      );
      insights.push({
        id: `cashflow-${Date.now()}`,
        type: "CASH_FLOW_ALERT",
        priority: "CRITICAL",
        title: "Low Cash Flow Alert",
        message: `Only NGN ${availableFunds.toLocaleString()} remaining in budgets. ${incomeTasks.length > 0 ? `Prioritize ${incomeTasks.length} income task(s).` : "Consider adding income tasks."}`,
        actionable: incomeTasks.length > 0,
        suggestedAction: incomeTasks.length > 0 ? "Focus on income-generating tasks" : void 0,
        financialImpact: availableFunds,
        createdAt: /* @__PURE__ */ new Date()
      });
    }
    const pendingExpenses = tasks.filter(
      (t) => t.financials?.type === "EXPENSE" /* EXPENSE */ && t.status !== "COMPLETED" /* COMPLETED */
    ).reduce((sum, t) => {
      const est = t.financials?.estimatedCost || 0;
      return sum + est;
    }, 0);
    if (pendingExpenses > availableFunds) {
      const deficit = pendingExpenses - availableFunds;
      insights.push({
        id: `deficit-${Date.now()}`,
        type: "BUDGET_WARNING",
        priority: "HIGH",
        title: "Budget Conflict Detected",
        message: `Pending expense tasks (NGN ${pendingExpenses.toLocaleString()}) exceed available budget (NGN ${availableFunds.toLocaleString()}). Shortfall: NGN ${deficit.toLocaleString()}`,
        actionable: true,
        suggestedAction: "Postpone low-priority expense tasks or increase budget",
        financialImpact: -deficit,
        createdAt: /* @__PURE__ */ new Date()
      });
    }
    const now = /* @__PURE__ */ new Date();
    tasks.forEach((task) => {
      if (task.financials?.lateFeePerDay && task.dueDate && task.status !== "COMPLETED" /* COMPLETED */) {
        const dueDate = new Date(task.dueDate);
        const isOverdue = dueDate < now;
        if (isOverdue) {
          const daysLate = Math.ceil(
            (now.getTime() - dueDate.getTime()) / (1e3 * 60 * 60 * 24)
          );
          const accruedFees = daysLate * task.financials.lateFeePerDay;
          insights.push({
            id: `latefee-${task.id}`,
            type: "BUDGET_WARNING",
            priority: "CRITICAL",
            title: `Late Fee Accruing: ${task.title}`,
            message: `Task is ${daysLate} day(s) overdue. Accrued fees: NGN ${accruedFees.toLocaleString()}`,
            actionable: true,
            taskId: task.id,
            suggestedAction: "Complete this task immediately",
            financialImpact: -accruedFees,
            createdAt: now
          });
        }
      }
    });
    const subscriptions = await db_default.recurringExpense.findMany({
      where: { userId: req.userId, isActive: true }
    });
    subscriptions.forEach((sub) => {
      const daysSinceUpdate = Math.ceil(
        (Date.now() - new Date(sub.updatedAt).getTime()) / (1e3 * 60 * 60 * 24)
      );
      if (daysSinceUpdate > 60) {
        insights.push({
          id: `unused-sub-${sub.id}`,
          type: "SUBSCRIPTION_ALERT",
          priority: "MEDIUM",
          title: `Unused Subscription: ${sub.merchantName}`,
          message: `You haven't engaged with this ${sub.frequency} subscription in over 60 days. Costs: NGN ${sub.amount.toLocaleString()}/cycle.`,
          actionable: true,
          suggestedAction: "Cancel Subscription",
          financialImpact: sub.amount,
          createdAt: /* @__PURE__ */ new Date()
        });
      }
    });
    const projects = await db_default.project.findMany({
      where: { userId: req.userId, status: "ACTIVE" },
      include: { tasks: true }
    });
    projects.forEach((project) => {
      const overdueTasks = project.tasks.filter(
        (t) => t.dueDate && new Date(t.dueDate) < now && t.status !== "COMPLETED"
      );
      if (overdueTasks.length > 0) {
        const potentialLoss = overdueTasks.reduce(
          (sum, t) => sum + (t.financials?.estimatedCost || 0) * 0.1,
          0
        );
        insights.push({
          id: `project-delay-${project.id}`,
          type: "PROJECT_RISK",
          priority: "HIGH",
          title: `Project Delay: ${project.title}`,
          message: `${overdueTasks.length} tasks are overdue. Estimated cost of delay: NGN ${potentialLoss.toLocaleString()}`,
          actionable: true,
          suggestedAction: "Reschedule or fast-track tasks",
          financialImpact: -potentialLoss,
          createdAt: /* @__PURE__ */ new Date()
        });
      }
    });
    const phoneExpenses = await db_default.expense.aggregate({
      where: {
        userId: req.userId,
        category: "UTILITIES",
        description: { contains: "Phone", mode: "insensitive" }
      },
      _sum: { amount: true }
    });
    if ((phoneExpenses._sum.amount || 0) > 5e4) {
      insights.push({
        id: `opt-phone-${Date.now()}`,
        type: "SPENDING_OPT",
        priority: "LOW",
        title: "Optimize Phone Bill",
        message: "You spent over NGN 50,000 on phone bills recently. Switching carriers could save you ~NGN 15,000/year.",
        actionable: true,
        suggestedAction: "Compare Data Plans",
        financialImpact: 15e3,
        createdAt: /* @__PURE__ */ new Date()
      });
    }
    const userRole = req.user?.role;
    if (userRole === "ADMIN") {
      insights.unshift({
        id: `sys-health-${Date.now()}`,
        type: "SYSTEM_UPDATE",
        // New Type (mapped to icon in frontend if added, or fallback)
        priority: "LOW",
        title: "Platform Status: Healthy",
        message: "All systems (AI, DB, Mailer) are currently operating at peak performance.",
        actionable: false,
        createdAt: /* @__PURE__ */ new Date()
      });
    }
    res.json({ insights });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
var getRecommendations = async (req, res) => {
  try {
    const [tasks] = await Promise.all([
      db_default.task.findMany({
        where: {
          userId: req.userId,
          status: { not: "COMPLETED" /* COMPLETED */ }
        }
      })
    ]);
    const recommendations = tasks.map((task) => {
      let score = 0;
      const priorityScores = { LOW: 10, MEDIUM: 30, HIGH: 60, URGENT: 90 };
      score += priorityScores[task.priority] || 0;
      if (task.dueDate) {
        const daysUntilDue = Math.ceil(
          (new Date(task.dueDate).getTime() - Date.now()) / (1e3 * 60 * 60 * 24)
        );
        if (daysUntilDue < 0) score += 50;
        else if (daysUntilDue <= 1) score += 30;
        else if (daysUntilDue <= 3) score += 20;
      }
      if (task.financials?.lateFeePerDay) {
        score += 40;
      }
      return {
        taskId: task.id,
        task,
        urgencyScore: Math.min(100, score)
      };
    }).filter((r) => r.urgencyScore > 50).sort((a, b) => b.urgencyScore - a.urgencyScore).slice(0, 5);
    res.json({ recommendations });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// server/src/routes/insights.routes.ts
var router5 = Router4();
router5.use(authenticate);
router5.get("/", getInsights);
router5.get("/recommendations", getRecommendations);
var insights_routes_default = router5;

// server/src/routes/predictive.routes.ts
import { Router as Router5 } from "express";

// server/src/services/predictive.service.ts
init_db();
import {
  getDaysInMonth,
  differenceInCalendarDays,
  lastDayOfMonth
} from "date-fns";
var PredictiveService = class {
  async generateForecast(userId) {
    console.log(`[PredictiveService] Generating forecast for user: ${userId}`);
    const today = /* @__PURE__ */ new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = lastDayOfMonth(today);
    const daysInCurrentMonth = getDaysInMonth(today);
    const daysPassed = differenceInCalendarDays(today, startOfMonth) + 1;
    const daysRemaining = daysInCurrentMonth - daysPassed;
    const budgets = await db_default.budget.findMany({
      where: { userId },
      include: { user: false }
    });
    const recurringExpenses = await db_default.recurringExpense.findMany({
      where: { userId, isActive: true }
    });
    const forecasts = [];
    for (const budget of budgets) {
      const dailyBurnRate = budget.spent / Math.max(daysPassed, 1);
      let projectedTotal = budget.spent + dailyBurnRate * daysRemaining;
      let status = "SAFE";
      if (projectedTotal > budget.limit) {
        status = "CRITICAL";
      } else if (projectedTotal > budget.limit * 0.9) {
        status = "WARNING";
      }
      forecasts.push({
        budgetId: budget.id,
        category: budget.category,
        budgetLimit: budget.limit,
        currentSpent: budget.spent,
        projectedTotal: Math.round(projectedTotal),
        status,
        confidence: daysPassed > 10 ? 0.8 : 0.5,
        // Low confidence early in month
        upcomingRecurrings: []
        // Populated if we had category linking
      });
    }
    return forecasts;
  }
};

// server/src/controllers/predictive.controller.ts
var predictiveService = new PredictiveService();
var getForecast = async (req, res) => {
  try {
    const forecasts = await predictiveService.generateForecast(req.userId);
    res.json(forecasts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// server/src/routes/predictive.routes.ts
var router6 = Router5();
router6.get("/forecast", authenticate, getForecast);
var predictive_routes_default = router6;

// server/src/routes/pattern.routes.ts
import { Router as Router6 } from "express";

// server/src/services/pattern.service.ts
init_db();
import { subDays, differenceInDays, addDays } from "date-fns";
var PatternDetectionService = class {
  // Basic normalization: remove numbers, special chars, trim
  normalizeMerchantName(name) {
    return name.replace(/[0-9]/g, "").replace(/[^a-zA-Z\s]/g, " ").trim().toLowerCase();
  }
  async detectPatterns(userId) {
    console.log(`[PatternService] Running detection for user: ${userId}`);
    const expenses = await db_default.expense.findMany({
      where: {
        userId,
        date: {
          gte: subDays(/* @__PURE__ */ new Date(), 14)
        }
      },
      orderBy: { date: "asc" }
    });
    if (expenses.length < 2) return [];
    const groups = {};
    expenses.forEach((e) => {
      const key = this.normalizeMerchantName(e.title);
      if (key.length < 3) return;
      if (!groups[key]) groups[key] = [];
      groups[key].push(e);
    });
    const newPatterns = [];
    for (const [key, group] of Object.entries(groups)) {
      if (group.length < 2) continue;
      const amounts = group.map((e) => e.amount);
      const avgAmount = amounts.reduce((a, b) => a + b, 0) / amounts.length;
      const variance = amounts.reduce((sum, a) => sum + Math.pow(a - avgAmount, 2), 0) / amounts.length;
      const stdDev = Math.sqrt(variance);
      const isConsistentAmount = stdDev / avgAmount < 0.15;
      const intervals = [];
      for (let i = 1; i < group.length; i++) {
        const dayDiff = differenceInDays(
          new Date(group[i].date),
          new Date(group[i - 1].date)
        );
        intervals.push(dayDiff);
      }
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      let frequency = "";
      if (Math.abs(avgInterval - 7) < 3) frequency = "WEEKLY";
      else if (Math.abs(avgInterval - 30) < 5) frequency = "MONTHLY";
      else if (Math.abs(avgInterval - 365) < 10) frequency = "YEARLY";
      if (frequency && isConsistentAmount) {
        const mostRecent = group[group.length - 1];
        const originalName = mostRecent.title;
        const lastDate = new Date(mostRecent.date);
        const nextDueDate = addDays(lastDate, Math.round(avgInterval));
        const existing = await db_default.recurringExpense.findFirst({
          where: {
            userId,
            merchantName: originalName
          }
        });
        if (!existing) {
          const newPattern = await db_default.recurringExpense.create({
            data: {
              userId,
              merchantName: originalName,
              amount: avgAmount,
              frequency,
              nextDueDate,
              confidenceScore: 0.8 + group.length * 0.05,
              // More history = more confidence
              isConfirmed: false
            }
          });
          newPatterns.push(newPattern);
          console.log(
            `[PatternService] Detected: ${originalName} (${frequency})`
          );
        } else {
          await db_default.recurringExpense.update({
            where: { id: existing.id },
            data: {
              amount: avgAmount,
              // Update rolling average
              nextDueDate
              // Update next due date
            }
          });
        }
      }
    }
    return newPatterns;
  }
};

// server/src/controllers/pattern.controller.ts
init_db();
var patternService = new PatternDetectionService();
var detectPatterns = async (req, res) => {
  try {
    const patterns = await patternService.detectPatterns(req.userId);
    const allPatterns = await db_default.recurringExpense.findMany({
      where: { userId: req.userId },
      orderBy: { nextDueDate: "asc" }
    });
    res.json({
      newlyDetected: patterns.length,
      patterns: allPatterns
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
var getPatterns = async (req, res) => {
  try {
    const patterns = await db_default.recurringExpense.findMany({
      where: { userId: req.userId },
      orderBy: { nextDueDate: "asc" }
    });
    res.json(patterns);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
var confirmPattern = async (req, res) => {
  try {
    const id = req.params.id;
    const pattern = await db_default.recurringExpense.findFirst({
      where: { id, userId: req.userId }
    });
    if (!pattern) {
      res.status(404).json({ error: "Pattern not found" });
      return;
    }
    const updated = await db_default.recurringExpense.update({
      where: { id },
      data: { isConfirmed: true }
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
var deletePattern = async (req, res) => {
  try {
    const id = req.params.id;
    const pattern = await db_default.recurringExpense.findFirst({
      where: { id, userId: req.userId }
    });
    if (!pattern) {
      res.status(404).json({ error: "Pattern not found" });
      return;
    }
    await db_default.recurringExpense.delete({
      where: { id }
    });
    res.json({ message: "Pattern deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// server/src/routes/pattern.routes.ts
var router7 = Router6();
router7.post("/detect", authenticate, detectPatterns);
router7.get("/", authenticate, getPatterns);
router7.patch("/:id/confirm", authenticate, confirmPattern);
router7.delete("/:id", authenticate, deletePattern);
var pattern_routes_default = router7;

// server/src/routes/stripe.routes.ts
import express2 from "express";

// server/src/controllers/stripe.controller.ts
init_db();
import Stripe from "stripe";
var stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2026-01-28.clover"
  // Use latest API version available
});
var PRO_PRICE_ID = process.env.STRIPE_PRO_PRICE_ID;
var createCheckoutSession = async (req, res) => {
  console.log("Stripe: createCheckoutSession started");
  console.log(
    "Stripe: Env Check -> PRO_PRICE_ID:",
    process.env.STRIPE_PRO_PRICE_ID ? "Set" : "Missing"
  );
  try {
    const userId = req.user?.id;
    console.log("Stripe: User ID from req:", userId);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const user = await db_default.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: "User not found" });
    let customerId = user.stripeCustomerId;
    console.log("Stripe: Existing Customer ID:", customerId);
    if (!customerId) {
      console.log("Stripe: Creating new Stripe customer...");
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { userId: user.id }
      });
      customerId = customer.id;
      console.log("Stripe: New Customer ID created:", customerId);
      await db_default.user.update({
        where: { id: userId },
        data: { stripeCustomerId: customerId }
      });
    }
    const { billingPeriod } = req.body;
    console.log("Stripe: Billing Period requested:", billingPeriod);
    let priceId = process.env.STRIPE_PRO_PRICE_ID;
    if (billingPeriod === "yearly") {
      priceId = process.env.STRIPE_PRO_YEARLY_PRICE_ID;
      console.log("Stripe: Selected YEARLY price ID");
    } else {
      console.log("Stripe: Selected MONTHLY price ID");
    }
    if (!priceId) {
      console.error(
        `Stripe Error: Price ID for ${billingPeriod} is missing in environment variables`
      );
      return res.status(500).json({ message: "Server configuration error: Missing Price ID" });
    }
    console.log("Stripe: Creating checkout session with Price ID:", priceId);
    const clientUrl = process.env.CLIENT_URL || "https://www.hikarii.org";
    console.log("Stripe: Using Client URL:", clientUrl);
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      mode: "subscription",
      subscription_data: {
        trial_period_days: 14
      },
      success_url: `${clientUrl}/settings?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${clientUrl}/pricing`,
      metadata: {
        userId
      }
    });
    console.log("Stripe: Session created successfully:", session.id);
    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error("Stripe Checkout Error:", error);
    res.status(500).json({
      message: "Failed to create checkout session",
      error: error.message
    });
  }
};
var createPortalSession = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const user = await db_default.user.findUnique({ where: { id: userId } });
    if (!user || !user.stripeCustomerId)
      return res.status(400).json({ message: "No subscription found" });
    const clientUrl = process.env.CLIENT_URL || "https://www.hikarii.org";
    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${clientUrl}/settings`
    });
    res.json({ url: session.url });
  } catch (error) {
    console.error("Portal Session Error:", error);
    res.status(500).json({ message: "Failed to create portal session" });
  }
};
var cancelSubscription = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const user = await db_default.user.findUnique({ where: { id: userId } });
    if (!user || !user.stripeCustomerId) {
      return res.status(400).json({ message: "No active subscription found" });
    }
    const subscriptions = await stripe.subscriptions.list({
      customer: user.stripeCustomerId,
      status: "active",
      limit: 1
    });
    if (subscriptions.data.length === 0) {
      return res.status(400).json({ message: "No active subscription to cancel" });
    }
    const subscriptionId = subscriptions.data[0].id;
    const updatedSubscription = await stripe.subscriptions.update(
      subscriptionId,
      { cancel_at_period_end: true }
    );
    res.json({
      message: "Subscription will be cancelled at the end of the billing period",
      currentPeriodEnd: new Date(
        updatedSubscription.current_period_end * 1e3
      )
    });
  } catch (error) {
    console.error("Cancel Subscription Error:", error);
    res.status(500).json({ message: "Failed to cancel subscription", error: error.message });
  }
};

// server/src/routes/stripe.routes.ts
var router8 = express2.Router();
router8.post(
  "/create-checkout-session",
  authenticate,
  createCheckoutSession
);
router8.post("/create-portal-session", authenticate, createPortalSession);
router8.post("/cancel-subscription", authenticate, cancelSubscription);
var stripe_routes_default = router8;

// server/src/routes/google.routes.ts
import { Router as Router7 } from "express";

// server/src/controllers/google.controller.ts
init_google_calendar_service();
init_db();
var connectGoogle = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      res.status(400).json({ error: "Authorization code required" });
      return;
    }
    const user = await exchangeCodeForToken(req.userId, code);
    res.json({
      success: true,
      message: "Google Calendar connected successfully",
      isConnected: !!user.googleAccessToken
    });
  } catch (error) {
    console.error("Google Connect Error:", error);
    res.status(500).json({ error: error.message });
  }
};
var syncTaskToCalendar = async (req, res) => {
  try {
    const { taskId } = req.body;
    const task = await db_default.task.findFirst({
      where: { id: taskId, userId: req.userId }
    });
    if (!task) {
      res.status(404).json({ error: "Task not found" });
      return;
    }
    const event = await createCalendarEvent(req.userId, task);
    if (!event) {
      res.status(400).json({ error: "Failed to create event or user not connected" });
      return;
    }
    res.json({
      success: true,
      message: "Task synced to Google Calendar",
      eventId: event.id,
      link: event.htmlLink
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
var disconnectGoogle = async (req, res) => {
  try {
    await db_default.user.update({
      where: { id: req.userId },
      data: {
        googleAccessToken: null,
        googleRefreshToken: null,
        googleId: null
      }
    });
    res.json({ success: true, message: "Disconnected from Google Calendar" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
var getGoogleStatus = async (req, res) => {
  try {
    const user = await db_default.user.findUnique({
      where: { id: req.userId },
      select: { googleAccessToken: true }
    });
    res.json({ isConnected: !!user?.googleAccessToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// server/src/routes/google.routes.ts
var router9 = Router7();
router9.post("/connect", authenticate, connectGoogle);
router9.post("/disconnect", authenticate, disconnectGoogle);
router9.get("/status", authenticate, getGoogleStatus);
router9.post("/sync-task", authenticate, syncTaskToCalendar);
var google_routes_default = router9;

// server/src/routes/contact.routes.ts
import express3 from "express";

// server/src/controllers/contact.controller.ts
init_email_service();
init_emailTemplates();
var submitContactForm = async (req, res) => {
  try {
    const { firstName, lastName, email, subject, message } = req.body;
    if (!firstName || !email || !message) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }
    const adminEmail = process.env.ADMIN_EMAIL || "support@hikarii.org";
    const adminHtml = getContactFormTemplate(
      firstName,
      lastName,
      email,
      subject,
      message
    );
    await sendEmail(adminEmail, `Contact Form: ${subject}`, adminHtml);
    const userHtml = getContactAutoReplyTemplate(firstName);
    await sendEmail(
      email,
      "We received your message - Hikari Support",
      userHtml
    );
    res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("Contact form error:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
};

// server/src/routes/contact.routes.ts
var router10 = express3.Router();
router10.post("/", submitContactForm);
var contact_routes_default = router10;

// server/src/routes/admin.routes.ts
import { Router as Router8 } from "express";

// server/src/controllers/admin.controller.ts
init_db();
init_email_service();
init_emailTemplates();
import { subDays as subDays2 } from "date-fns";
import bcrypt from "bcryptjs";
var createAdmin = async (req, res) => {
  try {
    const adminId = req.userId;
    const { name, email, password } = req.body;
    const requestor = await db_default.user.findUnique({
      where: { id: adminId },
      select: { role: true }
    });
    if (!requestor || requestor.role !== "ADMIN") {
      return res.status(403).json({ message: "Access Denied: Admin only" });
    }
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingUser = await db_default.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = await db_default.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "ADMIN",
        isVerified: true,
        // Auto-verify admins created by other admins
        requiresPasswordChange: true
      }
    });
    await db_default.auditLog.create({
      data: {
        adminId,
        action: "CREATE_ADMIN",
        targetId: newAdmin.id,
        targetType: "USER",
        details: { email, name },
        ipAddress: req.ip
      }
    });
    try {
      await sendEmail(
        email,
        "Welcome to the Admin Team - Hikari",
        getAdminOnboardingTemplate(name, email, password)
      );
    } catch (emailError) {
      console.error("Failed to send admin onboarding email:", emailError);
    }
    res.status(201).json({
      message: "Admin created successfully",
      user: {
        id: newAdmin.id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role
      }
    });
  } catch (error) {
    console.error("Create Admin Error:", error);
    res.status(500).json({ message: "Failed to create admin" });
  }
};
var getAdminDashboardData = async (req, res) => {
  try {
    const adminId = req.userId;
    const requestor = await db_default.user.findUnique({
      where: { id: adminId },
      select: { role: true }
    });
    if (!requestor || requestor.role !== "ADMIN") {
      return res.status(403).json({ message: "Access Denied: Admin only" });
    }
    const totalUsers = await db_default.user.count();
    const proUsers = await db_default.user.count({
      where: { subscriptionStatus: "PRO" }
    });
    const sevenDaysAgo = subDays2(/* @__PURE__ */ new Date(), 7);
    const thirtyDaysAgo = subDays2(/* @__PURE__ */ new Date(), 30);
    const activeUsers = await db_default.user.count({
      where: {
        lastLoginAt: { gte: sevenDaysAgo }
      }
    });
    const totalTasks = await db_default.task.count();
    const totalAiSplits = await db_default.taskBlock.count();
    const totalExpenses = await db_default.expense.count();
    const recentTasks = await db_default.task.count({
      where: { createdAt: { gte: thirtyDaysAgo } }
    });
    const recentSplits = await db_default.taskBlock.count({
      where: { createdAt: { gte: thirtyDaysAgo } }
    });
    const recentExpenses = await db_default.expense.count({
      where: { createdAt: { gte: thirtyDaysAgo } }
    });
    const estimatedMRR = proUsers * 9.99;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const users = await db_default.user.findMany({
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        subscriptionStatus: true,
        lastLoginAt: true,
        createdAt: true,
        isSuspended: true
      }
    });
    res.json({
      stats: {
        totalUsers,
        activeUsers,
        proUsers,
        totalTasks,
        totalAiSplits,
        totalExpenses,
        estimatedMRR
      },
      engagement: {
        clarity: recentTasks,
        focus: recentSplits,
        freedom: recentExpenses
      },
      users,
      pagination: {
        total: totalUsers,
        pages: Math.ceil(totalUsers / limit),
        currentPage: page,
        limit
      }
    });
  } catch (error) {
    console.error("Admin Dashboard Error:", error);
    res.status(500).json({ message: "Failed to fetch admin data" });
  }
};
var updateUser = async (req, res) => {
  try {
    const adminId = req.userId;
    const { id } = req.params;
    const { name, email, role, subscriptionStatus } = req.body;
    const requestor = await db_default.user.findUnique({
      where: { id: adminId },
      select: { role: true, name: true }
    });
    if (!requestor || requestor.role !== "ADMIN") {
      return res.status(403).json({ message: "Access Denied: Admin only" });
    }
    const updatedUser = await db_default.user.update({
      where: { id },
      data: {
        name: name || void 0,
        email: email || void 0,
        role: role || void 0,
        subscriptionStatus: subscriptionStatus || void 0
      }
    });
    await db_default.auditLog.create({
      data: {
        adminId,
        action: "UPDATE_USER",
        targetId: id,
        targetType: "USER",
        details: { name, email, role, subscriptionStatus },
        ipAddress: req.ip
      }
    });
    res.json({
      message: "User updated successfully",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        subscriptionStatus: updatedUser.subscriptionStatus
      }
    });
  } catch (error) {
    console.error("Update User Error:", error);
    res.status(500).json({ message: "Failed to update user" });
  }
};
var deleteUser = async (req, res) => {
  try {
    const adminId = req.userId;
    const { id } = req.params;
    const requestor = await db_default.user.findUnique({
      where: { id: adminId },
      select: { role: true }
    });
    if (!requestor || requestor.role !== "ADMIN") {
      return res.status(403).json({ message: "Access Denied: Admin only" });
    }
    if (id === adminId) {
      return res.status(400).json({ message: "Admins cannot delete their own account" });
    }
    const targetUser = await db_default.user.findUnique({ where: { id } });
    if (!targetUser) return res.status(404).json({ message: "User not found" });
    await db_default.user.delete({ where: { id } });
    await db_default.auditLog.create({
      data: {
        adminId,
        action: "DELETE_USER",
        targetId: id,
        targetType: "USER",
        details: { email: targetUser.email, name: targetUser.name },
        ipAddress: req.ip
      }
    });
    res.json({ message: "User and all associated data deleted successfully" });
  } catch (error) {
    console.error("Delete User Error:", error);
    res.status(500).json({ message: "Failed to delete user" });
  }
};
var suspendUser = async (req, res) => {
  try {
    const adminId = req.userId;
    const { id } = req.params;
    const { reason, durationDays } = req.body;
    const requestor = await db_default.user.findUnique({
      where: { id: adminId },
      select: { role: true }
    });
    if (!requestor || requestor.role !== "ADMIN") {
      return res.status(403).json({ message: "Access Denied" });
    }
    const suspensionExpires = durationDays ? new Date(Date.now() + durationDays * 24 * 60 * 60 * 1e3) : null;
    const userToSuspend = await db_default.user.update({
      where: { id },
      data: {
        isSuspended: true,
        suspensionReason: reason,
        suspensionExpires
      }
    });
    try {
      const emailHtml = getSuspensionTemplate(
        userToSuspend.name,
        reason,
        suspensionExpires || void 0
      );
      await sendEmail(
        userToSuspend.email,
        "Account Suspended - Hikari",
        emailHtml
      );
    } catch (emailError) {
      console.error("Failed to send suspension email:", emailError);
    }
    await db_default.auditLog.create({
      data: {
        adminId,
        action: "SUSPEND_USER",
        targetId: id,
        targetType: "USER",
        details: { reason, durationDays, expires: suspensionExpires },
        ipAddress: req.ip
      }
    });
    res.json({ message: "User suspended successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to suspend user" });
  }
};
var reactivateUser = async (req, res) => {
  try {
    const adminId = req.userId;
    const { id } = req.params;
    const requestor = await db_default.user.findUnique({
      where: { id: adminId },
      select: { role: true }
    });
    if (!requestor || requestor.role !== "ADMIN") {
      return res.status(403).json({ message: "Access Denied" });
    }
    const reactivatedUser = await db_default.user.update({
      where: { id },
      data: {
        isSuspended: false,
        suspensionReason: null,
        suspensionExpires: null
      }
    });
    try {
      const emailHtml = getReactivationTemplate(reactivatedUser.name);
      await sendEmail(
        reactivatedUser.email,
        "Account Reactivated - Hikari",
        emailHtml
      );
    } catch (emailError) {
      console.error("Failed to send reactivation email:", emailError);
    }
    await db_default.auditLog.create({
      data: {
        adminId,
        action: "REACTIVATE_USER",
        targetId: id,
        targetType: "USER",
        ipAddress: req.ip
      }
    });
    res.json({ message: "User reactivated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to reactivate user" });
  }
};
var getAuditLogs = async (req, res) => {
  try {
    const adminId = req.userId;
    const requestor = await db_default.user.findUnique({
      where: { id: adminId },
      select: { role: true }
    });
    if (!requestor || requestor.role !== "ADMIN") {
      return res.status(403).json({ message: "Access Denied" });
    }
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const [logs, total] = await Promise.all([
      db_default.auditLog.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          admin: {
            select: { name: true, email: true }
          }
        },
        skip,
        take: limit
      }),
      db_default.auditLog.count()
    ]);
    res.json({
      logs,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        limit
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch audit logs" });
  }
};
var handleBatchOperations = async (req, res) => {
  try {
    const adminId = req.userId;
    const { userIds, action, details } = req.body;
    const requestor = await db_default.user.findUnique({
      where: { id: adminId },
      select: { role: true }
    });
    if (!requestor || requestor.role !== "ADMIN") {
      return res.status(403).json({ message: "Access Denied" });
    }
    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ message: "No users selected" });
    }
    if (action === "DELETE") {
      const filteredIds = userIds.filter((id) => id !== adminId);
      await db_default.user.deleteMany({
        where: { id: { in: filteredIds } }
      });
    } else if (action === "SUSPEND") {
      const { reason, durationDays } = details || {};
      const suspensionExpires = durationDays ? new Date(Date.now() + durationDays * 24 * 60 * 60 * 1e3) : null;
      await db_default.user.updateMany({
        where: { id: { in: userIds } },
        data: {
          isSuspended: true,
          suspensionReason: reason,
          suspensionExpires
        }
      });
    }
    await db_default.auditLog.create({
      data: {
        adminId,
        action: `BATCH_${action}`,
        details: { userCount: userIds.length, userIds, ...details },
        ipAddress: req.ip
      }
    });
    res.json({ message: `Batch ${action} completed successfully` });
  } catch (error) {
    res.status(500).json({ message: "Batch operation failed" });
  }
};

// server/src/routes/admin.routes.ts
var router11 = Router8();
router11.get("/dashboard", authenticate, getAdminDashboardData);
router11.get("/audit-logs", authenticate, getAuditLogs);
router11.post("/create-admin", authenticate, createAdmin);
router11.put("/users/:id", authenticate, updateUser);
router11.post("/users/:id/suspend", authenticate, suspendUser);
router11.post("/users/:id/reactivate", authenticate, reactivateUser);
router11.delete("/users/:id", authenticate, deleteUser);
router11.post("/batch", authenticate, handleBatchOperations);
var admin_routes_default = router11;

// server/src/routes/lead.routes.ts
import { Router as Router9 } from "express";

// server/src/controllers/lead.controller.ts
init_db();
init_email_service();
init_emailTemplates();
var createLead = async (req, res) => {
  try {
    const { email, source } = req.body;
    if (!email) {
      res.status(400).json({ error: "Email is required" });
      return;
    }
    const existingLead = await db_default.lead.findUnique({
      where: { email }
    });
    if (existingLead) {
      if (source && existingLead.source !== source) {
        await db_default.lead.update({
          where: { email },
          data: { source }
        });
      }
      res.status(200).json({
        message: "Thank you for your interest! We already have your email on file."
      });
      return;
    }
    const lead = await db_default.lead.create({
      data: {
        email,
        source: source || "GENERAL_INTEREST"
      }
    });
    try {
      await sendEmail(
        email,
        "Your Hikari Method Template Inside!",
        getLeadMagnetTemplate(email)
      );
    } catch (emailError) {
      console.error("Lead magnet email failed to send:", emailError);
    }
    res.status(201).json({
      message: "Success! You've been added to our interest list. Check your inbox for the Hikari Method magnet!",
      lead
    });
  } catch (error) {
    console.error("Lead capture error:", error);
    res.status(500).json({ error: error.message });
  }
};

// server/src/routes/lead.routes.ts
var router12 = Router9();
router12.post("/", createLead);
var lead_routes_default = router12;

// server/src/app.ts
var app = express4();
app.use(cors());
app.use(express4.json());
app.get("/api/ai/test", (req, res) => {
  res.json({ message: "AI route test successful" });
});
app.use("/api/auth", auth_routes_default);
app.use("/api/admin", admin_routes_default);
app.use("/api/contact", contact_routes_default);
app.use("/api/tasks", task_routes_default);
app.use("/api/projects", project_routes_default);
app.use("/api", budget_routes_default);
app.use("/api/insights", insights_routes_default);
app.use("/api/predictive", predictive_routes_default);
app.use("/api/patterns", pattern_routes_default);
app.use("/api/stripe", stripe_routes_default);
app.use("/api/google", google_routes_default);
app.use("/api/leads", lead_routes_default);
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});
var clientBuildPath = path2.join(process.cwd(), "dist");
if (fs2.existsSync(clientBuildPath)) {
  app.use(express4.static(clientBuildPath));
  app.get("*", (req, res) => {
    if (req.path.startsWith("/api")) {
      res.status(404).json({ error: "API Route not found" });
      return;
    }
    res.sendFile(path2.join(clientBuildPath, "index.html"));
  });
} else {
  console.log(
    "Client build not found at (only API operational):",
    clientBuildPath
  );
}
var PORT = process.env.PORT || 5e3;
var PORT_NUM = Number(PORT) || 5e3;
app.listen(PORT_NUM, "0.0.0.0", () => {
  if (process.env.NODE_ENV === "production" && !process.env.VERCEL) {
    Promise.resolve().then(() => (init_reminder_job(), reminder_job_exports)).then(({ startReminderJob: startReminderJob2 }) => {
      startReminderJob2();
    }).catch((err) => console.error("Failed to load cron job:", err));
  }
  console.log(`
\u{1F680} Server is running on port ${PORT_NUM}`);
});
var app_default = app;
export {
  app_default as default
};
