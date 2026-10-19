import { z } from "zod";
import { AppError } from "../errors/AppError";

export const envSchema = z.object({
  PORT: z.string().default("5005"),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error", "silent"]).default("info"),
  DATABASE_URL: z
    .string({ required_error: "DATABASE_URL is required for database operations" })
    .min(1, "DATABASE_URL is required for database operations"),
  JWT_SECRET: z
    .string({ required_error: "JWT_SECRET is required" })
    .min(16, "JWT_SECRET must be at least 16 characters for secure signing"),
  CLIENT_URL: z.string().optional(),
  FRONTEND_URL: z.string().optional(),
  DIRECT_URL: z.string().optional(),
  ADMIN_EMAIL: z.string().email().optional(),
  REDIS_URL: z.string().optional(),
  SENTRY_DSN: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GEMINI_API_KEY: z.string().optional(),
  VERCEL: z.string().optional(),
});

export type EnvConfig = z.infer<typeof envSchema>;

/**
 * Validates process.env variables against envSchema.
 * Throws a formatted AppError if required environment configuration is missing.
 */
export function validateEnv(rawEnv: Record<string, string | undefined> = process.env): EnvConfig {
  const isTest = rawEnv.NODE_ENV === "test";
  const envToValidate = {
    ...rawEnv,
    DATABASE_URL:
      rawEnv.DATABASE_URL ||
      (isTest ? "postgresql://postgres:postgres@localhost:5432/test?schema=public" : undefined),
    JWT_SECRET:
      rawEnv.JWT_SECRET || (isTest ? "test-jwt-secret-min-16-characters-long" : undefined),
  };

  const result = envSchema.safeParse(envToValidate);

  if (!result.success) {
    const errorDetails = result.error.issues.map(
      (issue) => `${issue.path.join(".")}: ${issue.message}`
    );
    const errorMessage = `Environment validation failed:\n  - ${errorDetails.join("\n  - ")}`;

    throw new AppError(errorMessage, 500, { missingOrInvalidVars: errorDetails });
  }

  return result.data;
}

export default validateEnv;
