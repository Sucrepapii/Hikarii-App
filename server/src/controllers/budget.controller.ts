import { Response } from "express";
import prisma from "../config/db";
import { AuthRequest } from "../middleware/auth.middleware";

// Budget Controllers
export const getBudgets = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const budgets = await prisma.budget.findMany({
      where: { userId: req.userId },
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
        data: { ...req.body, spent },
      });
    } else {
      budget = await prisma.budget.create({
        data: { ...req.body, userId: req.userId, spent },
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
    const expenses = await prisma.expense.findMany({
      where: { userId: req.userId },
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
    const expense = await prisma.expense.create({
      data: {
        ...req.body,
        userId: req.userId,
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
      await prisma.budget.update({
        where: { id: budget.id },
        data: { spent: { increment: expense.amount } },
      });
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
    const existingExpense = await prisma.expense.findFirst({
      where: {
        id: req.params.id as string,
        userId: req.userId,
      },
    });

    if (!existingExpense) {
      res.status(404).json({ error: "Expense not found" });
      return;
    }

    const updatedExpense = await prisma.expense.update({
      where: { id: req.params.id as string },
      data: req.body,
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
    const existingExpense = await prisma.expense.findFirst({
      where: { id: req.params.id as string, userId: req.userId },
    });

    if (!existingExpense) {
      res.status(404).json({ error: "Expense not found" });
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
