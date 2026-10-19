import { describe, it, expect } from "vitest";
import { taskSchema, expenseSchema, budgetSchema } from "../validationSchemas";
import { TaskStatus, TaskPriority, TaskType } from "../../types/task.types";
import { ExpenseCategory } from "../../types/budget.types";

describe("Validation Schemas Unit Tests", () => {
  describe("taskSchema", () => {
    it("should validate a valid neutral task", () => {
      const validData = {
        title: "Study Discrete Math",
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
        dueDate: new Date("2026-11-15"),
        tags: ["math", "homework"],
        taskType: TaskType.NEUTRAL,
      };

      const result = taskSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should reject an empty title", () => {
      const invalidData = {
        title: "",
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
        dueDate: new Date(),
      };

      const result = taskSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Title is required");
      }
    });

    it("should reject title exceeding 100 characters", () => {
      const longTitle = "A".repeat(101);
      const invalidData = {
        title: longTitle,
        status: TaskStatus.TODO,
        priority: TaskPriority.LOW,
        dueDate: new Date(),
      };

      const result = taskSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Title is too long");
      }
    });

    it("should require estimatedCost when taskType is EXPENSE", () => {
      const expenseTaskWithoutCost = {
        title: "Buy Laptop Charger",
        status: TaskStatus.TODO,
        priority: TaskPriority.HIGH,
        dueDate: new Date(),
        taskType: TaskType.EXPENSE,
      };

      const result = taskSchema.safeParse(expenseTaskWithoutCost);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some((i) => i.path.includes("estimatedCost"))).toBe(true);
      }

      const validExpenseTask = {
        ...expenseTaskWithoutCost,
        estimatedCost: 85,
      };
      expect(taskSchema.safeParse(validExpenseTask).success).toBe(true);
    });

    it("should require estimatedIncome when taskType is INCOME", () => {
      const incomeTaskWithoutIncome = {
        title: "Freelance Design",
        status: TaskStatus.TODO,
        priority: TaskPriority.HIGH,
        dueDate: new Date(),
        taskType: TaskType.INCOME,
      };

      const result = taskSchema.safeParse(incomeTaskWithoutIncome);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some((i) => i.path.includes("estimatedIncome"))).toBe(true);
      }

      const validIncomeTask = {
        ...incomeTaskWithoutIncome,
        estimatedIncome: 350,
      };
      expect(taskSchema.safeParse(validIncomeTask).success).toBe(true);
    });
  });

  describe("expenseSchema", () => {
    it("should validate a valid expense", () => {
      const validExpense = {
        title: "Campus Lunch",
        amount: 2500,
        category: ExpenseCategory.FOOD,
        date: new Date(),
      };

      const result = expenseSchema.safeParse(validExpense);
      expect(result.success).toBe(true);
    });

    it("should reject negative or zero expense amount", () => {
      const invalidExpense = {
        title: "Coffee",
        amount: -50,
        category: ExpenseCategory.FOOD,
        date: new Date(),
      };

      const result = expenseSchema.safeParse(invalidExpense);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Amount must be positive");
      }
    });
  });

  describe("budgetSchema", () => {
    it("should validate a correct budget", () => {
      const validBudget = {
        category: ExpenseCategory.GROCERIES,
        limit: 40000,
      };

      const result = budgetSchema.safeParse(validBudget);
      expect(result.success).toBe(true);
    });

    it("should reject negative budget limit", () => {
      const invalidBudget = {
        category: ExpenseCategory.GROCERIES,
        limit: -100,
      };

      const result = budgetSchema.safeParse(invalidBudget);
      expect(result.success).toBe(false);
    });
  });
});
