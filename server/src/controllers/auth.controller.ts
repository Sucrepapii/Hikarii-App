import { Response } from "express";
import { User } from "../models/User";
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
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // If user exists but NOT verified, we could resend code, but for security/simplicity
      // let's say "User exists" unless we want to handle that edge case specifically.
      // Or if unverified, we could overwrite? Let's stick to standard "exists".
      res.status(400).json({ error: "User already exists with this email" });
      return;
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Create new user (unverified)
    const user = await User.create({
      name,
      email,
      password,
      isVerified: false,
      verificationToken: otp,
      verificationTokenExpires: otpExpires,
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

    // Find user and include password
    const user = await User.findOne({ email }).select("+password");
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

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    // Generate token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
    });

    res.json({
      user: {
        id: user._id,
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

    const user = await User.findOne({ email });

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
      res
        .status(400)
        .json({
          error: "Verification code expired. Please request a new one.",
        });
      return;
    }

    // Verify user
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    // Auto-login (generate token)
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
    });

    res.json({
      message: "Email verified successfully",
      user: {
        id: user._id,
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
    const user = await User.findOne({ email });

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

    user.verificationToken = otp;
    user.verificationTokenExpires = otpExpires;
    await user.save();

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
    const user = await User.findById(req.userId);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
