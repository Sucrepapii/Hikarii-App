import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
  connectGoogle,
  syncTaskToCalendar,
  disconnectGoogle,
  getGoogleStatus,
} from "../controllers/google.controller";

const router = Router();

router.post("/connect", authenticate, connectGoogle);
router.post("/disconnect", authenticate, disconnectGoogle);
router.get("/status", authenticate, getGoogleStatus);
router.post("/sync-task", authenticate, syncTaskToCalendar);

export default router;
