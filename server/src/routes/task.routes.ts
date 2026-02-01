import { Router } from "express";
import {
  getTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
  toggleTaskStatus,
  analyzeTaskSplit,
} from "../controllers/task.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get("/", getTasks);
router.post("/", createTask);
router.get("/:id", getTaskById);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);
router.patch("/:id/toggle", toggleTaskStatus);
router.post("/:id/analyze-split", analyzeTaskSplit);
router.post("/:id/schedule-blocks", scheduleBlocks);

export default router;
