import { Response } from "express";
import prisma from "../config/db";
import { TaskStatus } from "../models/types";
import { AuthRequest } from "../middleware/auth.middleware";

export const getTasks = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const tasks = await prisma.task.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: "desc" },
    });
    res.json(tasks);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createTask = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    // Sanitize projectId to handle empty strings (common from frontend select inputs)
    const taskData = {
      ...req.body,
      userId: req.userId,
      projectId: req.body.projectId || undefined, // Convert "" to undefined
    };

    const task = await prisma.task.create({
      data: taskData,
    });
    res.status(201).json(task);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getTaskById = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const task = await prisma.task.findFirst({
      where: {
        id: req.params.id as string,
        userId: req.userId,
      },
    });

    if (!task) {
      res.status(404).json({ error: "Task not found" });
      return;
    }

    res.json(task);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateTask = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    // First check existence to handle 404 cleanly, or let Prisma throw
    const existingTask = await prisma.task.findFirst({
      where: { id: req.params.id as string, userId: req.userId },
    });

    if (!existingTask) {
      res.status(404).json({ error: "Task not found" });
      return;
    }

    const task = await prisma.task.update({
      where: { id: req.params.id as string },
      data: req.body,
    });

    /* Handled above */

    res.json(task);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteTask = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    // Verify ownership first
    const existingTask = await prisma.task.findFirst({
      where: { id: req.params.id as string, userId: req.userId },
    });

    if (!existingTask) {
      res.status(404).json({ error: "Task not found" });
      return;
    }

    await prisma.task.delete({
      where: { id: req.params.id as string },
    });

    /* Handled above */

    res.json({ message: "Task deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const toggleTaskStatus = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const task = await prisma.task.findFirst({
      where: {
        id: req.params.id as string,
        userId: req.userId,
      },
    });

    if (!task) {
      res.status(404).json({ error: "Task not found" });
      return;
    }

    // Toggle between TODO and COMPLETED
    const newStatus =
      task.status === TaskStatus.COMPLETED
        ? TaskStatus.TODO
        : TaskStatus.COMPLETED;

    const updatedTask = await prisma.task.update({
      where: { id: task.id },
      data: { status: newStatus },
    });

    res.json(updatedTask);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
