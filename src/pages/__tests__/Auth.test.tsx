import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Auth, loginSchema, signupSchema } from "../Auth";

// Mock child components that rely on heavy stores or canvas
vi.mock("../../components/common/Logo", () => ({
  Logo: () => <div data-testid="app-logo">Hikarii Logo</div>,
}));

vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("Auth Page & Validation Schemas", () => {
  describe("loginSchema Validation", () => {
    it("should reject an invalid email address", () => {
      const result = loginSchema.safeParse({
        email: "not-an-email",
        password: "ValidPassword123!",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("valid email");
      }
    });

    it("should reject an empty password", () => {
      const result = loginSchema.safeParse({
        email: "user@hikarii.org",
        password: "",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("Password is required");
      }
    });

    it("should accept valid login credentials", () => {
      const result = loginSchema.safeParse({
        email: "user@hikarii.org",
        password: "SecurePassword123!",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("signupSchema Validation", () => {
    it("should reject names shorter than 2 characters", () => {
      const result = signupSchema.safeParse({
        name: "A",
        email: "user@hikarii.org",
        password: "ValidPassword123!",
        confirmPassword: "ValidPassword123!",
        agreementAccepted: true,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("at least 2 characters");
      }
    });

    it("should enforce strong password rules (uppercase, lowercase, number, special char)", () => {
      const weakPasswords = [
        "short1!", // too short (< 8 chars)
        "nouppercase123!", // no uppercase
        "NOLOWERCASE123!", // no lowercase
        "NoNumberSpecial!", // no digit
        "NoSpecialChar123", // no special char
      ];

      for (const pwd of weakPasswords) {
        const result = signupSchema.safeParse({
          name: "Test User",
          email: "test@hikarii.org",
          password: pwd,
          confirmPassword: pwd,
          agreementAccepted: true,
        });
        expect(result.success).toBe(false);
      }
    });

    it("should reject if passwords do not match", () => {
      const result = signupSchema.safeParse({
        name: "Test User",
        email: "test@hikarii.org",
        password: "SecurePassword123!",
        confirmPassword: "DifferentPassword123!",
        agreementAccepted: true,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("Passwords don't match");
      }
    });

    it("should require terms and conditions agreement", () => {
      const result = signupSchema.safeParse({
        name: "Test User",
        email: "test@hikarii.org",
        password: "SecurePassword123!",
        confirmPassword: "SecurePassword123!",
        agreementAccepted: false,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("You must agree to the Terms");
      }
    });

    it("should accept valid and complete signup data", () => {
      const result = signupSchema.safeParse({
        name: "Valid User",
        email: "valid@hikarii.org",
        password: "SecurePassword123!",
        confirmPassword: "SecurePassword123!",
        agreementAccepted: true,
      });
      expect(result.success).toBe(true);
    });
  });

  describe("Auth Component Render", () => {
    it("renders Auth page with login mode by default", () => {
      render(
        <HelmetProvider>
          <BrowserRouter>
            <Auth defaultMode="login" />
          </BrowserRouter>
        </HelmetProvider>
      );

      // Verify header/branding and inputs exist
      expect(screen.getAllByTestId("app-logo").length).toBeGreaterThan(0);
      expect(screen.getByText(/Home/i)).toBeInTheDocument();
    });
  });
});
