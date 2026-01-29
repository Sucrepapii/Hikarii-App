var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/src/middleware/errorHandler.ts
var errorHandler;
var init_errorHandler = __esm({
  "server/src/middleware/errorHandler.ts"() {
    errorHandler = (err, _req, res, _next) => {
      console.error("\u{1F6A8} Server Error:", err.stack || err);
      let statusCode = err.statusCode || 500;
      let message = err.message || "Internal Server Error";
      if (process.env.NODE_ENV === "production" || !process.env.VERCEL) {
        if (err.code && err.code.startsWith("P")) {
          console.log("Caught technical database error:", err.code);
          message = "Signup failed: A database error occurred. Please try again later.";
          statusCode = 500;
        } else if (err.message && err.message.includes("invocation:")) {
          message = "Signup failed: Server configuration issue. Please contact support.";
          statusCode = 500;
        }
      }
      res.status(statusCode).json({
        error: message,
        ...process.env.NODE_ENV === "development" && { stack: err.stack }
      });
    };
  }
});

// server/src/config/db.ts
import { PrismaClient } from "@prisma/client";
var prisma, db_default;
var init_db = __esm({
  "server/src/config/db.ts"() {
    prisma = new PrismaClient();
    db_default = prisma;
  }
});

// server/src/utils/jwt.ts
import jwt from "jsonwebtoken";
var JWT_SECRET, JWT_EXPIRES_IN, generateToken, verifyToken;
var init_jwt = __esm({
  "server/src/utils/jwt.ts"() {
    JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key";
    JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
    generateToken = (payload) => {
      const options = {
        expiresIn: JWT_EXPIRES_IN
      };
      return jwt.sign(payload, JWT_SECRET, options);
    };
    verifyToken = (token) => {
      try {
        return jwt.verify(token, JWT_SECRET);
      } catch (error) {
        throw new Error("Invalid or expired token");
      }
    };
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
        const { data, error } = await resend.emails.send({
          from: "Hikari<onboarding@resend.dev>",
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
var getBaseTemplate, getVerificationTemplate, getPasswordResetTemplate, getOverdueReminderTemplate;
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
  }
});

// server/src/controllers/auth.controller.ts
var generateOTP, signup, login, verifyEmail, resendVerification, getMe, forgotPassword, resetPassword, debugInfo;
var init_auth_controller = __esm({
  "server/src/controllers/auth.controller.ts"() {
    init_db();
    init_jwt();
    init_email_service();
    init_emailTemplates();
    generateOTP = () => Math.floor(1e5 + Math.random() * 9e5).toString();
    signup = async (req, res) => {
      console.log("Signup request received for:", req.body?.email);
      try {
        const { name, email, password } = req.body;
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
        const bcrypt = await import("bcryptjs");
        const salt = await bcrypt.default.genSalt(10);
        const hashedPassword = await bcrypt.default.hash(password, salt);
        const user = await db_default.user.create({
          data: {
            name,
            email,
            password: hashedPassword,
            isVerified: false,
            verificationToken: otp,
            verificationTokenExpires: otpExpires
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
    login = async (req, res) => {
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
        if (user.password !== password) {
        }
        const bcrypt = await import("bcryptjs");
        const isMatch = await bcrypt.default.compare(password, user.password);
        if (!isMatch) {
          res.status(401).json({ error: "Invalid credentials" });
          return;
        }
        const token = generateToken({
          userId: user.id,
          email: user.email
        });
        res.json({
          user: {
            id: user.id,
            // Prisma uses 'id' not '_id'
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
            subscriptionStatus: user.subscriptionStatus,
            stripeCustomerId: user.stripeCustomerId,
            currentPeriodEnd: user.currentPeriodEnd
          },
          token
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    };
    verifyEmail = async (req, res) => {
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
            createdAt: user.createdAt,
            subscriptionStatus: user.subscriptionStatus,
            stripeCustomerId: user.stripeCustomerId,
            currentPeriodEnd: user.currentPeriodEnd
          },
          token
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    };
    resendVerification = async (req, res) => {
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
    getMe = async (req, res) => {
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
            createdAt: user.createdAt,
            subscriptionStatus: user.subscriptionStatus,
            stripeCustomerId: user.stripeCustomerId,
            currentPeriodEnd: user.currentPeriodEnd
          }
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    };
    forgotPassword = async (req, res) => {
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
    resetPassword = async (req, res) => {
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
        const bcrypt = await import("bcryptjs");
        const salt = await bcrypt.default.genSalt(10);
        const hashedPassword = await bcrypt.default.hash(newPassword, salt);
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
    debugInfo = async (_req, res) => {
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
  }
});

// server/src/middleware/auth.middleware.ts
var authenticate;
var init_auth_middleware = __esm({
  "server/src/middleware/auth.middleware.ts"() {
    init_jwt();
    init_db();
    authenticate = async (req, res, next) => {
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
            stripeCustomerId: true
          }
        });
        if (!user) {
          res.status(401).json({ error: "User not found" });
          return;
        }
        req.user = user;
        next();
      } catch (error) {
        res.status(401).json({ error: "Invalid or expired token" });
      }
    };
  }
});

// server/src/routes/auth.routes.ts
import { Router } from "express";
var router, auth_routes_default;
var init_auth_routes = __esm({
  "server/src/routes/auth.routes.ts"() {
    init_auth_controller();
    init_auth_middleware();
    router = Router();
    router.post("/signup", signup);
    router.post("/login", login);
    router.post("/verify-email", verifyEmail);
    router.post("/resend-verification", resendVerification);
    router.post("/forgot-password", forgotPassword);
    router.post("/reset-password", resetPassword);
    router.get("/me", authenticate, getMe);
    router.get("/debug", debugInfo);
    auth_routes_default = router;
  }
});

// server/src/models/types.ts
var init_types = __esm({
  "server/src/models/types.ts"() {
  }
});

// server/src/controllers/task.controller.ts
var getTasks, createTask, getTaskById, updateTask, deleteTask, toggleTaskStatus;
var init_task_controller = __esm({
  "server/src/controllers/task.controller.ts"() {
    init_db();
    init_types();
    getTasks = async (req, res) => {
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
    createTask = async (req, res) => {
      try {
        const task = await db_default.task.create({
          data: {
            ...req.body,
            userId: req.userId
          }
        });
        res.status(201).json(task);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    };
    getTaskById = async (req, res) => {
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
    updateTask = async (req, res) => {
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
          data: req.body
        });
        res.json(task);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    };
    deleteTask = async (req, res) => {
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
    toggleTaskStatus = async (req, res) => {
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
  }
});

// server/src/routes/task.routes.ts
import { Router as Router2 } from "express";
var router2, task_routes_default;
var init_task_routes = __esm({
  "server/src/routes/task.routes.ts"() {
    init_task_controller();
    init_auth_middleware();
    router2 = Router2();
    router2.use(authenticate);
    router2.get("/", getTasks);
    router2.post("/", createTask);
    router2.get("/:id", getTaskById);
    router2.put("/:id", updateTask);
    router2.delete("/:id", deleteTask);
    router2.patch("/:id/toggle", toggleTaskStatus);
    task_routes_default = router2;
  }
});

// server/src/controllers/budget.controller.ts
var getBudgets, createBudget, deleteBudget, getExpenses, createExpense, updateExpense, deleteExpense;
var init_budget_controller = __esm({
  "server/src/controllers/budget.controller.ts"() {
    init_db();
    getBudgets = async (req, res) => {
      try {
        const budgets = await db_default.budget.findMany({
          where: { userId: req.userId }
        });
        res.json(budgets);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    };
    createBudget = async (req, res) => {
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
            data: { ...req.body, spent }
          });
        } else {
          budget = await db_default.budget.create({
            data: { ...req.body, userId: req.userId, spent }
          });
        }
        res.status(201).json(budget);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    };
    deleteBudget = async (req, res) => {
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
    getExpenses = async (req, res) => {
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
    createExpense = async (req, res) => {
      try {
        const expense = await db_default.expense.create({
          data: {
            ...req.body,
            userId: req.userId,
            linkedTaskId: req.body.linkedTaskId || null
            // Explicitly handle linkedTaskId
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
          await db_default.budget.update({
            where: { id: budget.id },
            data: { spent: { increment: expense.amount } }
          });
        }
        res.status(201).json(expense);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    };
    updateExpense = async (req, res) => {
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
            linkedTaskId: req.body.linkedTaskId
            // Allow updating link
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
    deleteExpense = async (req, res) => {
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
  }
});

// server/src/routes/budget.routes.ts
import { Router as Router3 } from "express";
var router3, budget_routes_default;
var init_budget_routes = __esm({
  "server/src/routes/budget.routes.ts"() {
    init_budget_controller();
    init_auth_middleware();
    router3 = Router3();
    router3.use(authenticate);
    router3.get("/budgets", getBudgets);
    router3.post("/budgets", createBudget);
    router3.delete("/budgets/:id", deleteBudget);
    router3.get("/expenses", getExpenses);
    router3.post("/expenses", createExpense);
    router3.put("/expenses/:id", updateExpense);
    router3.delete("/expenses/:id", deleteExpense);
    budget_routes_default = router3;
  }
});

// server/src/controllers/insights.controller.ts
var getInsights, getRecommendations;
var init_insights_controller = __esm({
  "server/src/controllers/insights.controller.ts"() {
    init_db();
    init_types();
    getInsights = async (req, res) => {
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
            message: `Only \u20A6${availableFunds.toLocaleString()} remaining in budgets. ${incomeTasks.length > 0 ? `Prioritize ${incomeTasks.length} income task(s).` : "Consider adding income tasks."}`,
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
            message: `Pending expense tasks (\u20A6${pendingExpenses.toLocaleString()}) exceed available budget (\u20A6${availableFunds.toLocaleString()}). Shortfall: \u20A6${deficit.toLocaleString()}`,
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
                message: `Task is ${daysLate} day(s) overdue. Accrued fees: \u20A6${accruedFees.toLocaleString()}`,
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
              message: `You haven't engaged with this ${sub.frequency} subscription in over 60 days. Costs: \u20A6${sub.amount.toLocaleString()}/cycle.`,
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
              message: `${overdueTasks.length} tasks are overdue. Estimated cost of delay: \u20A6${potentialLoss.toLocaleString()}`,
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
            message: "You spent over \u20A650,000 on phone bills recently. Switching carriers could save you ~\u20A615,000/year.",
            actionable: true,
            suggestedAction: "Compare Data Plans",
            financialImpact: 15e3,
            createdAt: /* @__PURE__ */ new Date()
          });
        }
        res.json({ insights });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    };
    getRecommendations = async (req, res) => {
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
  }
});

// server/src/routes/insights.routes.ts
import { Router as Router4 } from "express";
var router4, insights_routes_default;
var init_insights_routes = __esm({
  "server/src/routes/insights.routes.ts"() {
    init_insights_controller();
    init_auth_middleware();
    router4 = Router4();
    router4.use(authenticate);
    router4.get("/", getInsights);
    router4.get("/recommendations", getRecommendations);
    insights_routes_default = router4;
  }
});

// server/src/services/pattern.service.ts
import { subDays, differenceInDays, addDays } from "date-fns";
var PatternDetectionService;
var init_pattern_service = __esm({
  "server/src/services/pattern.service.ts"() {
    init_db();
    PatternDetectionService = class {
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
              gte: subDays(/* @__PURE__ */ new Date(), 90)
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
  }
});

// server/src/controllers/pattern.controller.ts
var patternService, detectPatterns, getPatterns, confirmPattern, deletePattern;
var init_pattern_controller = __esm({
  "server/src/controllers/pattern.controller.ts"() {
    init_pattern_service();
    init_db();
    patternService = new PatternDetectionService();
    detectPatterns = async (req, res) => {
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
    getPatterns = async (req, res) => {
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
    confirmPattern = async (req, res) => {
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
    deletePattern = async (req, res) => {
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
  }
});

// server/src/routes/pattern.routes.ts
import { Router as Router5 } from "express";
var router5, pattern_routes_default;
var init_pattern_routes = __esm({
  "server/src/routes/pattern.routes.ts"() {
    init_auth_middleware();
    init_pattern_controller();
    router5 = Router5();
    router5.post("/detect", authenticate, detectPatterns);
    router5.get("/", authenticate, getPatterns);
    router5.patch("/:id/confirm", authenticate, confirmPattern);
    router5.delete("/:id", authenticate, deletePattern);
    pattern_routes_default = router5;
  }
});

// server/src/services/predictive.service.ts
import {
  getDaysInMonth,
  differenceInCalendarDays,
  lastDayOfMonth
} from "date-fns";
var PredictiveService;
var init_predictive_service = __esm({
  "server/src/services/predictive.service.ts"() {
    init_db();
    PredictiveService = class {
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
  }
});

// server/src/controllers/predictive.controller.ts
var predictiveService, getForecast;
var init_predictive_controller = __esm({
  "server/src/controllers/predictive.controller.ts"() {
    init_predictive_service();
    predictiveService = new PredictiveService();
    getForecast = async (req, res) => {
      try {
        const forecasts = await predictiveService.generateForecast(req.userId);
        res.json(forecasts);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    };
  }
});

// server/src/routes/predictive.routes.ts
import { Router as Router6 } from "express";
var router6, predictive_routes_default;
var init_predictive_routes = __esm({
  "server/src/routes/predictive.routes.ts"() {
    init_auth_middleware();
    init_predictive_controller();
    router6 = Router6();
    router6.get("/forecast", authenticate, getForecast);
    predictive_routes_default = router6;
  }
});

// server/src/controllers/project.controller.ts
var createProject, getProjects, getProject, updateProject, deleteProject, getProjectSummary;
var init_project_controller = __esm({
  "server/src/controllers/project.controller.ts"() {
    init_db();
    createProject = async (req, res) => {
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
    getProjects = async (req, res) => {
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
    getProject = async (req, res) => {
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
    updateProject = async (req, res) => {
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
    deleteProject = async (req, res) => {
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
    getProjectSummary = async (req, res) => {
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
  }
});

// server/src/routes/project.routes.ts
import express from "express";
var router7, project_routes_default;
var init_project_routes = __esm({
  "server/src/routes/project.routes.ts"() {
    init_auth_middleware();
    init_project_controller();
    router7 = express.Router();
    router7.use(authenticate);
    router7.post("/", createProject);
    router7.get("/", getProjects);
    router7.get("/:id", getProject);
    router7.put("/:id", updateProject);
    router7.delete("/:id", deleteProject);
    router7.get("/:id/summary", getProjectSummary);
    project_routes_default = router7;
  }
});

// server/src/controllers/stripe.controller.ts
import Stripe from "stripe";
async function handleSubscriptionCreated(session) {
  if (!session.customer || !session.subscription) return;
  const userId = session.metadata?.userId;
  if (!userId) return;
  await db_default.user.update({
    where: { id: userId },
    data: {
      subscriptionStatus: "PRO",
      subscriptionId: session.subscription,
      stripeCustomerId: session.customer
    }
  });
}
async function handlePaymentSucceeded(invoice) {
  if (!invoice.subscription) return;
  const subscription = await stripe.subscriptions.retrieve(
    invoice.subscription
  );
  const user = await db_default.user.findFirst({
    where: { stripeCustomerId: invoice.customer }
  });
  if (user) {
    await db_default.user.update({
      where: { id: user.id },
      data: {
        subscriptionStatus: "PRO",
        currentPeriodEnd: new Date(
          subscription.current_period_end * 1e3
        )
      }
    });
  }
}
async function handleSubscriptionDeleted(subscription) {
  const user = await db_default.user.findFirst({
    where: { stripeCustomerId: subscription.customer }
  });
  if (user) {
    await db_default.user.update({
      where: { id: user.id },
      data: {
        subscriptionStatus: "FREE",
        currentPeriodEnd: null
      }
    });
  }
}
var stripe, PRO_PRICE_ID, createCheckoutSession, createPortalSession, cancelSubscription, handleWebhook;
var init_stripe_controller = __esm({
  "server/src/controllers/stripe.controller.ts"() {
    init_db();
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
      apiVersion: "2026-01-28.clover"
      // Use latest API version available
    });
    PRO_PRICE_ID = process.env.STRIPE_PRO_PRICE_ID;
    createCheckoutSession = async (req, res) => {
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
        const priceId = PRO_PRICE_ID;
        if (!priceId) {
          console.error(
            "Stripe Error: PRO_PRICE_ID is missing in environment variables"
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
    createPortalSession = async (req, res) => {
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
    cancelSubscription = async (req, res) => {
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
          currentPeriodEnd: new Date(updatedSubscription.current_period_end * 1e3)
        });
      } catch (error) {
        console.error("Cancel Subscription Error:", error);
        res.status(500).json({ message: "Failed to cancel subscription", error: error.message });
      }
    };
    handleWebhook = async (req, res) => {
      const sig = req.headers["stripe-signature"];
      const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
      if (!sig || !endpointSecret) {
        return res.status(400).send("Missing signature or secret");
      }
      let event;
      try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      } catch (err) {
        console.error(`Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }
      switch (event.type) {
        case "checkout.session.completed":
          const session = event.data.object;
          await handleSubscriptionCreated(session);
          break;
        case "invoice.payment_succeeded":
          const invoice = event.data.object;
          await handlePaymentSucceeded(invoice);
          break;
        case "customer.subscription.deleted":
          const subscription = event.data.object;
          await handleSubscriptionDeleted(subscription);
          break;
        default:
          console.log(`Unhandled event type ${event.type}`);
      }
      res.json({ received: true });
    };
  }
});

// server/src/routes/stripe.routes.ts
import express2 from "express";
var router8, stripe_routes_default;
var init_stripe_routes = __esm({
  "server/src/routes/stripe.routes.ts"() {
    init_stripe_controller();
    init_auth_middleware();
    router8 = express2.Router();
    router8.post(
      "/create-checkout-session",
      authenticate,
      createCheckoutSession
    );
    router8.post("/create-portal-session", authenticate, createPortalSession);
    router8.post("/cancel-subscription", authenticate, cancelSubscription);
    stripe_routes_default = router8;
  }
});

// server/src/server.ts
import "dotenv/config";
import express3 from "express";
import cors from "cors";
var app, PORT, allowedOrigins, server_default;
var init_server = __esm({
  "server/src/server.ts"() {
    init_errorHandler();
    init_auth_routes();
    init_task_routes();
    init_budget_routes();
    init_insights_routes();
    init_pattern_routes();
    init_predictive_routes();
    init_project_routes();
    init_stripe_controller();
    init_stripe_routes();
    app = express3();
    PORT = process.env.PORT || 5e3;
    allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173,http://localhost:5174").split(",");
    app.use(
      cors({
        origin: (origin, callback) => {
          if (!origin || process.env.NODE_ENV === "production" || allowedOrigins.includes("*")) {
            return callback(null, true);
          }
          if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
          } else {
            console.log("CORS check failed for origin:", origin);
            callback(null, false);
          }
        },
        credentials: true
      })
    );
    app.use(express3.json());
    app.use(express3.urlencoded({ extended: true }));
    app.get("/health", (_req, res) => {
      res.json({
        status: "OK",
        message: "Server is running",
        timestamp: /* @__PURE__ */ new Date()
      });
    });
    app.post(
      "/api/stripe/webhook",
      express3.raw({ type: "application/json" }),
      handleWebhook
    );
    app.use("/api/auth", auth_routes_default);
    app.use("/api/tasks", task_routes_default);
    app.use("/api", budget_routes_default);
    app.use("/api/insights", insights_routes_default);
    app.use("/api/patterns", pattern_routes_default);
    app.use("/api", predictive_routes_default);
    app.use("/api/projects", project_routes_default);
    app.use("/api/stripe", stripe_routes_default);
    app.use(errorHandler);
    server_default = app;
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
import path from "path";
var require_app = __commonJS({
  "server/src/app.ts"() {
    init_server();
    var clientBuildPath = path.join(process.cwd(), "dist");
    server_default.use(express4.static(clientBuildPath));
    server_default.get("*", (req, res) => {
      if (req.path.startsWith("/api")) {
        res.status(404).json({ error: "API Route not found" });
        return;
      }
      res.sendFile(path.join(clientBuildPath, "index.html"));
    });
    var PORT2 = process.env.PORT || 5e3;
    server_default.listen(PORT2, () => {
      if (process.env.NODE_ENV === "production" && !process.env.VERCEL) {
        Promise.resolve().then(() => (init_reminder_job(), reminder_job_exports)).then(({ startReminderJob: startReminderJob2 }) => {
          startReminderJob2();
        }).catch((err) => console.error("Failed to load cron job:", err));
      }
      console.log(`
\u{1F680} Server is running on port ${PORT2}`);
    });
  }
});
export default require_app();
