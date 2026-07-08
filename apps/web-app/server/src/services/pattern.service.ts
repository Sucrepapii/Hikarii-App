import prisma from "../config/db";
import { Expense } from "@prisma/client";
import { subDays, differenceInDays, addDays } from "date-fns";

export class PatternDetectionService {
  private normalizeMerchantName(name: string): string {
    return name
      .replace(/[0-9]/g, "")
      .replace(/[^a-zA-Z\s]/g, " ")
      .trim()
      .toLowerCase();
  }

  async detectPatterns(userId: string) {
    console.log(`[PatternService] Running detection for user: ${userId}`);

    // 1. Fetch last 400 days of expenses AND expense-type tasks to detect monthly/yearly patterns
    const expenses = await prisma.expense.findMany({
      where: {
        userId,
        date: {
          gte: subDays(new Date(), 400),
        },
      },
      orderBy: { date: "asc" },
    });

    const tasks = await prisma.task.findMany({
      where: {
        userId,
        status: { in: ["COMPLETED", "TODO", "IN_PROGRESS"] },
        createdAt: {
          gte: subDays(new Date(), 400),
        },
      },
      orderBy: { createdAt: "asc" },
    });

    // Merge tasks into an expense-like format for the algorithm
    // We look for tasks where financials.type === 'EXPENSE'
    const mappedTasks = tasks
      .filter((t) => (t.financials as any)?.type === "EXPENSE")
      .map((t) => {
        const amount =
          (t.financials as any)?.actualCost ||
          (t.financials as any)?.estimatedCost ||
          0;
        return {
          id: t.id,
          title: t.title,
          amount,
          date: t.dueDate || t.createdAt,
          category: "OTHER", // Generic fallback
          description: t.description,
          linkedTaskId: t.id,
          isAutoCreated: false,
          userId: t.userId,
          projectId: t.projectId,
          createdAt: t.createdAt,
          updatedAt: t.updatedAt,
        } as Expense;
      });

    const combinedData = [...expenses, ...mappedTasks].sort(
      (a, b) => a.date.getTime() - b.date.getTime(),
    );

    if (combinedData.length < 2)
      return {
        newPatterns: [],
        advice:
          "Not enough data yet. Add more tasks or expenses to detect patterns!",
      };

    // 2. Group by normalized name
    const groups: Record<string, Expense[]> = {};
    combinedData.forEach((e) => {
      const key = this.normalizeMerchantName(e.title);
      if (key.length < 3) return; // Skip very short names
      if (!groups[key]) groups[key] = [];
      groups[key].push(e);
    });

    const newPatterns = [];

    // 3. Analyze groups
    for (const [key, group] of Object.entries(groups)) {
      if (group.length < 2) continue;

      // A. Check amounts consistency (within 15% variance usually indicates subscription)
      const amounts = group.map((e) => e.amount);
      const avgAmount = amounts.reduce((a, b) => a + b, 0) / amounts.length;
      if (avgAmount <= 0) continue; // Skip 0 cost patterns

      const variance =
        amounts.reduce((sum, a) => sum + Math.pow(a - avgAmount, 2), 0) /
        amounts.length;
      const stdDev = Math.sqrt(variance);

      // Coefficient of variation (CV) < 0.15 means very consistent
      const isConsistentAmount = stdDev / avgAmount < 0.15;

      // B. Check frequency (gaps)
      const intervals: number[] = [];
      for (let i = 1; i < group.length; i++) {
        const dayDiff = differenceInDays(
          new Date(group[i].date),
          new Date(group[i - 1].date),
        );
        intervals.push(dayDiff);
      }

      const avgInterval =
        intervals.reduce((a, b) => a + b, 0) / intervals.length;

      // Determine frequency type
      let frequency = "";
      if (Math.abs(avgInterval - 7) < 3) frequency = "WEEKLY";
      else if (avgInterval >= 25 && avgInterval <= 35)
        frequency = "MONTHLY"; // Adjusted for 28-31 day months
      else if (Math.abs(avgInterval - 365) < 15) frequency = "YEARLY";

      if (frequency && isConsistentAmount) {
        // Found a pattern!
        const mostRecent = group[group.length - 1];
        const originalName = mostRecent.title;

        // Calculate next due date
        const lastDate = new Date(mostRecent.date);
        const nextDueDate = addDays(lastDate, Math.round(avgInterval));

        // Check if already exists/tracked
        const existing = await prisma.recurringExpense.findFirst({
          where: {
            userId,
            merchantName: originalName,
          },
        });

        if (!existing) {
          const newPattern = await prisma.recurringExpense.create({
            data: {
              userId,
              merchantName: originalName,
              amount: avgAmount,
              frequency,
              nextDueDate,
              confidenceScore: Math.min(0.8 + group.length * 0.05, 0.99), // Cap confidence at 99%
              isConfirmed: false,
            },
          });
          newPatterns.push(newPattern);
          console.log(
            `[PatternService] Detected: ${originalName} (${frequency})`,
          );
        } else {
          // Update existing
          await prisma.recurringExpense.update({
            where: { id: existing.id },
            data: {
              amount: avgAmount, // Update rolling average
              nextDueDate, // Update next due date
            },
          });
        }
      }
    }

    // Generate Advice Document
    const allActiveRecurrings = await prisma.recurringExpense.findMany({
      where: { userId, isActive: true },
    });

    let advice = "";
    if (combinedData.length > 0 && allActiveRecurrings.length === 0) {
      advice = `We analyzed ${combinedData.length} of your tasks and expenses over the last year, but haven't detected any consistent subscriptions yet. Make sure you log recurring bills with the same name and amount!`;
    } else if (allActiveRecurrings.length > 0) {
      let totalMonthly = 0;
      let highestSub = allActiveRecurrings[0];

      allActiveRecurrings.forEach((sub) => {
        if (sub.amount > highestSub.amount) highestSub = sub;
        if (sub.frequency === "WEEKLY") totalMonthly += sub.amount * 4.33;
        if (sub.frequency === "MONTHLY") totalMonthly += sub.amount;
        if (sub.frequency === "YEARLY") totalMonthly += sub.amount / 12;
      });

      advice = `We analyzed ${combinedData.length} records. You have ${allActiveRecurrings.length} active recurring items amounting to roughly NGN ${totalMonthly.toLocaleString(undefined, { maximumFractionDigits: 0 })} per month. Your highest recurring cost is ${highestSub.merchantName}. Consider reviewing your list to cancel any unused services and free up your budget.`;
    } else {
      advice =
        "Welcome! Add some tasks or expenses and we will monitor them for recurring patterns to help you save money.";
    }

    return { newPatterns, advice };
  }
}
