import prisma from "../config/db";
import { Expense } from "@prisma/client";
import { subDays, differenceInDays, addDays } from "date-fns";

export class PatternDetectionService {
  // Basic normalization: remove numbers, special chars, trim
  private normalizeMerchantName(name: string): string {
    // Remove common prefixes/suffixes like "bill", "payment" if needed,
    // but for now simple clean up.
    // "Spotify P12345" -> "spotify"
    return name
      .replace(/[0-9]/g, "")
      .replace(/[^a-zA-Z\s]/g, " ")
      .trim()
      .toLowerCase();
  }

  async detectPatterns(userId: string) {
    console.log(`[PatternService] Running detection for user: ${userId}`);

    // 1. Fetch last 90 days expenses
    const expenses = await prisma.expense.findMany({
      where: {
        userId,
        date: {
          gte: subDays(new Date(), 90),
        },
      },
      orderBy: { date: "asc" },
    });

    if (expenses.length < 2) return [];

    // 2. Group by normalized name
    const groups: Record<string, Expense[]> = {};
    expenses.forEach((e) => {
      const key = this.normalizeMerchantName(e.title);
      if (key.length < 3) return; // Skip very short names
      if (!groups[key]) groups[key] = [];
      groups[key].push(e);
    });

    const newPatterns = [];

    // 3. Analyze groups
    for (const [key, group] of Object.entries(groups)) {
      // Need at least 2 transactions to detect an interval (though 3 is better confidence)
      if (group.length < 2) continue;

      // A. Check amounts consistency (within 10% variance usually indicates subscription)
      const amounts = group.map((e) => e.amount);
      const avgAmount = amounts.reduce((a, b) => a + b, 0) / amounts.length;
      const variance =
        amounts.reduce((sum, a) => sum + Math.pow(a - avgAmount, 2), 0) /
        amounts.length;
      const stdDev = Math.sqrt(variance);

      // Coefficient of variation (CV) < 0.1 means very consistent
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
      else if (Math.abs(avgInterval - 30) < 5) frequency = "MONTHLY";
      else if (Math.abs(avgInterval - 365) < 10) frequency = "YEARLY";

      if (frequency && isConsistentAmount) {
        // Found a pattern!
        const mostRecent = group[group.length - 1];
        const originalName = mostRecent.title;

        // Calculate next due date
        const lastDate = new Date(mostRecent.date);
        const nextDueDate = addDays(lastDate, Math.round(avgInterval));

        // Check if already exists/tracked
        // We try to match by exact Merchant Name for now to avoid duplicates
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
              confidenceScore: 0.8 + group.length * 0.05, // More history = more confidence
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

    return newPatterns;
  }
}
