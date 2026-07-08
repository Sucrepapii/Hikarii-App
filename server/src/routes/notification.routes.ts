import { Router } from "express";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
} from "../controllers/notification.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.get("/", authenticate, getNotifications);
router.put("/mark-all-read", authenticate, markAllAsRead);
router.put("/:id/read", authenticate, markAsRead);
router.delete("/clear-all", authenticate, clearAllNotifications);
router.delete("/:id", authenticate, deleteNotification);

export default router;

