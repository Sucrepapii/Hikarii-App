var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) =>
  function __init() {
    return (fn && (res = (0, fn[__getOwnPropNames(fn)[0]])((fn = 0))), res);
  };
var __commonJS = (cb, mod) =>
  function __require() {
    return (
      mod ||
        (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod),
      mod.exports
    );
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
          message =
            "Signup failed: A database error occurred. Please try again later.";
          statusCode = 500;
        } else if (err.message && err.message.includes("invocation:")) {
          message =
            "Signup failed: Server configuration issue. Please contact support.";
          statusCode = 500;
        }
      }
      res.status(statusCode).json({
        error: message,
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
      });
    };
  },
});

// server/src/config/db.ts
import { PrismaClient } from "@prisma/client";
var prisma, db_default;
var init_db = __esm({
  "server/src/config/db.ts"() {
    prisma = new PrismaClient();
    db_default = prisma;
  },
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
        expiresIn: JWT_EXPIRES_IN,
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
  },
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
          html,
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
  },
});

// server/src/controllers/auth.controller.ts
var generateOTP,
  signup,
  login,
  verifyEmail,
  resendVerification,
  getMe,
  forgotPassword,
  resetPassword,
  debugInfo;
var init_auth_controller = __esm({
  "server/src/controllers/auth.controller.ts"() {
    init_db();
    init_jwt();
    init_email_service();
    generateOTP = () => Math.floor(1e5 + Math.random() * 9e5).toString();
    signup = async (req, res) => {
      console.log("Signup request received for:", req.body?.email);
      try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
          console.log("Missing fields in signup request");
          res
            .status(400)
            .json({ error: "Name, email, and password are required" });
          return;
        }
        console.log("Finding existing user...");
        const existingUser = await db_default.user.findUnique({
          where: { email },
        });
        if (existingUser) {
          console.log("User already exists:", email);
          res
            .status(400)
            .json({ error: "User already exists with this email" });
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
            verificationTokenExpires: otpExpires,
          },
        });
        try {
          await sendEmail(
            email,
            "Verify your HikariAccount",
            `<h1>Verification Code</h1>
             <p>Hello ${name},</p>
             <p>Your verification code is: <strong>${otp}</strong></p>
             <p>This code expires in 1 hour.</p>`,
          );
        } catch (emailError) {
          console.error("Failed to send verification email:", emailError);
        }
        res.status(201).json({
          message:
            "Registration successful. Please check your email for a verification code.",
          email: user.email,
          requiresVerification: true,
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
            email: user.email,
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
          email: user.email,
        });
        res.json({
          user: {
            id: user.id,
            // Prisma uses 'id' not '_id'
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
          },
          token,
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
          res
            .status(400)
            .json({ error: "User already verified. Please login." });
          return;
        }
        if (user.verificationToken !== code) {
          res.status(400).json({ error: "Invalid verification code" });
          return;
        }
        if (
          !user.verificationTokenExpires ||
          user.verificationTokenExpires < /* @__PURE__ */ new Date()
        ) {
          res.status(400).json({
            error: "Verification code expired. Please request a new one.",
          });
          return;
        }
        await db_default.user.update({
          where: { id: user.id },
          data: {
            isVerified: true,
            verificationToken: null,
            verificationTokenExpires: null,
          },
        });
        const token = generateToken({
          userId: user.id,
          email: user.email,
        });
        res.json({
          message: "Email verified successfully",
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
          },
          token,
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
            verificationTokenExpires: otpExpires,
          },
        });
        await sendEmail(
          email,
          "Resend: Verify your HikariAccount",
          `<h1>Verification Code</h1>
              <p>Hello ${user.name},</p>
              <p>Your new verification code is: <strong>${otp}</strong></p>
              <p>This code expires in 1 hour.</p>`,
        );
        res.json({ message: "Verification code resent" });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    };
    getMe = async (req, res) => {
      try {
        const user = await db_default.user.findUnique({
          where: { id: req.userId },
        });
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
          },
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
            message:
              "If an account exists with that email, a reset code has been sent.",
          });
          return;
        }
        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 15 * 60 * 1e3);
        await db_default.user.update({
          where: { id: user.id },
          data: {
            resetPasswordToken: otp,
            resetPasswordExpires: otpExpires,
          },
        });
        try {
          await sendEmail(
            email,
            "Reset your HikariPassword",
            `<h1>Password Reset Code</h1>
               <p>Hello ${user.name},</p>
               <p>Your password reset code is: <strong>${otp}</strong></p>
               <p>This code expires in 15 minutes.</p>
               <p>If you did not request this, please ignore this email.</p>`,
          );
        } catch (emailError) {
          console.error("Failed to send reset email:", emailError);
        }
        res.json({
          message:
            "If an account exists with that email, a reset code has been sent.",
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    };
    resetPassword = async (req, res) => {
      try {
        const { email, code, newPassword } = req.body;
        if (!email || !code || !newPassword) {
          res
            .status(400)
            .json({ error: "Email, code, and new password are required" });
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
        if (
          !user.resetPasswordExpires ||
          user.resetPasswordExpires < /* @__PURE__ */ new Date()
        ) {
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
            isVerified: true,
            // Resetting password counts as verification if they were stuck
          },
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
          CLIENT_URL: process.env.CLIENT_URL,
        },
        dbStatus: "connected",
        // Prisma manages connection pool
      });
    };
  },
});

