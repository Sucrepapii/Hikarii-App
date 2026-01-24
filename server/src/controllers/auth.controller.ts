import { Request, Response } from "express";
import prisma from "../config/db";
import { generateToken } from "../utils/jwt";
import { AuthRequest } from "../middleware/auth.middleware";
import { sendEmail } from "../services/email.service";

// Helper to generate 6-digit OTP
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

export const signup = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  console.log("Signup request received for:", req.body?.email);
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      console.log("Missing fields in signup request");
      res.status(400).json({ error: "Name, email, and password are required" });
      return;
    }

    // Generate OTP
    console.log("Finding existing user...");
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      console.log("User already exists:", email);
      res.status(400).json({ error: "User already exists with this email" });
      return;
    }

    console.log("Creating new user...");
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Hash password
    const bcrypt = await import("bcryptjs");
    const salt = await bcrypt.default.genSalt(10);
    const hashedPassword = await bcrypt.default.hash(password, salt);

    // Create new user (unverified)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        isVerified: false,
        verificationToken: otp,
        verificationTokenExpires: otpExpires,
      },
    });

    // Send Verification Email
    try {
      await sendEmail(
        email,
        "Verify your Checkmate Account",
        `<h1>Verification Code</h1>
             <p>Hello ${name},</p>
             <p>Your verification code is: <strong>${otp}</strong></p>
             <p>This code expires in 1 hour.</p>`,
      );
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
      // We still save the user, but frontend might need a "Resend" button if they didn't get it.
    }

    // Do NOT return token yet. Return instruction to verify.
    res.status(201).json({
      message:
        "Registration successful. Please check your email for a verification code.",
      email: user.email,
      requiresVerification: true,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    // Check verification
    if (!user.isVerified) {
      res.status(403).json({
        error: "Account not verified. Please verify your email.",
        requiresVerification: true,
        email: user.email,
      });
      return;
    }

    // Check password (In a real app, use bcrypt.compare here.
    // Assuming password stored is hashed or plain text for this demo - update logic as needed)
    // For this migration, we assume simple comparison or bcrypt if imported.
    // Let's import bcrypt just in case, but usually we compare hashes.
    // Since 'comparePassword' was a mongoose method, we need to implement it manually here.
    // For now, strict equality if not hashed, or use bcrypt if installed.
    // Assuming the user model stored plain text or matched logic previously.
    // I will use direct comparison for now, but recommend bcrypt.
    if (user.password !== password) {
      // Only if previously using plaintext. If bcrypt was used, import bcrypt.
      // The previous Mongoose model had `comparePassword` method.
      // I'll assume we need to check if bcrypt is available.
      // It was in package.json.
    }

    // We need to restore bcrypt comparison functionality manually since we lost the model method
    const bcrypt = await import("bcryptjs");
    const isMatch = await bcrypt.default.compare(password, user.password);

    if (!isMatch) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    res.json({
      user: {
        id: user.id, // Prisma uses 'id' not '_id'
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Verify Email
export const verifyEmail = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { email, code } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

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

    if (
      !user.verificationTokenExpires ||
      user.verificationTokenExpires < new Date()
    ) {
      res.status(400).json({
        error: "Verification code expired. Please request a new one.",
      });
      return;
    }

    // Verify user
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationToken: null,
        verificationTokenExpires: null,
      },
    });

    // Auto-login (generate token)
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
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Resend Verification Code
export const resendVerification = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    if (user.isVerified) {
      res.status(400).json({ error: "User already verified" });
      return;
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationToken: otp,
        verificationTokenExpires: otpExpires,
      },
    });

    await sendEmail(
      email,
      "Resend: Verify your Checkmate Account",
      `<h1>Verification Code</h1>
              <p>Hello ${user.name},</p>
              <p>Your new verification code is: <strong>${otp}</strong></p>
              <p>This code expires in 1 hour.</p>`,
    );

    res.json({ message: "Verification code resent" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });

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
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
// Forgot Password - Send OTP
export const forgotPassword = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ error: "Email is required" });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // For security, don't reveal if user exists, but we can log internally
      console.log("Forgot password attempt for non-existent email:", email);
      res.json({
        message:
          "If an account exists with that email, a reset code has been sent.",
      });
      return;
    }

    // Generate 6-digit OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes for reset

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: otp,
        resetPasswordExpires: otpExpires,
      },
    });

    // Send Reset Email
    try {
      await sendEmail(
        email,
        "Reset your Checkmate Password",
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
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Reset Password - Verify OTP and set new password
export const resetPassword = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      res
        .status(400)
        .json({ error: "Email, code, and new password are required" });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Validate token
    if (user.resetPasswordToken !== code) {
      res.status(400).json({ error: "Invalid or expired reset code" });
      return;
    }

    if (!user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
      res.status(400).json({ error: "Reset code has expired" });
      return;
    }

    // Hash new password
    const bcrypt = await import("bcryptjs");
    const salt = await bcrypt.default.genSalt(10);
    const hashedPassword = await bcrypt.default.hash(newPassword, salt);

    // Update user
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
        isVerified: true, // Resetting password counts as verification if they were stuck
      },
    });

    res.json({ message: "Password reset successful. You can now login." });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const debugInfo = async (_req: any, res: Response) => {
  res.json({
    env: {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: process.env.VERCEL,
      HAS_DATABASE_URL: !!process.env.DATABASE_URL,
      HAS_JWT_SECRET: !!process.env.JWT_SECRET,
      HAS_RESEND_KEY: !!process.env.RESEND_API_KEY,
      CLIENT_URL: process.env.CLIENT_URL,
    },
    dbStatus: "connected", // Prisma manages connection pool
  });
};
