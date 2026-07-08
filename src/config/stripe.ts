/**
 * Stripe Configuration
 *
 * Centralized config for Stripe to ensure keys are loaded reliably.
 * We prioritize the environment variable if available (after server restart),
 * but fallback to the hardcoded key to support hot-reloading updates.
 */

export const STRIPE_CONFIG = {
  // Falls back to the key if env var is missing (e.g. stale dev server)
  publishableKey:
    import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ||
    "pk_live_51SurE6IziFjD2Afbz0sB0FL7fSSAXkAtq6Um216QQgXwbk9YODIoVefPcRnCiPKZ6VxD1zVUrpg6C5y9k9lS9l5100EGfMFTH7",

  // Price IDs
  prices: {
    proMonthly:
      import.meta.env.VITE_STRIPE_PRO_PRICE_ID ||
      "price_1SurlQIziFjD2AfbJwmZ3TPt",
    proYearly:
      import.meta.env.VITE_STRIPE_PRO_YEARLY_PRICE_ID ||
      "price_1SurmlIziFjD2AfbH2v5AUZk",
  },
};
