import { Response } from "express";
import prisma from "../config/db";
import { TaskStatus } from "../models/types";
import { AuthRequest } from "../middleware/auth.middleware";
import { createCalendarEvent } from "../services/google.calendar.service";

import { taskSplitterService } from "../services/task.splitter.service";

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
    const { addToCalendar, ...rest } = req.body; // Extract flag

    // Sanitize projectId
    const task = await prisma.task.create({
      data: {
        ...rest,
        userId: req.userId,
        projectId: rest.projectId || null,
      },
    });

    // Handle Calendar Sync
    if (addToCalendar && task.dueDate) {
      try {
        await createCalendarEvent(req.userId, task);
      } catch (err) {
        console.error("Failed to sync to calendar during creation", err);
        // Don't fail the task creation, just log error
      }
    }

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
      data: {
        ...req.body,
        projectId:
          req.body.projectId || (req.body.projectId === "" ? null : undefined),
      },
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

export const analyzeTaskSplit = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { force } = req.body;

    const task = (await prisma.task.findFirst({
      where: { id: id as string, userId: req.userId },
      include: { blocks: true },
    })) as any;

    if (!task) {
      res.status(404).json({ error: "Task not found" });
      return;
    }

    // Check if blocks already exist
    if (task.blocks && task.blocks.length > 0) {
      if (!force) {
        res.json({ blocks: task.blocks, message: "Blocks already exist" });
        return;
      }

      // If force, delete existing blocks first
      await prisma.taskBlock.deleteMany({
        where: { taskId: task.id },
      });
    }

    // Import service dynamically
    const { taskSplitterService } =
      await import("../services/task.splitter.service.js");

    // Generate suggestions
    const suggestions = await taskSplitterService.suggestBlocks(task.title);

    // Persist to DB using transaction
    const createdBlocks = await prisma.$transaction(
      suggestions.map((block) =>
        prisma.taskBlock.create({
          data: {
            title: block.title,
            duration: block.duration,
            order: block.order,
            taskId: task.id,
          },
        }),
      ),
    );

    res.json({
      blocks: createdBlocks,
      message: "Blocks generated successfully",
    });
  } catch (error: any) {
    console.error("Split analysis failed:", error);
    res.status(500).json({ error: error.message || "Failed to analyze task" });
  }
};

export const scheduleBlocks = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const task = (await prisma.task.findUnique({
      where: { id: id as string, userId: req.userId },
      include: { blocks: true },
    })) as any;

    if (!task || !task.blocks || task.blocks.length === 0) {
      res.status(404).json({ error: "Task or blocks not found" });
      return;
    }

    const { syncTaskBlocks } =
      await import("../services/google.calendar.service.js");
    const results = await syncTaskBlocks(
      req.userId!,
      id as string,
      task.blocks,
    );

    if (!results) {
      res
        .status(400)
        .json({ error: "Calendar sync failed. Is Google Calendar connected?" });
      return;
    }

    // Update local blocks with googleEventIds if returned
    if (results && results.length > 0) {
      await prisma.$transaction(
        results.map((r: any) =>
          prisma.taskBlock.update({
            where: { id: r.blockId },
            data: { googleEventId: r.googleEventId },
          }),
        ),
      );
    }

    res.json({ message: "Blocks scheduled", results });
  } catch (error: any) {
    console.error("Scheduling failed:", error);
    res
      .status(500)
      .json({ error: error.message || "Failed to schedule blocks" });
  }
};