// server/src/middleware/auth.middleware.ts
var authenticate;
var init_auth_middleware = __esm({
  "server/src/middleware/auth.middleware.ts"() {
    init_jwt();
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
        next();
      } catch (error) {
        res.status(401).json({ error: "Invalid or expired token" });
      }
    };
  },
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
  },
});

// server/src/models/types.ts
var init_types = __esm({
  "server/src/models/types.ts"() {},
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
          orderBy: { createdAt: "desc" },
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
            userId: req.userId,
          },
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
            userId: req.userId,
          },
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
          where: { id: req.params.id, userId: req.userId },
        });
        if (!existingTask) {
          res.status(404).json({ error: "Task not found" });
          return;
        }
        const task = await db_default.task.update({
          where: { id: req.params.id },
          data: req.body,
        });
        res.json(task);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    };
    deleteTask = async (req, res) => {
      try {
        const existingTask = await db_default.task.findFirst({
          where: { id: req.params.id, userId: req.userId },
        });
        if (!existingTask) {
          res.status(404).json({ error: "Task not found" });
          return;
        }
        await db_default.task.delete({
          where: { id: req.params.id },
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
            userId: req.userId,
          },
        });
        if (!task) {
          res.status(404).json({ error: "Task not found" });
          return;
        }
        const newStatus =
          task.status === "COMPLETED" /* COMPLETED */
            ? "TODO" /* TODO */
            : "COMPLETED"; /* COMPLETED */
        const updatedTask = await db_default.task.update({
          where: { id: task.id },
          data: { status: newStatus },
        });
        res.json(updatedTask);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    };
  },
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
  },
});

