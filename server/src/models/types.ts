import mongoose from "mongoose";

// Enums
export enum TaskStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

export enum TaskPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  URGENT = "URGENT",
}

export enum TaskType {
  EXPENSE = "EXPENSE",
  INCOME = "INCOME",
  NEUTRAL = "NEUTRAL",
}

export enum BudgetPeriod {
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
  YEARLY = "YEARLY",
}

export enum ExpenseCategory {
  FOOD = "FOOD",
  TRANSPORT = "TRANSPORT",
  ENTERTAINMENT = "ENTERTAINMENT",
  UTILITIES = "UTILITIES",
  SHOPPING = "SHOPPING",
  HEALTH = "HEALTH",
  OTHER = "OTHER",
}

// Interfaces
export interface TaskFinancials {
  type: TaskType;
  estimatedCost?: number;
  actualCost?: number;
  estimatedIncome?: number;
  actualIncome?: number;
  linkedExpenseId?: string;
  lateFeePerDay?: number;
  cashFlowImpact: number;
}
