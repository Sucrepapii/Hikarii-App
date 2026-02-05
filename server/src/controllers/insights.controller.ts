import { Response } from "express";
import prisma from "../config/db";
import { AuthRequest } from "../middleware/auth.middleware";
import { TaskType, TaskStatus } from "../models/types";

interface Insight {
  id: string;
  type: string;
  priority: string;
  title: string;
  message: string;
  actionable: boolean;
  taskId?: string;
  suggestedAction?: string;
  financialImpact?: number;
  createdAt: Date;
}

export const getInsights = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const [tasks, budgets] = await Promise.all([
      prisma.task.findMany({ where: { userId: req.userId } }),
      prisma.budget.findMany({ where: { userId: req.userId } }),
    ]);

    const insights: Insight[] = [];

    // 1. Cash Flow Urgency
    const availableFunds = budgets.reduce(
      (sum, b) => sum + (b.limit - b.spent),
      0,
    );
    if (availableFunds < 10000) {
      const incomeTasks = tasks.filter(
        (t) =>
          (t.financials as any)?.type === TaskType.INCOME &&
          t.status !== TaskStatus.COMPLETED,
      );

      insights.push({
        id: `cashflow-${Date.now()}`,
        type: "CASH_FLOW_ALERT",
        priority: "CRITICAL",
        title: "Low Cash Flow Alert",
        message: `Only NGN ${availableFunds.toLocaleString()} remaining in budgets. ${
          incomeTasks.length > 0
            ? `Prioritize ${incomeTasks.length} income task(s).`
            : "Consider adding income tasks."
        }`,
        actionable: incomeTasks.length > 0,
        suggestedAction:
          incomeTasks.length > 0
            ? "Focus on income-generating tasks"
            : undefined,
        financialImpact: availableFunds,
        createdAt: new Date(),
      });
    }

    // 2. Budget Conflicts
    const pendingExpenses = tasks
      .filter(
        (t) =>
          (t.financials as any)?.type === TaskType.EXPENSE &&
          t.status !== TaskStatus.COMPLETED,
      )
      .reduce((sum, t) => {
        // Type casting json?
        const est = (t.financials as any)?.estimatedCost || 0;
        return sum + est;
      }, 0);

    if (pendingExpenses > availableFunds) {
      const deficit = pendingExpenses - availableFunds;
      insights.push({
        id: `deficit-${Date.now()}`,
        type: "BUDGET_WARNING",
        priority: "HIGH",
        title: "Budget Conflict Detected",
        message: `Pending expense tasks (NGN ${pendingExpenses.toLocaleString()}) exceed available budget (NGN ${availableFunds.toLocaleString()}). Shortfall: NGN ${deficit.toLocaleString()}`,
        actionable: true,
        suggestedAction:
          "Postpone low-priority expense tasks or increase budget",
        financialImpact: -deficit,
        createdAt: new Date(),
      });
    }

    // 3. Late Fee Warnings
    const now = new Date();
    tasks.forEach((task) => {
      if (
        (task.financials as any)?.lateFeePerDay &&
        task.dueDate &&
        task.status !== TaskStatus.COMPLETED
      ) {
        const dueDate = new Date(task.dueDate);
        const isOverdue = dueDate < now;

        if (isOverdue) {
          const daysLate = Math.ceil(
            (now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24),
          );
          const accruedFees = daysLate * (task.financials as any).lateFeePerDay;

          insights.push({
            id: `latefee-${task.id}`,
            type: "BUDGET_WARNING",
            priority: "CRITICAL",
            title: `Late Fee Accruing: ${task.title}`,
            message: `Task is ${daysLate} day(s) overdue. Accrued fees: NGN ${accruedFees.toLocaleString()}`,
            actionable: true,
            taskId: task.id,
            suggestedAction: "Complete this task immediately",
            financialImpact: -accruedFees,
            createdAt: now,
          });
        }
      }
    });

    // 4. Unused Subscription Monitor
    const subscriptions = await prisma.recurringExpense.findMany({
      where: { userId: req.userId, isActive: true },
    });

    subscriptions.forEach((sub) => {
      const daysSinceUpdate = Math.ceil(
        (Date.now() - new Date(sub.updatedAt).getTime()) /
          (1000 * 60 * 60 * 24),
      );
      if (daysSinceUpdate > 60) {
        insights.push({
          id: `unused-sub-${sub.id}`,
          type: "SUBSCRIPTION_ALERT",
          priority: "MEDIUM",
          title: `Unused Subscription: ${sub.merchantName}`,
          message: `You haven't engaged with this ${sub.frequency} subscription in over 60 days. Costs: NGN ${sub.amount.toLocaleString()}/cycle.`,
          actionable: true,
          suggestedAction: "Cancel Subscription",
          financialImpact: sub.amount,
          createdAt: new Date(),
        });
      }
    });

    // 5. Project Delay Costs
    // Define a type for the result including the relation
    type ProjectWithTasks = {
      id: string;
      title: string;
      tasks: {
        id: string;
        financials: any;
        dueDate: Date | null;
        status: string;
      }[];
    };

    const projects: ProjectWithTasks[] = (await prisma.project.findMany({
      where: { userId: req.userId, status: "ACTIVE" },
      include: { tasks: true },
    })) as unknown as ProjectWithTasks[];

    projects.forEach((project) => {
      const overdueTasks = project.tasks.filter(
        (t) =>
          t.dueDate && new Date(t.dueDate) < now && t.status !== "COMPLETED",
      );
      if (overdueTasks.length > 0) {
        const potentialLoss = overdueTasks.reduce(
          (sum, t) => sum + (t.financials?.estimatedCost || 0) * 0.1,
          0,
        ); // Mock 10% overrun cost

        insights.push({
          id: `project-delay-${project.id}`,
          type: "PROJECT_RISK",
          priority: "HIGH",
          title: `Project Delay: ${project.title}`,
          message: `${overdueTasks.length} tasks are overdue. Estimated cost of delay: NGN ${potentialLoss.toLocaleString()}`,
          actionable: true,
          suggestedAction: "Reschedule or fast-track tasks",
          financialImpact: -potentialLoss,
          createdAt: new Date(),
        });
      }
    });

    // 6. Spending Optimization (Mock Intelligence)
    const phoneExpenses = await prisma.expense.aggregate({
      where: {
        userId: req.userId,
        category: "UTILITIES",
        description: { contains: "Phone", mode: "insensitive" },
      },
      _sum: { amount: true },
    });

    if ((phoneExpenses._sum.amount || 0) > 50000) {
      // If spending > 50k on phone
      insights.push({
        id: `opt-phone-${Date.now()}`,
        type: "SPENDING_OPT",
        priority: "LOW",
        title: "Optimize Phone Bill",
        message:
          "You spent over NGN 50,000 on phone bills recently. Switching carriers could save you ~NGN 15,000/year.",
        actionable: true,
        suggestedAction: "Compare Data Plans",
        financialImpact: 15000,
        createdAt: new Date(),
      });
    }

    res.json({ insights });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getRecommendations = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const [tasks] = await Promise.all([
      prisma.task.findMany({
        where: {
          userId: req.userId,
          status: { not: TaskStatus.COMPLETED },
        },
      }),
    ]);

    const recommendations = tasks
      .map((task) => {
        let score = 0;
        const priorityScores = { LOW: 10, MEDIUM: 30, HIGH: 60, URGENT: 90 };
        score +=
          priorityScores[task.priority as keyof typeof priorityScores] || 0;

        if (task.dueDate) {
          const daysUntilDue = Math.ceil(
            (new Date(task.dueDate).getTime() - Date.now()) /
              (1000 * 60 * 60 * 24),
          );
          if (daysUntilDue < 0) score += 50;
          else if (daysUntilDue <= 1) score += 30;
          else if (daysUntilDue <= 3) score += 20;
        }

        if ((task.financials as any)?.lateFeePerDay) {
          score += 40;
        }

        return {
          taskId: task.id,
          task: task,
          urgencyScore: Math.min(100, score),
        };
      })
      .filter((r) => r.urgencyScore > 50)
      .sort((a, b) => b.urgencyScore - a.urgencyScore)
      .slice(0, 5);

    res.json({ recommendations });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
