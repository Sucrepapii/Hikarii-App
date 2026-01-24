import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  console.error("Error:", err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // TEMPORARY DEBUGGING: Always show full error details
  res.status(statusCode).json({
    error: {
      message: message,
      code: statusCode,
      details: err,
      stack: err.stack,
    },
  });
};
