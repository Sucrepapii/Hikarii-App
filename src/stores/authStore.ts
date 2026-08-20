import { create } from "zustand";
import { supabase } from "../supabase/client";
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
  phoneNumber?: string;
  waTasksEnabled?: boolean;
  waBudgetEnabled?: boolean;
  waProjectsEnabled?: boolean;
  requiresPasswordChange?: boolean;
}

export const hasProAccess = (user?: User | null): boolean => {
  if (!user) return false;
  return user.role === "ADMIN" || user.subscriptionStatus === "PRO" || user.subscriptionStatus === "TRIAL";
};

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    name: string,
    email: string,
    password: string,
    phoneNumber: string,
  ) => Promise<any>;
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

export const useAuthStore = create<AuthState>((set, get) => {
  // Set up auth state change listener to sync token in local ZUSTAND state
  supabase.auth.onAuthStateChange(async (event, session) => {
    if (session) {
      set({ token: session.access_token });
      // If we don't have user info yet in Zustand, fetch it from custom API
      if (!get().user) {
        try {
          const response = await apiClient.get("/auth/me");
          const { user } = response.data;
          localStorage.setItem("auth-user", JSON.stringify(user));
          set({ user });
        } catch (err) {
          console.error("Failed to load user profile on auth change:", err);
        }
      }
    } else {
      localStorage.removeItem("auth-user");
      set({ user: null, token: null });
    }
  });

  return {
    user: JSON.parse(localStorage.getItem("auth-user") || "null"),
    token: null,
    isLoading: false,
    error: null,

    login: async (email: string, password: string) => {
      try {
        set({ isLoading: true, error: null });
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          if (error.message.includes("Email not confirmed")) {
            throw {
              message: "Email not confirmed. Please verify your email.",
              requiresVerification: true,
              email,
            };
          }
          throw error;
        }

        // Fetch custom user profile info from Express backend (sync table)
        const response = await apiClient.get("/auth/me");
        const { user } = response.data;

        localStorage.setItem("auth-user", JSON.stringify(user));
        set({ user, token: data.session?.access_token || null, isLoading: false });
      } catch (error: any) {
        const message = error.message || "Login failed";
        set({ error: message, isLoading: false });
        if (error.requiresVerification) {
          throw error;
        }
        throw new Error(message);
      }
    },

    signup: async (
      name: string,
      email: string,
      password: string,
      phoneNumber: string,
    ) => {
      try {
        set({ isLoading: true, error: null });
        
        // Register in Supabase and send user metadata for database triggers to consume
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
              phone_number: phoneNumber,
            },
          },
        });

        if (error) throw error;

        // If email confirmation is required, Supabase returns a user but session is null
        const session = data.session;
        if (!session) {
          set({ isLoading: false });
          return { requiresVerification: true, email };
        }

        // Fetch custom user profile info from backend
        const response = await apiClient.get("/auth/me");
        const { user } = response.data;

        localStorage.setItem("auth-user", JSON.stringify(user));
        set({ user, token: session.access_token, isLoading: false });
        return { requiresVerification: false, user };
      } catch (error: any) {
        const message = error.message || "Signup failed";
        set({ error: message, isLoading: false });
        throw new Error(message);
      }
    },

    verifyEmail: async (email: string, code: string) => {
      try {
        set({ isLoading: true, error: null });
        const { data, error } = await supabase.auth.verifyOtp({
          email,
          token: code,
          type: "signup",
        });

        if (error) throw error;

        const response = await apiClient.get("/auth/me");
        const { user } = response.data;

        localStorage.setItem("auth-user", JSON.stringify(user));
        set({ user, token: data.session?.access_token || null, isLoading: false });
      } catch (error: any) {
        const message = error.message || "Verification failed";
        set({ error: message, isLoading: false });
        throw new Error(message);
      }
    },

    resendCode: async (email: string) => {
      try {
        set({ isLoading: true, error: null });
        const { error } = await supabase.auth.resend({
          type: "signup",
          email,
        });

        if (error) throw error;
        set({ isLoading: false });
      } catch (error: any) {
        const message = error.message || "Resend failed";
        set({ error: message, isLoading: false });
        throw new Error(message);
      }
    },

    forgotPassword: async (email: string) => {
      try {
        set({ isLoading: true, error: null });
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });

        if (error) throw error;
        set({ isLoading: false });
      } catch (error: any) {
        const message = error.message || "Password reset request failed";
        set({ error: message, isLoading: false });
        throw new Error(message);
      }
    },

    resetPassword: async (email: string, code: string, newPassword: string) => {
      try {
        set({ isLoading: true, error: null });
        
        // If code (OTP) was passed, verify it first to log the user in
        if (code) {
          const { error: otpError } = await supabase.auth.verifyOtp({
            email,
            token: code,
            type: "recovery",
          });
          if (otpError) throw otpError;
        }

        const { error } = await supabase.auth.updateUser({
          password: newPassword,
        });

        if (error) throw error;
        set({ isLoading: false });
      } catch (error: any) {
        const message = error.message || "Reset password failed";
        set({ error: message, isLoading: false });
        throw new Error(message);
      }
    },

    logout: async () => {
      await supabase.auth.signOut();
      localStorage.removeItem("auth-user");
      set({ user: null, token: null, error: null });
    },

    checkAuth: async () => {
      try {
        set({ isLoading: true });
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          localStorage.removeItem("auth-user");
          set({ user: null, token: null, isLoading: false });
          return;
        }

        const response = await apiClient.get("/auth/me");
        const { user } = response.data;
        localStorage.setItem("auth-user", JSON.stringify(user));
        set({ user, token: session.access_token, isLoading: false });
      } catch (error) {
        // Clear session on error
        try {
          await supabase.auth.signOut();
        } catch (e) {
          console.error("SignOut error:", e);
        }
        localStorage.removeItem("auth-user");
        set({ user: null, token: null, isLoading: false });
      }
    },
  };
});
