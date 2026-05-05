import { Response } from "express";
import prisma from "../config/db";
import { AuthRequest } from "../middleware/auth.middleware";

// Create Project
export const createProject = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, startDate, endDate, budgetLimit } = req.body;

    const project = await prisma.project.create({
      data: {
        title,
        description,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        budgetLimit: budgetLimit ? parseFloat(budgetLimit) : null,
        userId: req.userId!,
      },
    });

    res.status(201).json(project);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Projects for User (owned + shared)
export const getProjects = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    // Get owned projects
    const ownedProjects = await prisma.project.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: { tasks: { select: { status: true } } },
    });

    // Get projects the user is an accepted member of (but doesn't own)
    const memberships = await (prisma as any).projectMember.findMany({
      where: { userId, status: "ACCEPTED" },
      include: {
        project: {
          include: { tasks: { select: { status: true } } },
        },
      },
    });

    const ownedWithProgress = ownedProjects.map((project: any) => {
      const totalTasks = project.tasks.length;
      const completedTasks = project.tasks.filter((t: any) => t.status === "COMPLETED").length;
      return { ...project, progress: Math.round(totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0), isShared: false, memberRole: null };
    });

    const sharedWithProgress = memberships.map((m: any) => {
      const project = m.project;
      const totalTasks = project.tasks.length;
      const completedTasks = project.tasks.filter((t: any) => t.status === "COMPLETED").length;
      return { ...project, progress: Math.round(totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0), isShared: true, memberRole: m.role };
    });

    res.json([...ownedWithProgress, ...sharedWithProgress]);
  } catch (error: any) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get Single Project with Details
export const getProject = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const project = await prisma.project.findUnique({
      where: { id: id as string, userId: req.userId! },
      include: {
        tasks: true,
        budgets: true,
        expenses: {
          orderBy: { date: "desc" },
          take: 10,
        },
      },
    });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.json(project);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Update Project
export const updateProject = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, status, budgetLimit, startDate, endDate } =
      req.body;

    const project = await prisma.project.update({
      where: { id: id as string, userId: req.userId! },
      data: {
        title,
        description,
        status,
        budgetLimit: budgetLimit ? parseFloat(budgetLimit) : undefined,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
      },
    });

    res.json(project);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Project
export const deleteProject = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.project.delete({
      where: { id: id as string, userId: req.userId! },
    });
    res.json({ message: "Project deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get Project Summary / Health
export const getProjectSummary = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const project = (await prisma.project.findUnique({
      where: { id: id as string, userId: req.userId! },
      include: {
        tasks: true,
        budgets: true,
        expenses: true,
      },
    })) as any; // Cast to any to bypass Prisma type inference issues temporarily

    if (!project) return res.status(404).json({ error: "Project not found" });

    // Calculate generic health stats
    const totalTasks = project.tasks.length;
    const completedTasks = project.tasks.filter(
      (t: any) => t.status === "COMPLETED",
    ).length;
    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    const totalSpent = project.expenses.reduce(
      (sum: number, e: any) => sum + e.amount,
      0,
    );
    const budgetHealth = project.budgetLimit
      ? (totalSpent / project.budgetLimit) * 100
      : 0;

    res.json({
      projectId: project.id,
      progress: Math.round(progress),
      totalSpent,
      budgetLimit: project.budgetLimit || 0,
      budgetHealth: Math.round(budgetHealth),
      daysRemaining: project.endDate
        ? Math.ceil(
            (new Date(project.endDate).getTime() - Date.now()) /
              (1000 * 60 * 60 * 24),
          )
        : null,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
