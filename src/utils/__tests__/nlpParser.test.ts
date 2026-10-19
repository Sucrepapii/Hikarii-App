import { describe, it, expect } from "vitest";
import { parseNaturalLanguageTask } from "../nlpParser";
import { TaskType, TaskPriority } from "../../types/task.types";
import { ExpenseCategory } from "../../types/budget.types";

describe("NLP Task Parser Unit Tests", () => {
  it("should extract duration correctly in minutes and hours", () => {
    const resHours = parseNaturalLanguageTask("Finish research paper (2 hours)");
    expect(resHours.estimatedDuration).toBe(120);

    const resMins = parseNaturalLanguageTask("Review flashcards (45 mins)");
    expect(resMins.estimatedDuration).toBe(45);
  });

  it("should parse late fees and penalties", () => {
    const res = parseNaturalLanguageTask("Pay tuition fee late fee 500/day");
    expect(res.lateFeePerDay).toBe(500);
  });

  it("should parse relative dates: today and tomorrow", () => {
    const resToday = parseNaturalLanguageTask("Submit homework today");
    expect(resToday.dueDate).toBeDefined();

    const resTomorrow = parseNaturalLanguageTask("Submit homework tomorrow");
    expect(resTomorrow.dueDate).toBeDefined();
    const today = new Date();
    const diffDays = Math.round(
      (resTomorrow.dueDate!.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    expect(diffDays).toBeGreaterThanOrEqual(0);
  });

  it("should parse relative dates: in X days", () => {
    const resInDays = parseNaturalLanguageTask("Call client in 5 days");
    expect(resInDays.dueDate).toBeDefined();
  });

  it("should identify income tasks with currency and amount", () => {
    const res = parseNaturalLanguageTask("Receive freelance payout $750 next monday");
    expect(res.taskType).toBe(TaskType.INCOME);
    expect(res.estimatedIncome).toBe(750);
  });

  it("should identify expense tasks with amount and category", () => {
    const res = parseNaturalLanguageTask("Buy groceries at supermarket ₦15000 tomorrow");
    expect(res.taskType).toBe(TaskType.EXPENSE);
    expect(res.estimatedCost).toBe(15000);
    expect(res.expenseCategory).toBe(ExpenseCategory.GROCERIES);
  });

  it("should parse transport expenses", () => {
    const res = parseNaturalLanguageTask("Uber ride to campus 3500 NGN");
    expect(res.taskType).toBe(TaskType.EXPENSE);
    expect(res.estimatedCost).toBe(3500);
    expect(res.expenseCategory).toBe(ExpenseCategory.TRANSPORT);
  });

  it("should detect priority indicators", () => {
    const urgentTask = parseNaturalLanguageTask("Urgent server restart");
    expect(urgentTask.priority).toBe(TaskPriority.URGENT);

    const highTask = parseNaturalLanguageTask("Important project presentation");
    expect(highTask.priority).toBe(TaskPriority.HIGH);

    const lowTask = parseNaturalLanguageTask("Minor documentation update sometime");
    expect(lowTask.priority).toBe(TaskPriority.LOW);
  });

  it("should clean and capitalize title appropriately", () => {
    const res = parseNaturalLanguageTask("pay electricity bill $80 on friday");
    expect(res.title).toBeTruthy();
    expect(res.title.charAt(0)).toBe(res.title.charAt(0).toUpperCase());
  });
});
