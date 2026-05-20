import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../config/db";

export interface AuthRequest extends Request {
  userId?: string;
  userEmail?: string;
  user?: any; // typed via global declaration
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      res.status(401).json({ error: "No token provided" });
      return;
    }

    const jwtSecret = process.env.SUPABASE_JWT_SECRET;
    if (!jwtSecret) {
      res.status(500).json({ error: "Supabase JWT secret is not configured on the server" });
      return;
    }

    const decoded = jwt.verify(token, jwtSecret) as any;
    req.userId = decoded.sub; // Supabase stores the user UUID in the 'sub' field
    req.userEmail = decoded.email;

    // Fetch fresh user data for subscription status
    const user = await prisma.user.findUnique({
      where: { id: decoded.sub },
      select: {
        id: true,
        email: true,
        subscriptionStatus: true,
        stripeCustomerId: true,
        isSuspended: true,
      },
    });

    if (!user) {
      res.status(401).json({ error: "User not found" });
      return;
    }

    if (user.isSuspended) {
      res
        .status(403)
        .json({ error: "Your account is suspended. Please contact support." });
      return;
    }

    req.user = user;

    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};
