import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import prisma from "../config/db";

export interface AuthRequest extends Request {
  userId?: string;
  userEmail?: string;
  user?: any;
}

// Use Supabase's JWKS endpoint to get the public key for ES256 token verification
const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://kcwcdkanpmonimcdzeix.supabase.co";
const jwks = jwksClient({
  jwksUri: `${supabaseUrl}/auth/v1/.well-known/jwks.json`,
  cache: true,
  cacheMaxEntries: 5,
  cacheMaxAge: 600000, // 10 minutes
  rateLimit: true,
});

function getSigningKey(
  header: jwt.JwtHeader,
  callback: jwt.SigningKeyCallback,
) {
  jwks.getSigningKey(header.kid, (err, key) => {
    if (err) {
      console.error("[JWKS] Failed to get signing key:", err);
      return callback(err);
    }
    const signingKey = key?.getPublicKey();
    callback(null, signingKey);
  });
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

    // Verify the Supabase JWT using the JWKS public key (supports ES256 and HS256)
    const decoded = await new Promise<any>((resolve, reject) => {
      jwt.verify(token, getSigningKey, { algorithms: ["ES256", "HS256"] }, (err, payload) => {
        if (err) return reject(err);
        resolve(payload);
      });
    });

    req.userId = decoded.sub;
    req.userEmail = decoded.email;

    // Fetch fresh user data for subscription status
    let user = await prisma.user.findUnique({
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
      // Just-in-Time (JIT) provisioning from the verified Supabase JWT token
      const name = decoded.user_metadata?.name || decoded.email?.split("@")[0] || "User";
      user = await prisma.user.create({
        data: {
          id: decoded.sub,
          email: decoded.email || "",
          name: name,
          isVerified: true,
        },
        select: {
          id: true,
          email: true,
          subscriptionStatus: true,
          stripeCustomerId: true,
          isSuspended: true,
        },
      });
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
    console.error("[Auth Middleware Error]:", error);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};
