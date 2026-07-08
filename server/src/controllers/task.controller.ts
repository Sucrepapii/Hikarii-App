import { Response } from "express";
import prisma from "../config/db";
import { TaskStatus } from "../models/types";
import { AuthRequest } from "../middleware/auth.middleware";
import { createCalendarEvent } from "../services/google.calendar.service";

import { taskSplitterService } from "../services/task.splitter.service";

async function canAccessTask(taskId: string, userId: string, requireEdit = false) {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: { project: true }
  });

  if (!task) return { task: null, allowed: false };
  if (task.userId === userId) return { task, allowed: true };

  if (task.projectId) {
    const membership = await (prisma as any).projectMember.findFirst({
      where: { projectId: task.projectId, userId, status: "ACCEPTED" },
    });

    if (!membership) return { task, allowed: false };
    if (requireEdit && membership.role === "VIEW_ONLY") return { task, allowed: false };
    
    return { task, allowed: true };
  }

  return { task, allowed: false };
}

export const getTasks = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.userId!;

    // Find projects where the user is a member or owner
    const sharedProjectIds = await (prisma as any).projectMember.findMany({
      where: { userId, status: "ACCEPTED" },
      select: { projectId: true },
    }).then((memberships: any[]) => memberships.map(m => m.projectId));

    const tasks = await prisma.task.findMany({
      where: {
        OR: [
          { userId },
          { projectId: { in: sharedProjectIds } }
        ]
      },
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
    const { addToCalendar, ...rest } = req.body;
    const userId = req.userId!;

    // If projectId is provided, check permissions
    if (rest.projectId) {
      const project = await prisma.project.findUnique({ where: { id: rest.projectId } });
      if (project && project.userId !== userId) {
        // Not owner, check membership role
        const membership = await (prisma as any).projectMember.findFirst({
          where: { projectId: rest.projectId, userId, status: "ACCEPTED" },
        });
        if (!membership || membership.role === "VIEW_ONLY") {
          res.status(403).json({ error: "You don't have permission to add tasks to this project" });
          return;
        }
      }
    }

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
        await createCalendarEvent(req.userId as string, task);
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
    const { task, allowed } = await canAccessTask(req.params.id as string, req.userId!);

    if (!task || !allowed) {
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
    const { task: existingTask, allowed } = await canAccessTask(req.params.id as string, req.userId!, true);

    if (!existingTask || !allowed) {
      res.status(404).json({ error: "Task not found or access denied" });
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
    const { task: existingTask, allowed } = await canAccessTask(req.params.id as string, req.userId!, true);

    if (!existingTask || !allowed) {
      res.status(404).json({ error: "Task not found or access denied" });
      return;
    }

    await prisma.task.delete({
      where: { id: req.params.id as string },
    });

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
    const { task, allowed } = await canAccessTask(req.params.id as string, req.userId!, true);

    if (!task || !allowed) {
      res.status(404).json({ error: "Task not found or access denied" });
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

    if (newStatus === TaskStatus.COMPLETED) {
      import("../services/notification.service").then(({ notifyUser }) => {
        notifyUser(
          req.userId!,
          "Task Completed! 🎉",
          `You've successfully completed: ${task.title}`,
          "TASK_COMPLETED",
          { url: "/tasks" }
        );
      });
    }

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

    const { task, allowed } = await canAccessTask(id as string, req.userId!, true);

    if (!task || !allowed) {
      res.status(404).json({ error: "Task not found or access denied" });
      return;
    }

    // Check if blocks already exist
    const taskWithBlocks = await prisma.task.findUnique({
      where: { id: task.id },
      include: { blocks: true }
    }) as any;

    if (taskWithBlocks.blocks && taskWithBlocks.blocks.length > 0) {
      if (!force) {
        res.json({ blocks: taskWithBlocks.blocks, message: "Blocks already exist" });
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
    const { task, allowed } = await canAccessTask(id as string, req.userId!, true);

    if (!task || !allowed) {
      res.status(404).json({ error: "Task not found or access denied" });
      return;
    }

    const taskWithBlocks = await prisma.task.findUnique({
      where: { id: task.id },
      include: { blocks: true }
    }) as any;

    if (!taskWithBlocks || !taskWithBlocks.blocks || taskWithBlocks.blocks.length === 0) {
      res.status(404).json({ error: "Task or blocks not found" });
      return;
    }

    const { syncTaskBlocks } =
      await import("../services/google.calendar.service.js");
    const results = await syncTaskBlocks(
      req.userId!,
      id as string,
      taskWithBlocks.blocks,
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
