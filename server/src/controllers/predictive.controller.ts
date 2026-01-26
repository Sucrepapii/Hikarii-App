import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { PredictiveService } from "../services/predictive.service";

const predictiveService = new PredictiveService();

export const getForecast = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const forecasts = await predictiveService.generateForecast(req.userId);
    res.json(forecasts);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
