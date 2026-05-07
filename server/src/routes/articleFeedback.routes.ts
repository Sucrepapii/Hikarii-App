import { Router } from "express";
import { createArticleFeedback, getArticleFeedbackStats } from "../controllers/articleFeedback.controller";

const router = Router();

// Public — users don't need to be logged in to say if an article helped
router.post("/", createArticleFeedback);

// Admin/Internal — to see which articles are working
router.get("/stats", getArticleFeedbackStats);

export default router;
