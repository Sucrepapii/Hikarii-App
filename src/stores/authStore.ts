import { create } from "zustand";
import apiClient from "../api/client";

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  role: "USER" | "ADMIN";
  subscriptionStatus?: "FREE" | "PRO" | "TRIAL";
  stripeCustomerId?: string;
  currentPeriodEnd?: string | Date; // Or just string if serialised
  requiresPasswordChange?: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<any>;
  verifyEmail: (email: string, code: string) => Promise<void>;
  resendCode: (email: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (
    email: string,
    code: string,
    newPassword: string,
  ) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: JSON.parse(localStorage.getItem("auth-user") || "null"),
  token: localStorage.getItem("auth-token"),
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await apiClient.post("/auth/login", { email, password });
      const { user, token } = response.data;

      localStorage.setItem("auth-token", token);
      localStorage.setItem("auth-user", JSON.stringify(user));

      set({ user, token, isLoading: false });
    } catch (error: any) {
      const message = error.response?.data?.error || "Login failed";
      set({ error: message, isLoading: false });
      throw {
        message,
        requiresVerification: error.response?.data?.requiresVerification,
        email: error.response?.data?.email,
      };
    }
  },

  signup: async (name: string, email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await apiClient.post("/auth/signup", {
        name,
        email,
        password,
      });

      // If verification required, don't set user/token yet
      if (response.data.requiresVerification) {
        set({ isLoading: false });
        return response.data; // Return data so component knows to switch to OTP mode
      }

      const { user, token } = response.data;

      localStorage.setItem("auth-token", token);
      localStorage.setItem("auth-user", JSON.stringify(user));

      set({ user, token, isLoading: false });
    } catch (error: any) {
      const message = error.response?.data?.error || "Signup failed";
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  verifyEmail: async (email: string, code: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await apiClient.post("/auth/verify-email", {
        email,
        code,
      });
      const { user, token } = response.data;

      localStorage.setItem("auth-token", token);
      localStorage.setItem("auth-user", JSON.stringify(user));

      set({ user, token, isLoading: false });
    } catch (error: any) {
      const message = error.response?.data?.error || "Verification failed";
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  resendCode: async (email: string) => {
    try {
      set({ isLoading: true, error: null });
      await apiClient.post("/auth/resend-verification", { email });
      set({ isLoading: false });
    } catch (error: any) {
      const message = error.response?.data?.error || "Resend failed";
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  forgotPassword: async (email: string) => {
    try {
      set({ isLoading: true, error: null });
      await apiClient.post("/auth/forgot-password", { email });
      set({ isLoading: false });
    } catch (error: any) {
      const message =
        error.response?.data?.error || "Forgot password request failed";
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  resetPassword: async (email: string, code: string, newPassword: string) => {
    try {
      set({ isLoading: true, error: null });
      await apiClient.post("/auth/reset-password", {
        email,
        code,
        newPassword,
      });
      set({ isLoading: false });
    } catch (error: any) {
      const message = error.response?.data?.error || "Reset password failed";
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  logout: () => {
    localStorage.removeItem("auth-token");
    localStorage.removeItem("auth-user");
    set({ user: null, token: null, error: null });
  },

  checkAuth: async () => {
    const token = localStorage.getItem("auth-token");
    if (!token) {
      set({ user: null, token: null });
      return;
    }

    try {
      const response = await apiClient.get("/auth/me");
      const { user } = response.data;
      set({ user });
    } catch (error) {
      // Token invalid, clear auth
      localStorage.removeItem("auth-token");
      localStorage.removeItem("auth-user");
      set({ user: null, token: null });
    }
  },
}));
