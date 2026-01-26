import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { getForecast } from "../controllers/predictive.controller";

const router = Router();

router.get("/forecast", authenticate, getForecast);

export default router;
