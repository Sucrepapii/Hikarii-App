import express from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  getProjectSummary,
} from "../controllers/project.controller";

const router = express.Router();

router.use(authenticate);

router.post("/", createProject);
router.get("/", getProjects);
router.get("/:id", getProject);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);
router.get("/:id/summary", getProjectSummary);

export default router;