// server/src/controllers/budget.controller.ts
var getBudgets,
  createBudget,
  deleteBudget,
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense;
var init_budget_controller = __esm({
  "server/src/controllers/budget.controller.ts"() {
    init_db();
    getBudgets = async (req, res) => {
      try {
        const budgets = await db_default.budget.findMany({
          where: { userId: req.userId },
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
            category: req.body.category,
          },
        });
        const spent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
        const existingBudget = await db_default.budget.findUnique({
          where: {
            userId_category: {
              userId: req.userId,
              category: req.body.category,
            },
          },
        });
        let budget;
        if (existingBudget) {
          budget = await db_default.budget.update({
            where: { id: existingBudget.id },
            data: { ...req.body, spent },
          });
        } else {
          budget = await db_default.budget.create({
            data: { ...req.body, userId: req.userId, spent },
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
          where: { id: req.params.id, userId: req.userId },
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
          orderBy: { date: "desc" },
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
          },
        });
        const budget = await db_default.budget.findUnique({
          where: {
            userId_category: {
              userId: req.userId,
              category: expense.category,
            },
          },
        });
        if (budget) {
          await db_default.budget.update({
            where: { id: budget.id },
            data: { spent: { increment: expense.amount } },
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
            userId: req.userId,
          },
        });
        if (!existingExpense) {
          res.status(404).json({ error: "Expense not found" });
          return;
        }
        const updatedExpense = await db_default.expense.update({
          where: { id: req.params.id },
          data: req.body,
        });
        if (
          existingExpense.amount !== updatedExpense.amount ||
          existingExpense.category !== updatedExpense.category
        ) {
          const oldBudget = await db_default.budget.findUnique({
            where: {
              userId_category: {
                userId: req.userId,
                category: existingExpense.category,
              },
            },
          });
          if (oldBudget) {
            await db_default.budget.update({
              where: { id: oldBudget.id },
              data: { spent: { decrement: existingExpense.amount } },
            });
          }
          const newBudget = await db_default.budget.findUnique({
            where: {
              userId_category: {
                userId: req.userId,
                category: updatedExpense.category,
              },
            },
          });
          if (newBudget) {
            await db_default.budget.update({
              where: { id: newBudget.id },
              data: { spent: { increment: updatedExpense.amount } },
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
          where: { id: req.params.id, userId: req.userId },
        });
        if (!existingExpense) {
          res.status(404).json({ error: "Expense not found" });
          return;
        }
        const deletedExpense = await db_default.expense.delete({
          where: { id: req.params.id },
        });
        const budget = await db_default.budget.findUnique({
          where: {
            userId_category: {
              userId: req.userId,
              category: deletedExpense.category,
            },
          },
        });
        if (budget) {
          await db_default.budget.update({
            where: { id: budget.id },
            data: { spent: { decrement: deletedExpense.amount } },
          });
        }
        res.json({ message: "Expense deleted successfully" });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    };
  },
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
  },
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
          db_default.budget.findMany({ where: { userId: req.userId } }),
        ]);
        const insights = [];
        const availableFunds = budgets.reduce(
          (sum, b) => sum + (b.limit - b.spent),
          0,
        );
        if (availableFunds < 1e4) {
          const incomeTasks = tasks.filter(
            (t) =>
              t.financials?.type === "INCOME" /* INCOME */ &&
              t.status !== "COMPLETED" /* COMPLETED */,
          );
          insights.push({
            id: `cashflow-${Date.now()}`,
            type: "CASH_FLOW_ALERT",
            priority: "CRITICAL",
            title: "Low Cash Flow Alert",
            message: `Only \u20A6${availableFunds.toLocaleString()} remaining in budgets. ${incomeTasks.length > 0 ? `Prioritize ${incomeTasks.length} income task(s).` : "Consider adding income tasks."}`,
            actionable: incomeTasks.length > 0,
            suggestedAction:
              incomeTasks.length > 0
                ? "Focus on income-generating tasks"
                : void 0,
            financialImpact: availableFunds,
            createdAt: /* @__PURE__ */ new Date(),
          });
        }
        const pendingExpenses = tasks
          .filter(
            (t) =>
              t.financials?.type === "EXPENSE" /* EXPENSE */ &&
              t.status !== "COMPLETED" /* COMPLETED */,
          )
          .reduce((sum, t) => {
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
            suggestedAction:
              "Postpone low-priority expense tasks or increase budget",
            financialImpact: -deficit,
            createdAt: /* @__PURE__ */ new Date(),
          });
        }
        const now = /* @__PURE__ */ new Date();
        tasks.forEach((task) => {
          if (
            task.financials?.lateFeePerDay &&
            task.dueDate &&
            task.status !== "COMPLETED" /* COMPLETED */
          ) {
            const dueDate = new Date(task.dueDate);
            const isOverdue = dueDate < now;
            if (isOverdue) {
              const daysLate = Math.ceil(
                (now.getTime() - dueDate.getTime()) / (1e3 * 60 * 60 * 24),
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
                createdAt: now,
              });
            }
          }
        });
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
              status: { not: "COMPLETED" /* COMPLETED */ },
            },
          }),
        ]);
        const recommendations = tasks
          .map((task) => {
            let score = 0;
            const priorityScores = {
              LOW: 10,
              MEDIUM: 30,
              HIGH: 60,
              URGENT: 90,
            };
            score += priorityScores[task.priority] || 0;
            if (task.dueDate) {
              const daysUntilDue = Math.ceil(
                (new Date(task.dueDate).getTime() - Date.now()) /
                  (1e3 * 60 * 60 * 24),
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
              urgencyScore: Math.min(100, score),
            };
          })
          .filter((r) => r.urgencyScore > 50)
          .sort((a, b) => b.urgencyScore - a.urgencyScore)
          .slice(0, 5);
        res.json({ recommendations });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    };
  },
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
  },
});

