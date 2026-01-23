export enum ExpenseCategory {
  FOOD = "FOOD",
  TRANSPORT = "TRANSPORT",
  ENTERTAINMENT = "ENTERTAINMENT",
  UTILITIES = "UTILITIES",
  SHOPPING = "SHOPPING",
  HEALTH = "HEALTH",
  OTHER = "OTHER",
}

export enum BudgetPeriod {
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
  YEARLY = "YEARLY",
}

export interface Expense {
  _id: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: Date;
  description?: string;
  linkedTaskId?: string; // Reference to task that created this expense
  isAutoCreated?: boolean; // Was this auto-created from a task?
}

export interface Budget {
  _id: string;
  category: ExpenseCategory;
  limit: number;
  spent: number;
  period: BudgetPeriod;
}

export interface BudgetSummaryData {
  totalSpent: number;
  totalBudget: number;
  remaining: number;
  categoryBreakdown: {
    category: ExpenseCategory;
    spent: number;
    budget: number;
  }[];
}
