import express from "express";
import {
  createCheckoutSession,
  createPortalSession,
  handleWebhook,
} from "../controllers/stripe.controller";
import { authenticate as authenticateToken } from "../middleware/auth.middleware";

const router = express.Router();

// Webhook must be raw body, so we define it before applying generic JSON parser if handled in app.ts,
// or use express.raw({type: 'application/json'}) specifically for this route
// Ideally, app.ts should treat /webhook as special case or we handle it here.
// For simplicity in this setup, we'll assume app.ts might need adjustment or we use a separate route.

router.post(
  "/create-checkout-session",
  authenticateToken,
  createCheckoutSession,
);
router.post("/create-portal-session", authenticateToken, createPortalSession);

export default router;
