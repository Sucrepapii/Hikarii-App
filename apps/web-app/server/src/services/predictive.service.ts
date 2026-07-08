import prisma from "../config/db";
import {
  getDaysInMonth,
  differenceInCalendarDays,
  lastDayOfMonth,
} from "date-fns";

interface ForecastResult {
  budgetId: string;
  category: string;
  budgetLimit: number;
  currentSpent: number;
  projectedTotal: number;
  status: "SAFE" | "WARNING" | "CRITICAL";
  confidence: number;
  upcomingRecurrings: {
    name: string;
    amount: number;
    date: Date;
  }[];
}

export class PredictiveService {
  async generateForecast(userId: string): Promise<ForecastResult[]> {
    console.log(`[PredictiveService] Generating forecast for user: ${userId}`);

    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = lastDayOfMonth(today);

    const daysInCurrentMonth = getDaysInMonth(today);
    const daysPassed = differenceInCalendarDays(today, startOfMonth) + 1; // inclusive of today
    const daysRemaining = daysInCurrentMonth - daysPassed;

    // Fetch active budgets
    const budgets = await prisma.budget.findMany({
      where: { userId },
      include: { user: false },
    });

    // Fetch active recurring expenses for this user
    const recurringExpenses = await prisma.recurringExpense.findMany({
      where: { userId, isActive: true },
    });

    const forecasts: ForecastResult[] = [];

    for (const budget of budgets) {
      // 1. Calculate Daily Burn Rate for this category
      // Note: simplistic approach, assumes linear spending for non-recurring
      const dailyBurnRate = budget.spent / Math.max(daysPassed, 1);

      // 2. Identify upcoming recurring expenses for this category
      // Challenge: RecurringExpense doesn't strictly have a category field yet in our schema logic
      // We will do a generic match or skip for now, but ideally we link them.
      // For "Basic" Alerts, we'll focus on the TOTAL budget or aggregate.
      // But since budgets are categorical, let's try to map if possible or use a simple projection.

      // Refinement: Let's assume Recurring Expenses are "fixed" costs.
      // We should subtract them from "spent" to get "variable spend rate"?
      // For MVP: Linear Projection + Known Recurring additions is safer.

      // Find recurring items due in remaining days that match typical category keywords?
      // Or simpler: Just project based on current rate.

      let projectedTotal = budget.spent + dailyBurnRate * daysRemaining;

      // Adjust if we know specific big bills are coming?
      // (Skipping complex category matching for MVP to keep it robust)

      let status: "SAFE" | "WARNING" | "CRITICAL" = "SAFE";
      if (projectedTotal > budget.limit) {
        status = "CRITICAL";
      } else if (projectedTotal > budget.limit * 0.9) {
        status = "WARNING";
      }

      forecasts.push({
        budgetId: budget.id,
        category: budget.category,
        budgetLimit: budget.limit,
        currentSpent: budget.spent,
        projectedTotal: Math.round(projectedTotal),
        status,
        confidence: daysPassed > 10 ? 0.8 : 0.5, // Low confidence early in month
        upcomingRecurrings: [], // Populated if we had category linking
      });
    }

    return forecasts;
  }
}
