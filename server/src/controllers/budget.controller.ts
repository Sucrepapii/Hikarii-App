import { Response } from "express";
import prisma from "../config/db";
import { AuthRequest } from "../middleware/auth.middleware";
import { sendWhatsAppMessage } from "../services/whatsapp.service";

async function canAccessProject(projectId: string, userId: string, requireEdit = false) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) return false;
  if (project.userId === userId) return true;

  const membership = await (prisma as any).projectMember.findFirst({
    where: { projectId, userId, status: "ACCEPTED" },
  });

  if (!membership) return false;
  if (requireEdit && membership.role === "VIEW_ONLY") return false;

  return true;
}

async function canAccessExpense(expenseId: string, userId: string, requireEdit = false) {
  const expense = await prisma.expense.findUnique({
    where: { id: expenseId },
  });

  if (!expense) return { expense: null, allowed: false };
  if (expense.userId === userId) return { expense, allowed: true };

  if (expense.projectId) {
    const membership = await (prisma as any).projectMember.findFirst({
      where: { projectId: expense.projectId, userId, status: "ACCEPTED" },
    });

    if (!membership) return { expense, allowed: false };
    if (requireEdit && membership.role === "VIEW_ONLY") return { expense, allowed: false };
    
    return { expense, allowed: true };
  }

  return { expense, allowed: false };
}

// Budget Controllers
export const getBudgets = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.userId!;

    const sharedProjectIds = await (prisma as any).projectMember.findMany({
      where: { userId, status: "ACCEPTED" },
      select: { projectId: true },
    }).then((memberships: any[]) => memberships.map(m => m.projectId));

    const budgets = await prisma.budget.findMany({
      where: {
        OR: [
          { userId },
          { projectId: { in: sharedProjectIds } }
        ]
      },
    });
    res.json(budgets);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createBudget = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    // Calculate spent amount from existing expenses
    // Calculate spent amount from existing expenses
    const expenses = await prisma.expense.findMany({
      where: {
        userId: req.userId,
        category: req.body.category,
      },
    });

    const spent = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    // If projectId is provided, check permissions
    if (req.body.projectId) {
      const allowed = await canAccessProject(req.body.projectId, req.userId!, true);
      if (!allowed) {
        res.status(403).json({ error: "Access denied to project" });
        return;
      }
    }

    // Upsert logic
    const existingBudget = await prisma.budget.findUnique({
      where: {
        userId_category: {
          userId: req.userId!,
          category: req.body.category,
        },
      },
    });

    let budget;
    if (existingBudget) {
      budget = await prisma.budget.update({
        where: { id: existingBudget.id },
        data: {
          ...req.body,
          spent,
          projectId:
            req.body.projectId ||
            (req.body.projectId === "" ? null : undefined),
        },
      });
    } else {
      budget = await prisma.budget.create({
        data: {
          ...req.body,
          userId: req.userId,
          spent,
          projectId: req.body.projectId || null,
        },
      });
    }

    res.status(201).json(budget);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteBudget = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    // Verify ownership
    const existing = await prisma.budget.findFirst({
      where: { id: req.params.id as string, userId: req.userId },
    });

    if (!existing) {
      res.status(404).json({ error: "Budget not found" });
      return;
    }

    await prisma.budget.delete({ where: { id: req.params.id as string } });

    // Handled above

    res.json({ message: "Budget deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Expense Controllers
export const getExpenses = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.userId!;

    const sharedProjectIds = await (prisma as any).projectMember.findMany({
      where: { userId, status: "ACCEPTED" },
      select: { projectId: true },
    }).then((memberships: any[]) => memberships.map(m => m.projectId));

    const expenses = await prisma.expense.findMany({
      where: {
        OR: [
          { userId },
          { projectId: { in: sharedProjectIds } }
        ]
      },
      orderBy: { date: "desc" },
    });
    res.json(expenses);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createExpense = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    if (req.body.projectId) {
      const allowed = await canAccessProject(req.body.projectId, req.userId!, false); // Members can add expenses
      if (!allowed) {
        res.status(403).json({ error: "Access denied to project" });
        return;
      }
    }

    const expense = await prisma.expense.create({
      data: {
        ...req.body,
        userId: req.userId,
        projectId: req.body.projectId || null,
        linkedTaskId: req.body.linkedTaskId || null,
      },
    });

    // Update budget spent amount
    // Need to find budget by compound key (user+category)
    const budget = await prisma.budget.findUnique({
      where: {
        userId_category: {
          userId: req.userId!,
          category: expense.category,
        },
      },
    });

    if (budget) {
      const updatedBudget = await prisma.budget.update({
        where: { id: budget.id },
        data: { spent: { increment: expense.amount } },
        include: { user: true },
      });

      // Immediate WhatsApp Alert for Budget
      if (
        updatedBudget.user.waBudgetEnabled &&
        updatedBudget.user.phoneNumber &&
        updatedBudget.spent >= updatedBudget.limit
      ) {
        await sendWhatsAppMessage(
          updatedBudget.user.phoneNumber,
          `Budget Alert! You have reached your limit for ${updatedBudget.category}: Spent ${updatedBudget.spent}/${updatedBudget.limit}`,
        );
      }
    }

    res.status(201).json(expense);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateExpense = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { expense: existingExpense, allowed } = await canAccessExpense(req.params.id as string, req.userId!, true);

    if (!existingExpense || !allowed) {
      res.status(404).json({ error: "Expense not found or access denied" });
      return;
    }

    const updatedExpense = await prisma.expense.update({
      where: { id: req.params.id as string },
      data: {
        ...req.body,
        projectId:
          req.body.projectId || (req.body.projectId === "" ? null : undefined),
        linkedTaskId:
          req.body.linkedTaskId ||
          (req.body.linkedTaskId === "" ? null : undefined),
      },
    });

    // Update budget if amount or category changed
    if (
      existingExpense.amount !== updatedExpense.amount ||
      existingExpense.category !== updatedExpense.category
    ) {
      // Decrease old category
      const oldBudget = await prisma.budget.findUnique({
        where: {
          userId_category: {
            userId: req.userId!,
            category: existingExpense.category,
          },
        },
      });
      if (oldBudget) {
        await prisma.budget.update({
          where: { id: oldBudget.id },
          data: { spent: { decrement: existingExpense.amount } },
        });
      }

      // Increase new category
      const newBudget = await prisma.budget.findUnique({
        where: {
          userId_category: {
            userId: req.userId!,
            category: updatedExpense.category,
          },
        },
      });
      if (newBudget) {
        await prisma.budget.update({
          where: { id: newBudget.id },
          data: { spent: { increment: updatedExpense.amount } },
        });
      }
    }

    res.json(updatedExpense);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteExpense = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { expense: existingExpense, allowed } = await canAccessExpense(req.params.id as string, req.userId!, true);

    if (!existingExpense || !allowed) {
      res.status(404).json({ error: "Expense not found or access denied" });
      return;
    }

    const deletedExpense = await prisma.expense.delete({
      where: { id: req.params.id as string },
    });

    // Update budget spent amount
    const budget = await prisma.budget.findUnique({
      where: {
        userId_category: {
          userId: req.userId!,
          category: deletedExpense.category,
        },
      },
    });

    if (budget) {
      await prisma.budget.update({
        where: { id: budget.id },
        data: { spent: { decrement: deletedExpense.amount } },
      });
    }

    res.json({ message: "Expense deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
