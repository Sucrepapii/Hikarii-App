import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}", "server/**/*.{test,spec}.{ts,tsx}"],
    env: {
      NODE_ENV: "test",
      VITE_API_URL: "http://localhost:5005/api",
      VITE_SUPABASE_URL: "https://placeholder-project.supabase.co",
      VITE_SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder",
      JWT_SECRET: "test-jwt-secret-key-min-32-characters",
      TEST_ADMIN_PASSWORD: "TestPassword123!",
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "dist/", "dist-server/", "**/*.d.ts"],
    },
  },
});
