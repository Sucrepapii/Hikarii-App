import { Router } from "express";
import {
  getMe,
  updateProfile,
  debugInfo,
} from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.put("/profile", authenticate, updateProfile);
router.get("/me", authenticate, getMe);
router.get("/debug", debugInfo);

export default router;
