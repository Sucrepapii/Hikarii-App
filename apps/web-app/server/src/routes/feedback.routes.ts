import { Router } from "express";
import { getFeedbacks, createFeedback } from "../controllers/feedback.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

// Public — landing page testimonials
router.get("/", getFeedbacks);
// Protected — must be signed in to submit feedback
router.post("/", authenticate, createFeedback);

export default router;
