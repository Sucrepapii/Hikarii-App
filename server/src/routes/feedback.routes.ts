import { Router } from "express";
import { getFeedbacks, createFeedback } from "../controllers/feedback.controller";

const router = Router();

// Publicly accessible feedback routes
router.get("/", getFeedbacks);
router.post("/", createFeedback);

export default router;
