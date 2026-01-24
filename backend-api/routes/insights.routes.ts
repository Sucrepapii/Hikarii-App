import { Router } from "express";
import {
  getInsights,
  getRecommendations,
} from "../controllers/insights.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);

router.get("/", getInsights);
router.get("/recommendations", getRecommendations);

export default router;
