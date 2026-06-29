import { Router } from "express";
import {
  getMe,
  updateProfile,
  updatePushToken,
  debugInfo,
} from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.put("/profile", authenticate, updateProfile);
router.put("/push-token", authenticate, updatePushToken);
router.get("/me", authenticate, getMe);
router.get("/debug", debugInfo);

export default router;
