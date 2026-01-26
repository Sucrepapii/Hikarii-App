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
  id: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: Date;
  description?: string;
  linkedTaskId?: string; // Reference to task that created this expense
  isAutoCreated?: boolean; // Was this auto-created from a task?
}

export interface Budget {
  id: string;
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

export interface ForecastResult {
  budgetId: string;
  category: ExpenseCategory;
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
