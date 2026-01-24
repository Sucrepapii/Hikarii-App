import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  // Log the full error to Railway console for debugging
  console.error("🚨 Server Error:", err.stack || err);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Sanitize technical errors for production
  if (process.env.NODE_ENV === "production" || !process.env.VERCEL) {
    if (err.code && err.code.startsWith("P")) {
      // Prisma Error
      console.log("Caught technical database error:", err.code);
      message =
        "Signup failed: A database error occurred. Please try again later.";
      statusCode = 500;
    } else if (err.message && err.message.includes("invocation:")) {
      // General Prisma/ORM leak
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