// server/src/server.ts
import express from "express";
import cors from "cors";
import dotenv2 from "dotenv";
var app, PORT, allowedOrigins, server_default;
var init_server = __esm({
  "server/src/server.ts"() {
    init_errorHandler();
    init_auth_routes();
    init_task_routes();
    init_budget_routes();
    init_insights_routes();
    dotenv2.config();
    app = express();
    PORT = process.env.PORT || 5e3;
    allowedOrigins = (
      process.env.CLIENT_URL || "http://localhost:5173,http://localhost:5174"
    ).split(",");
    app.use(
      cors({
        origin: (origin, callback) => {
          if (
            !origin ||
            process.env.NODE_ENV === "production" ||
            allowedOrigins.includes("*")
          ) {
            return callback(null, true);
          }
          if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
          } else {
            console.log("CORS check failed for origin:", origin);
            callback(null, false);
          }
        },
        credentials: true,
      }),
    );
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.get("/health", (_req, res) => {
      res.json({
        status: "OK",
        message: "Server is running",
        timestamp: /* @__PURE__ */ new Date(),
      });
    });
    app.use("/api/auth", auth_routes_default);
    app.use("/api/tasks", task_routes_default);
    app.use("/api", budget_routes_default);
    app.use("/api/insights", insights_routes_default);
    app.use(errorHandler);
    server_default = app;
  },
});

// server/src/jobs/reminder.job.ts
var reminder_job_exports = {};
__export(reminder_job_exports, {
  startReminderJob: () => startReminderJob,
});
import cron from "node-cron";
var startReminderJob;
var init_reminder_job = __esm({
  "server/src/jobs/reminder.job.ts"() {
    init_db();
    init_email_service();
    startReminderJob = () => {
      if (process.env.VERCEL) {
        console.log(
          "Cron jobs are not supported on Vercel Serverless. Skipping...",
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
                dueDate: { lt: today },
              },
            });
            if (overdueTasks.length > 0) {
              const taskListHtml = overdueTasks
                .map(
                  (t) =>
                    `<li><strong>${t.title}</strong> (Due: ${t.dueDate ? new Date(t.dueDate).toLocaleDateString() : "No date"})</li>`,
                )
                .join("");
              const html = `
                        <h2>Action Required: Overdue Tasks</h2>
                        <p>Hello ${user.name},</p>
                        <p>You have <strong>${overdueTasks.length}</strong> task(s) that are past their due date:</p>
                        <ul>
                            ${taskListHtml}
                        </ul>
                        <p>Please log in to Hikarito update your progress.</p>
                        <br/>
                        <p>Best,<br/>HikariTeam</p>
                    `;
              await sendEmail(
                user.email,
                `Overdue Tasks Alert (${overdueTasks.length})`,
                html,
              );
            }
          }
        } catch (error) {
          console.error("Error in reminder job:", error);
        }
      });
    };
  },
});

// server/src/app.ts
import express2 from "express";
import path from "path";
var require_app = __commonJS({
  "server/src/app.ts"() {
    init_server();
    var clientBuildPath = path.join(process.cwd(), "dist");
    server_default.use(express2.static(clientBuildPath));
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
        Promise.resolve()
          .then(() => (init_reminder_job(), reminder_job_exports))
          .then(({ startReminderJob: startReminderJob2 }) => {
            startReminderJob2();
          })
          .catch((err) => console.error("Failed to load cron job:", err));
      }
      console.log(`
\u{1F680} Server is running on port ${PORT2}`);
    });
  },
});
export default require_app();
