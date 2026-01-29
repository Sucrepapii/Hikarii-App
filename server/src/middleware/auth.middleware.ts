import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
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

    const decoded = verifyToken(token) as any;
    req.userId = decoded.userId;
    req.userEmail = decoded.email;

    // Fetch fresh user data for subscription status
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        subscriptionStatus: true,
        stripeCustomerId: true,
      },
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
