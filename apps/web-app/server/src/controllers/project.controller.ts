import { Response } from "express";
import prisma from "../config/db";
import { AuthRequest } from "../middleware/auth.middleware";

// Helper to check access
async function canAccessProject(projectId: string, userId: string, requireEdit = false) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { members: true }
  });

  if (!project) return { project: null, allowed: false, role: null };
  if (project.userId === userId) return { project, allowed: true, role: "OWNER" };

  const membership = await (prisma as any).projectMember.findFirst({
    where: { projectId, userId, status: "ACCEPTED" },
  });

  if (!membership) return { project, allowed: false, role: null };
  if (requireEdit && membership.role === "VIEW_ONLY") return { project, allowed: false, role: membership.role };
  
  return { project, allowed: true, role: membership.role };
}

// Create Project (with optional AI-nested scoper tasks)
export const createProject = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, startDate, endDate, budgetLimit, aiPhases } = req.body;
    const userId = req.userId!;

    const parsedLimit = budgetLimit ? parseFloat(budgetLimit) : null;

    console.log(`Creating project for user ${userId}:`, { title });
    const project = await prisma.project.create({
      data: {
        title,
        description,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        budgetLimit: (parsedLimit !== null && !isNaN(parsedLimit)) ? parsedLimit : null,
        userId,
      },
    });

    if (Array.isArray(aiPhases) && aiPhases.length > 0) {
      console.log(`[ProjectCreator] Injecting ${aiPhases.length} AI phases/tasks into project: ${project.id}`);
      for (const phase of aiPhases) {
        if (Array.isArray(phase.tasks)) {
          for (const task of phase.tasks) {
            await prisma.task.create({
              data: {
                title: task.title,
                description: `${phase.name} - ${task.description || ''}`,
                estimatedDuration: Number(task.duration) || 60,
                financials: {
                  type: task.financialType,
                  estimatedCost: task.financialType === "EXPENSE" ? Number(task.amount) || 0 : undefined,
                  estimatedIncome: task.financialType === "INCOME" ? Number(task.amount) || 0 : undefined,
                },
                status: "TODO",
                priority: "MEDIUM",
                userId,
                projectId: project.id,
              }
            });
          }
        }
      }
    }

    console.log(`Project created successfully: ${project.id}`);
    res.status(201).json(project);
  } catch (error: any) {
    console.error("Project creation error details:", error);
    res.status(500).json({ error: error.message || "Unknown error during project creation" });
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
    const memberships = await prisma.projectMember.findMany({
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
      return { ...project, progress: Math.round(totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0), isShared: false, memberRole: "OWNER" };
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
    const id = req.params.id as string;
    const { project, allowed, role } = await canAccessProject(id, req.userId!);

    if (!project || !allowed) {
      return res.status(404).json({ error: "Project not found or access denied" });
    }

    const fullProject = await prisma.project.findUnique({
      where: { id: id as string },
      include: {
        tasks: true,
        budgets: true,
        expenses: {
          orderBy: { date: "desc" },
          take: 10,
        },
      },
    });

    res.json({ ...fullProject, memberRole: role });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Update Project
export const updateProject = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const { title, description, status, budgetLimit, startDate, endDate } =
      req.body;

    const { project: existingProject, allowed } = await canAccessProject(id, req.userId!, true);

    if (!existingProject || !allowed) {
      return res.status(404).json({ error: "Project not found or access denied" });
    }

    const parsedLimit = budgetLimit ? parseFloat(budgetLimit) : null;

    const project = await prisma.project.update({
      where: { id: id as string },
      data: {
        title,
        description,
        status,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        budgetLimit: (parsedLimit !== null && !isNaN(parsedLimit)) ? parsedLimit : null,
      },
    });

    res.json(project);
  } catch (error: any) {
    console.error("Project update error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete Project
export const deleteProject = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    
    // Only owner can delete project
    const project = await prisma.project.findFirst({
      where: { id: id as string, userId: req.userId! },
    });

    if (!project) {
      return res.status(404).json({ error: "Project not found or you don't have permission to delete it" });
    }

    await prisma.project.delete({
      where: { id: id as string },
    });
    res.json({ message: "Project deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get Project Summary / Health
export const getProjectSummary = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const { project, allowed } = await canAccessProject(id, req.userId!);

    if (!project || !allowed) {
      return res.status(404).json({ error: "Project not found or access denied" });
    }

    const fullProject = await prisma.project.findUnique({
      where: { id: id as string },
      include: {
        tasks: true,
        budgets: true,
        expenses: true,
      },
    }) as any;

    // Calculate generic health stats
    const totalTasks = fullProject.tasks.length;
    const completedTasks = fullProject.tasks.filter(
      (t: any) => t.status === "COMPLETED",
    ).length;
    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    const totalSpent = fullProject.expenses.reduce(
      (sum: number, e: any) => sum + e.amount,
      0,
    );
    const budgetHealth = fullProject.budgetLimit
      ? (totalSpent / fullProject.budgetLimit) * 100
      : 0;

    res.json({
      projectId: fullProject.id,
      progress: Math.round(progress),
      totalSpent,
      budgetLimit: fullProject.budgetLimit || 0,
      budgetHealth: Math.round(budgetHealth),
      daysRemaining: fullProject.endDate
        ? Math.ceil(
            (new Date(fullProject.endDate).getTime() - Date.now()) /
              (1000 * 60 * 60 * 24),
          )
        : null,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// AI Autopilot Project Scoping via Gemini
export const scopeProject = async (req: AuthRequest, res: Response) => {
  try {
    const { prompt, totalBudget = 1000 } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required for scoping" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({ error: "AI Scoping Service is currently unavailable (no API Key configured)" });
    }

    const { GoogleGenerativeAI } = require("@google/generative-ai");
    console.log(`[ProjectScoper] Prompt received: "${prompt}" with budget: $${totalBudget}`);
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest",
      generationConfig: { responseMimeType: "application/json" },
    });

    const aiPrompt = `
      You are an expert product manager and technical scoping consultant.
      Analyze the project description: "${prompt}" and design a comprehensive 3-stage or 4-stage project implementation blueprint.
      The project has a total target budget of $${totalBudget}.
      
      Generate a JSON object with the following structure:
      {
        "description": "A high-fidelity project overview including target duration.",
        "recommendedBudgetLimit": ${totalBudget},
        "phases": [
          {
            "name": "Phase 1: Research & Planning",
            "tasks": [
              {
                "title": "Specific action-oriented task (e.g. Design UI wires in Figma)",
                "description": "Concrete task details.",
                "duration": 60,
                "financialType": "EXPENSE",
                "amount": 150
              }
            ]
          }
        ]
      }

      CRITICAL DIRECTIONS:
      1. Every task MUST have highly specific titles tailored exactly to "${prompt}". Do not use generic text.
      2. The sum of all task "amount" allocations for EXPENSE types should not exceed the total budget of $${totalBudget}.
      3. Make the scopes highly premium, structured, and realistic. Return valid JSON only.
    `;

    const result = await model.generateContent(aiPrompt);
    let responseText = result.response.text();

    responseText = responseText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsedScoping = JSON.parse(responseText);
    res.json(parsedScoping);
  } catch (error: any) {
    console.error("[ProjectScoper] Scoping failed:", error);
    res.status(500).json({ error: error.message || "Failed to scope project using AI" });
  }
};
