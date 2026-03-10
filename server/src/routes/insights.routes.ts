import { Router } from "express";
import {
  getInsights,
  getRecommendations,
  getWrappedData,
} from "../controllers/insights.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);

router.get("/", getInsights);
router.get("/recommendations", getRecommendations);
router.get("/wrapped", getWrappedData);

export default router;
