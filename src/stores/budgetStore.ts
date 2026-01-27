import { create } from "zustand";
import {
  Expense,
  Budget,
  ExpenseCategory,
  BudgetPeriod,
  ForecastResult,
} from "../types/budget.types";
import apiClient from "../api/client";

interface BudgetStore {
  expenses: Expense[];
  budgets: Budget[];
  forecasts: ForecastResult[];
  currency: string;
  isLoading: boolean;
  error: string | null;

  // Fetch data
  fetchBudgets: () => Promise<void>;
  fetchExpenses: () => Promise<void>;
  fetchForecasts: () => Promise<void>;

  // Expense operations
  addExpense: (expense: Omit<Expense, "id">) => Promise<void>;
  updateExpense: (id: string, updates: Partial<Expense>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;

  // Budget operations
  setBudget: (
    category: ExpenseCategory,
    limit: number,
    period: BudgetPeriod,
  ) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;

  // Utility methods
  setCurrency: (currency: string) => void;
  getBudgetByCategory: (category: ExpenseCategory) => Budget | undefined;
  getExpensesByCategory: (category: ExpenseCategory) => Expense[];
  getTotalSpent: () => number;
  getConvertedAmount: (amount: number, targetCurrency: string) => number;
  getAmountInBaseCurrency: (amount: number, sourceCurrency: string) => number;

  // Task integration methods
  createExpenseFromTask: (
    taskId: string,
    taskTitle: string,
    amount: number,
    category: ExpenseCategory,
  ) => Promise<string>;
  linkExpenseToTask: (expenseId: string, taskId: string) => Promise<void>;
  getExpensesForTask: (taskId: string) => Expense[];
  deleteTaskExpenses: (taskId: string) => Promise<void>;
}

export const useBudgetStore = create<BudgetStore>((set, get) => ({
  expenses: [],
  budgets: [],
  forecasts: [],
  currency: localStorage.getItem("currency") || "NGN",
  isLoading: false,
  error: null,

  // Exchange Rates (Base: NGN) - Updated Jan 2026
  // 1 NGN = X Target
  exchangeRates: {
    NGN: 1,
    USD: 0.0007, // ~1428 NGN
    GBP: 0.00052, // ~1923 NGN
    EUR: 0.0006, // ~1666 NGN
    CAD: 0.00096, // ~1041 NGN
  } as Record<string, number>,

  getConvertedAmount: (amount: number, targetCurrency: string) => {
    // Assuming amount is always stored in NGN
    const store = get();
    // @ts-ignore
    const rate = store.exchangeRates[targetCurrency] || 1;
    return amount * rate;
  },

  getAmountInBaseCurrency: (amount: number, sourceCurrency: string) => {
    const store = get();
    // @ts-ignore
    const rate = store.exchangeRates[sourceCurrency] || 1;
    return amount / rate;
  },

  fetchBudgets: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await apiClient.get("/budgets");
      set({ budgets: response.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Failed to fetch budgets",
        isLoading: false,
      });
    }
  },

  fetchExpenses: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await apiClient.get("/expenses");
      set({ expenses: response.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Failed to fetch expenses",
        isLoading: false,
      });
    }
  },

  fetchForecasts: async () => {
    try {
      // No loading state toggle to avoid flicker, seamless update
      const response = await apiClient.get("/forecast");
      set({ forecasts: response.data });
    } catch (error: any) {
      console.error("Failed to fetch forecasts", error);
    }
  },

  addExpense: async (expense) => {
    try {
      set({ isLoading: true, error: null });
      const response = await apiClient.post("/expenses", expense);
      set((state) => ({
        expenses: [...state.expenses, response.data],
        isLoading: false,
      }));

      // Refresh budgets to get updated spent amounts
      await get().fetchBudgets();
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Failed to create expense",
        isLoading: false,
      });
      throw error;
    }
  },

  updateExpense: async (id, updates) => {
    try {
      set({ isLoading: true, error: null });
      const response = await apiClient.put(`/expenses/${id}`, updates);
      set((state) => ({
        expenses: state.expenses.map((expense) =>
          expense.id === id ? response.data : expense,
        ),
        isLoading: false,
      }));

      // Refresh budgets
      await get().fetchBudgets();
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Failed to update expense",
        isLoading: false,
      });
      throw error;
    }
  },

  deleteExpense: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await apiClient.delete(`/expenses/${id}`);
      set((state) => ({
        expenses: state.expenses.filter((e) => e.id !== id),
        isLoading: false,
      }));

      // Refresh budgets
      await get().fetchBudgets();
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Failed to delete expense",
        isLoading: false,
      });
      throw error;
    }
  },

  setBudget: async (category, limit, period) => {
    try {
      set({ isLoading: true, error: null });
      const response = await apiClient.post("/budgets", {
        category,
        limit,
        period,
      });

      // Update or add budget
      set((state) => {
        const existingIndex = state.budgets.findIndex(
          (b) => b.category === category,
        );
        if (existingIndex >= 0) {
          const updatedBudgets = [...state.budgets];
          updatedBudgets[existingIndex] = response.data;
          return { budgets: updatedBudgets, isLoading: false };
        } else {
          return {
            budgets: [...state.budgets, response.data],
            isLoading: false,
          };
        }
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Failed to set budget",
        isLoading: false,
      });
      throw error;
    }
  },

  deleteBudget: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await apiClient.delete(`/budgets/${id}`);
      set((state) => ({
        budgets: state.budgets.filter((b) => b.id !== id),
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Failed to delete budget",
        isLoading: false,
      });
      throw error;
    }
  },

  getBudgetByCategory: (category) => {
    return get().budgets.find((b) => b.category === category);
  },

  getExpensesByCategory: (category) => {
    return get().expenses.filter((e) => e.category === category);
  },

  getTotalSpent: () => {
    return get().expenses.reduce((sum, expense) => sum + expense.amount, 0);
  },

  setCurrency: (currency) => {
    localStorage.setItem("currency", currency);
    set({ currency });
  },

  createExpenseFromTask: async (taskId, taskTitle, amount, category) => {
    await get().addExpense({
      title: `${taskTitle} (Auto)`,
      amount,
      category,
      date: new Date(),
      linkedTaskId: taskId,
      isAutoCreated: true,
    });
    return taskId; // Return ID for compatibility
  },

  linkExpenseToTask: async (expenseId, taskId) => {
    await get().updateExpense(expenseId, { linkedTaskId: taskId });
  },

  getExpensesForTask: (taskId) => {
    return get().expenses.filter((e) => e.linkedTaskId === taskId);
  },

  deleteTaskExpenses: async (taskId) => {
    const taskExpenses = get().expenses.filter(
      (e) => e.linkedTaskId === taskId,
    );
    await Promise.all(taskExpenses.map((e) => get().deleteExpense(e.id)));
  },
}));
