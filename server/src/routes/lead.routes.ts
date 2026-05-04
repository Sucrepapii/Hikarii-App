import { Router } from "express";
import { createLead } from "../controllers/lead.controller";

const router = Router();

import rateLimit from "express-rate-limit";

const leadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 lead submissions per hour
  message: { error: "Too many requests. Please try again in an hour." },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/", leadLimiter, createLead);

export default router;
