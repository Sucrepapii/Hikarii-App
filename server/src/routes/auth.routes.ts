import { Router } from "express";
import {
  signup,
  login,
  getMe,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
  updateProfile,
  changePassword,
  debugInfo,
} from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerification);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.put("/profile", authenticate, updateProfile);
router.put("/password", authenticate, changePassword);
router.get("/me", authenticate, getMe);
router.get("/debug", debugInfo);

export default router;
