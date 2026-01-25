import { Task, TaskStatus, TaskType } from "../types/task.types";
import { Expense, Budget } from "../types/budget.types";
import {
  Insight,
  InsightType,
  InsightPriority,
  TaskRecommendation,
} from "../types/intelligence.types";

/**
 * Intelligence Service - Core decision-making logic for task-money integration
 * This service analyzes tasks and budgets to provide actionable insights
 */
export class IntelligenceService {
  /**
   * Generate insights based on current tasks and budget state
   */
  static generateInsights(
    tasks: Task[],
    _expenses: Expense[],
    budgets: Budget[],
  ): Insight[] {
    const insights: Insight[] = [];

    // 1. Cash flow urgency analysis
    insights.push(...this.analyzeCashFlowUrgency(tasks, budgets));

    // 2. Task-budget conflict detection
    insights.push(...this.detectBudgetConflicts(tasks, budgets));

    // 3. Late fee warnings
    insights.push(...this.calculateLateFeeRisks(tasks));

    // 4. Income tracking insights
    insights.push(...this.analyzeIncomeVsActual(tasks));

    return insights.sort((a, b) => {
      const priorityOrder = {
        [InsightPriority.CRITICAL]: 4,
        [InsightPriority.HIGH]: 3,
        [InsightPriority.MEDIUM]: 2,
        [InsightPriority.LOW]: 1,
      };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  /**
   * Recommend which tasks to do next based on financial reality
   */
  static recommendNextTasks(
    tasks: Task[],
    budgets: Budget[],
  ): TaskRecommendation[] {
    const recommendations: TaskRecommendation[] = [];
    const pendingTasks = tasks.filter((t) => t.status !== TaskStatus.COMPLETED);

    pendingTasks.forEach((task) => {
      const urgencyScore = this.calculateUrgencyScore(task, budgets);
      if (urgencyScore > 50) {
        recommendations.push({
          taskId: task.id,
          reason: this.getUrgencyReason(task, budgets),
          urgencyScore,
          financialContext: this.getFinancialContext(task, budgets),
        });
      }
    });

    return recommendations.sort((a, b) => b.urgencyScore - a.urgencyScore);
  }

  /**
   * Calculate urgency score (0-100) based on multiple factors
   */
  private static calculateUrgencyScore(task: Task, budgets: Budget[]): number {
    let score = 0;

    // Base priority score
    const priorityScores = { LOW: 10, MEDIUM: 30, HIGH: 60, URGENT: 90 };
    score += priorityScores[task.priority];

    // Due date proximity
    if (task.dueDate) {
      const daysUntilDue = Math.ceil(
        (new Date(task.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
      );
      if (daysUntilDue < 0)
        score += 50; // Overdue!
      else if (daysUntilDue <= 1) score += 30;
      else if (daysUntilDue <= 3) score += 20;
      else if (daysUntilDue <= 7) score += 10;
    }

    // Financial impact
    if (task.financials) {
      const { lateFeePerDay, type, estimatedCost } = task.financials;

      // Late fees increase urgency dramatically
      if (lateFeePerDay && lateFeePerDay > 0) {
        score += 40;
        // Add extra urgency if already late
        if (task.dueDate && new Date(task.dueDate) < new Date()) {
          const daysLate = Math.ceil(
            (Date.now() - new Date(task.dueDate).getTime()) /
              (1000 * 60 * 60 * 24),
          );
          score += Math.min(30, daysLate * 5); // Extra 5 points per day late
        }
      }

      // Income tasks are urgent if budget is low
      if (type === TaskType.INCOME) {
        const totalBudget = budgets.reduce(
          (sum, b) => sum + (b.limit - b.spent),
          0,
        );
        if (totalBudget < 10000) score += 30;
        else if (totalBudget < 50000) score += 15;
      }

      // Expensive tasks might need postponement if funds low
      if (type === TaskType.EXPENSE && estimatedCost) {
        const availableFunds = budgets.reduce(
          (sum, b) => sum + (b.limit - b.spent),
          0,
        );
        if (estimatedCost > availableFunds) {
          score -= 30; // Can't afford it - lower priority
        } else if (estimatedCost > availableFunds * 0.5) {
          score -= 10; // Will use half our budget - be cautious
        }
      }
    }

    return Math.min(100, Math.max(0, score));
  }

  /**
   * Get human-readable reason for task urgency
   */
  private static getUrgencyReason(task: Task, budgets: Budget[]): string {
    const reasons: string[] = [];

    if (task.dueDate && new Date(task.dueDate) < new Date()) {
      reasons.push("⚠️ Overdue");
    }

    if (task.financials?.lateFeePerDay) {
      reasons.push(
        `Late fee: ₦${task.financials.lateFeePerDay.toLocaleString()}/day`,
      );
    }

    if (task.financials?.type === TaskType.INCOME) {
      const totalRemaining = budgets.reduce(
        (sum, b) => sum + (b.limit - b.spent),
        0,
      );
      if (totalRemaining < 10000) {
        reasons.push("💰 Cash flow needs boost");
      }
    }

    if (task.dueDate && new Date(task.dueDate) >= new Date()) {
      const daysUntilDue = Math.ceil(
        (new Date(task.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
      );
      if (daysUntilDue <= 1) reasons.push("📅 Due within 24 hours");
      else if (daysUntilDue <= 3) reasons.push("📅 Due within 3 days");
    }

    return reasons.length > 0 ? reasons.join(" • ") : "High priority task";
  }

  /**
   * Get financial context for a task
   */
  private static getFinancialContext(task: Task, budgets: Budget[]): string {
    if (!task.financials) return "";

    const { type, estimatedCost, estimatedIncome, actualIncome } =
      task.financials;
    const availableFunds = budgets.reduce(
      (sum, b) => sum + (b.limit - b.spent),
      0,
    );

    if (type === TaskType.EXPENSE && estimatedCost) {
      const canAfford = estimatedCost <= availableFunds;
      return `Cost: ₦${estimatedCost.toLocaleString()} ${
        canAfford ? "✓ Affordable" : "⚠️ Budget tight"
      }`;
    }

    if (type === TaskType.INCOME) {
      if (task.status === TaskStatus.COMPLETED && actualIncome) {
        const difference = actualIncome - (estimatedIncome || 0);
        const emoji = difference >= 0 ? "✓" : "⚠️";
        return `Expected: ₦${estimatedIncome?.toLocaleString() || 0} | Actual: ₦${actualIncome.toLocaleString()} ${emoji}`;
      }
      return `Expected: ₦${estimatedIncome?.toLocaleString() || 0}`;
    }

    return "";
  }

  /**
   * Analyze cash flow urgency
   */
  private static analyzeCashFlowUrgency(
    tasks: Task[],
    budgets: Budget[],
  ): Insight[] {
    const insights: Insight[] = [];
    const availableFunds = budgets.reduce(
      (sum, b) => sum + (b.limit - b.spent),
      0,
    );

    // Low funds warning
    if (availableFunds < 10000) {
      const incomeTasks = tasks.filter(
        (t) =>
          t.financials?.type === TaskType.INCOME &&
          t.status !== TaskStatus.COMPLETED,
      );

      insights.push({
        id: crypto.randomUUID(),
        type: InsightType.CASH_FLOW_ALERT,
        priority: InsightPriority.CRITICAL,
        title: "Low Cash Flow Alert",
        message: `Only ₦${availableFunds.toLocaleString()} remaining in budgets. ${
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

    return insights;
  }

  /**
   * Detect budget conflicts
   */
  private static detectBudgetConflicts(
    tasks: Task[],
    budgets: Budget[],
  ): Insight[] {
    const insights: Insight[] = [];
    const availableFunds = budgets.reduce(
      (sum, b) => sum + (b.limit - b.spent),
      0,
    );

    // Calculate total pending expenses
    const pendingExpenses = tasks
      .filter(
        (t) =>
          t.financials?.type === TaskType.EXPENSE &&
          t.status !== TaskStatus.COMPLETED,
      )
      .reduce((sum, t) => sum + (t.financials?.estimatedCost || 0), 0);

    if (pendingExpenses > availableFunds) {
      const deficit = pendingExpenses - availableFunds;
      insights.push({
        id: crypto.randomUUID(),
        type: InsightType.BUDGET_WARNING,
        priority: InsightPriority.HIGH,
        title: "Budget Conflict Detected",
        message: `Pending expense tasks (₦${pendingExpenses.toLocaleString()}) exceed available budget (₦${availableFunds.toLocaleString()}). Shortfall: ₦${deficit.toLocaleString()}`,
        actionable: true,
        suggestedAction:
          "Postpone low-priority expense tasks or increase budget",
        financialImpact: -deficit,
        createdAt: new Date(),
      });
    }

    return insights;
  }

  /**
   * Calculate late fee risks
   */
  private static calculateLateFeeRisks(tasks: Task[]): Insight[] {
    const insights: Insight[] = [];
    const now = new Date();

    tasks.forEach((task) => {
      if (
        task.financials?.lateFeePerDay &&
        task.dueDate &&
        task.status !== TaskStatus.COMPLETED
      ) {
        const dueDate = new Date(task.dueDate);
        const isOverdue = dueDate < now;
        const daysUntilDue = Math.ceil(
          (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
        );

        if (isOverdue) {
          const daysLate = Math.ceil(
            (now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24),
          );
          const accruedFees = daysLate * task.financials.lateFeePerDay;

          insights.push({
            id: crypto.randomUUID(),
            type: InsightType.BUDGET_WARNING,
            priority: InsightPriority.CRITICAL,
            title: `Late Fee Accruing: ${task.title}`,
            message: `Task is ${daysLate} day(s) overdue. Accrued fees: ₦${accruedFees.toLocaleString()}`,
            actionable: true,
            taskId: task.id,
            suggestedAction: "Complete this task immediately",
            financialImpact: -accruedFees,
            createdAt: now,
          });
        } else if (daysUntilDue <= 3) {
          insights.push({
            id: crypto.randomUUID(),
            type: InsightType.BUDGET_WARNING,
            priority: InsightPriority.HIGH,
            title: `Upcoming Late Fee: ${task.title}`,
            message: `Due in ${daysUntilDue} day(s). Late fee: ₦${task.financials.lateFeePerDay.toLocaleString()}/day`,
            actionable: true,
            taskId: task.id,
            suggestedAction: "Prioritize to avoid late fees",
            financialImpact: 0,
            createdAt: now,
          });
        }
      }
    });

    return insights;
  }

  /**
   * Analyze income vs actual
   */
  private static analyzeIncomeVsActual(tasks: Task[]): Insight[] {
    const insights: Insight[] = [];

    const completedIncomeTasks = tasks.filter(
      (t) =>
        t.financials?.type === TaskType.INCOME &&
        t.status === TaskStatus.COMPLETED &&
        t.financials.estimatedIncome &&
        t.financials.actualIncome,
    );

    completedIncomeTasks.forEach((task) => {
      const estimated = task.financials!.estimatedIncome!;
      const actual = task.financials!.actualIncome!;
      const difference = actual - estimated;
      const percentDiff = ((difference / estimated) * 100).toFixed(0);

      if (Math.abs(difference) > estimated * 0.1) {
        // More than 10% difference
        const isPositive = difference > 0;
        insights.push({
          id: crypto.randomUUID(),
          type: InsightType.TASK_RECOMMENDATION,
          priority: isPositive ? InsightPriority.LOW : InsightPriority.MEDIUM,
          title: `${task.title}: Income ${isPositive ? "Exceeded" : "Shortfall"}`,
          message: `Expected ₦${estimated.toLocaleString()}, received ₦${actual.toLocaleString()} (${isPositive ? "+" : ""}${percentDiff}%)`,
          actionable: false,
          taskId: task.id,
          financialImpact: difference,
          createdAt: new Date(),
        });
      }
    });

    return insights;
  }
}
