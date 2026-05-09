import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
  getAdminDashboardData,
  updateUser,
  deleteUser,
  suspendUser,
  reactivateUser,
  getAuditLogs,
  handleBatchOperations,
  createAdmin,
  getMarketingStats,
} from "../controllers/admin.controller";

const router = Router();

// Protected Routes (Admin only check inside controller logic)
router.get("/dashboard", authenticate, getAdminDashboardData);
router.get("/audit-logs", authenticate, getAuditLogs);
router.post("/create-admin", authenticate, createAdmin);
router.put("/users/:id", authenticate, updateUser);
router.post("/users/:id/suspend", authenticate, suspendUser);
router.post("/users/:id/reactivate", authenticate, reactivateUser);
router.delete("/users/:id", authenticate, deleteUser);
router.post("/batch", authenticate, handleBatchOperations);
router.get("/marketing-stats", authenticate, getMarketingStats);

export default router;
