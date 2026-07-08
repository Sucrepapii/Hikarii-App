import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { getForecast, getCoachResponse, getSupportBotResponse } from "../controllers/predictive.controller";

const router = Router();

router.get("/forecast", authenticate, getForecast);
router.post("/coach", authenticate, getCoachResponse);
router.post("/support-bot", getSupportBotResponse);

export default router;
