import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
  detectPatterns,
  getPatterns,
  confirmPattern,
  deletePattern,
} from "../controllers/pattern.controller";

const router = Router();

router.post("/detect", authenticate, detectPatterns); // Trigger manual scan
router.get("/", authenticate, getPatterns); // List all detected
router.patch("/:id/confirm", authenticate, confirmPattern);
router.delete("/:id", authenticate, deletePattern);

export default router;
