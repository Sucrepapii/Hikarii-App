import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
  getAdminDashboardData,
  updateUser,
  deleteUser,
} from "../controllers/admin.controller";

const router = Router();

// Protected Routes (Admin only check inside controller logic)
router.get("/dashboard", authenticate, getAdminDashboardData);
router.put("/users/:id", authenticate, updateUser);
router.delete("/users/:id", authenticate, deleteUser);

export default router;
