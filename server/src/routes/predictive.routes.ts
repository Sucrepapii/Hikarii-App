import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { getForecast, getCoachResponse } from "../controllers/predictive.controller";

const router = Router();

router.get("/forecast", authenticate, getForecast);
router.post("/coach", authenticate, getCoachResponse);

export default router;
