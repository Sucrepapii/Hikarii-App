import prisma from "../config/db";
import { TaskType, TaskStatus } from "../models/types";
export const getInsights = async (req, res) => {
    try {
        const [tasks, budgets] = await Promise.all([
            prisma.task.findMany({ where: { userId: req.userId } }),
            prisma.budget.findMany({ where: { userId: req.userId } }),
        ]);
        const insights = [];
        // 1. Cash Flow Urgency
        const availableFunds = budgets.reduce((sum, b) => sum + (b.limit - b.spent), 0);
        if (availableFunds < 10000) {
            const incomeTasks = tasks.filter((t) => t.financials?.type === TaskType.INCOME &&
                t.status !== TaskStatus.COMPLETED);
            insights.push({
                id: `cashflow-${Date.now()}`,
                type: "CASH_FLOW_ALERT",
                priority: "CRITICAL",
                title: "Low Cash Flow Alert",
                message: `Only ₦${availableFunds.toLocaleString()} remaining in budgets. ${incomeTasks.length > 0
                    ? `Prioritize ${incomeTasks.length} income task(s).`
                    : "Consider adding income tasks."}`,
                actionable: incomeTasks.length > 0,
                suggestedAction: incomeTasks.length > 0
                    ? "Focus on income-generating tasks"
                    : undefined,
                financialImpact: availableFunds,
                createdAt: new Date(),
            });
        }
        // 2. Budget Conflicts
        const pendingExpenses = tasks
            .filter((t) => t.financials?.type === TaskType.EXPENSE &&
            t.status !== TaskStatus.COMPLETED)
            .reduce((sum, t) => {
            // Type casting json?
            const est = t.financials?.estimatedCost || 0;
            return sum + est;
        }, 0);
        if (pendingExpenses > availableFunds) {
            const deficit = pendingExpenses - availableFunds;
            insights.push({
                id: `deficit-${Date.now()}`,
                type: "BUDGET_WARNING",
                priority: "HIGH",
                title: "Budget Conflict Detected",
                message: `Pending expense tasks (₦${pendingExpenses.toLocaleString()}) exceed available budget (₦${availableFunds.toLocaleString()}). Shortfall: ₦${deficit.toLocaleString()}`,
                actionable: true,
                suggestedAction: "Postpone low-priority expense tasks or increase budget",
                financialImpact: -deficit,
                createdAt: new Date(),
            });
        }
        // 3. Late Fee Warnings
        const now = new Date();
        tasks.forEach((task) => {
            if (task.financials?.lateFeePerDay &&
                task.dueDate &&
                task.status !== TaskStatus.COMPLETED) {
                const dueDate = new Date(task.dueDate);
                const isOverdue = dueDate < now;
                if (isOverdue) {
                    const daysLate = Math.ceil((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
                    const accruedFees = daysLate * task.financials.lateFeePerDay;
                    insights.push({
                        id: `latefee-${task.id}`,
                        type: "BUDGET_WARNING",
                        priority: "CRITICAL",
                        title: `Late Fee Accruing: ${task.title}`,
                        message: `Task is ${daysLate} day(s) overdue. Accrued fees: ₦${accruedFees.toLocaleString()}`,
                        actionable: true,
                        taskId: task.id,
                        suggestedAction: "Complete this task immediately",
                        financialImpact: -accruedFees,
                        createdAt: now,
                    });
                }
            }
        });
        res.json({ insights });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const getRecommendations = async (req, res) => {
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
                priorityScores[task.priority] || 0;
            if (task.dueDate) {
                const daysUntilDue = Math.ceil((new Date(task.dueDate).getTime() - Date.now()) /
                    (1000 * 60 * 60 * 24));
                if (daysUntilDue < 0)
                    score += 50;
                else if (daysUntilDue <= 1)
                    score += 30;
                else if (daysUntilDue <= 3)
                    score += 20;
            }
            if (task.financials?.lateFeePerDay) {
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
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
