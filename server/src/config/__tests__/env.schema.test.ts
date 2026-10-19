import { describe, it, expect } from "vitest";
import { validateEnv, envSchema } from "../env.schema";
import { AppError } from "../../errors/AppError";

describe("Environment Schema Validation", () => {
  it("should parse and validate complete environment variables", () => {
    const validEnv = {
      NODE_ENV: "production",
      PORT: "8080",
      DATABASE_URL: "postgresql://user:pass@localhost:5432/db",
      JWT_SECRET: "this-is-a-valid-secure-jwt-secret-min-16",
      LOG_LEVEL: "info",
    };

    const parsed = validateEnv(validEnv);
    expect(parsed.PORT).toBe("8080");
    expect(parsed.NODE_ENV).toBe("production");
    expect(parsed.DATABASE_URL).toBe(validEnv.DATABASE_URL);
    expect(parsed.JWT_SECRET).toBe(validEnv.JWT_SECRET);
  });

  it("should throw AppError when DATABASE_URL is missing in non-test mode", () => {
    const incompleteEnv = {
      NODE_ENV: "development",
      JWT_SECRET: "this-is-a-valid-secure-jwt-secret-min-16",
    };

    expect(() => validateEnv(incompleteEnv)).toThrow(AppError);
    expect(() => validateEnv(incompleteEnv)).toThrow(/DATABASE_URL is required/);
  });

  it("should throw AppError when JWT_SECRET is too short", () => {
    const invalidJwtEnv = {
      NODE_ENV: "development",
      DATABASE_URL: "postgresql://user:pass@localhost:5432/db",
      JWT_SECRET: "short",
    };

    expect(() => validateEnv(invalidJwtEnv)).toThrow(AppError);
    expect(() => validateEnv(invalidJwtEnv)).toThrow(/JWT_SECRET must be at least 16 characters/);
  });

  it("should apply default PORT when omitted", () => {
    const envWithoutPort = {
      NODE_ENV: "development",
      DATABASE_URL: "postgresql://user:pass@localhost:5432/db",
      JWT_SECRET: "super-secret-key-that-is-long-enough",
    };

    const parsed = validateEnv(envWithoutPort);
    expect(parsed.PORT).toBe("5005");
  });
});
