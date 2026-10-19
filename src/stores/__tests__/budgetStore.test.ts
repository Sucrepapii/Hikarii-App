import { describe, it, expect, vi, beforeEach } from "vitest";
import { useBudgetStore } from "../budgetStore";
import apiClient from "../../api/client";
import { queueForSync } from "../../utils/syncManager";
import { ExpenseCategory, BudgetPeriod, Expense, Budget } from "../../types/budget.types";

vi.mock("../../api/client", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("../../utils/syncManager", () => ({
  queueForSync: vi.fn(),
}));

describe("budgetStore Unit Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    useBudgetStore.setState({
      expenses: [],
      budgets: [],
      forecasts: [],
      currency: "NGN",
      isLoading: false,
      error: null,
    });
  });

  describe("Currency Conversion Logic", () => {
    it("should correctly convert base NGN amount to target currency", () => {
      const store = useBudgetStore.getState();
      // Exchange rate for USD is 0.0007
      expect(store.getConvertedAmount(10000, "USD")).toBeCloseTo(7.0);
      // Exchange rate for GBP is 0.00052
      expect(store.getConvertedAmount(10000, "GBP")).toBeCloseTo(5.2);
      // Fallback for unknown currency should return original amount
      expect(store.getConvertedAmount(5000, "XYZ")).toBe(5000);
    });

    it("should correctly convert foreign currency back into base currency", () => {
      const store = useBudgetStore.getState();
      // USD to NGN: 7 / 0.0007 = 10000
      expect(store.getAmountInBaseCurrency(7, "USD")).toBeCloseTo(10000);
    });

    it("should update currency and sync with localStorage", () => {
      useBudgetStore.getState().setCurrency("USD");
      expect(useBudgetStore.getState().currency).toBe("USD");
      expect(localStorage.getItem("currency")).toBe("USD");
    });
  });

  describe("addExpense", () => {
    it("should post new expense online and refresh budgets", async () => {
      Object.defineProperty(navigator, "onLine", { value: true, configurable: true });

      const newExpense = {
        title: "Grocery Shopping",
        amount: 25000,
        category: ExpenseCategory.GROCERIES,
        date: new Date("2026-10-15"),
      };

      const serverExpense: Expense = {
        ...newExpense,
        id: "exp-1",
      };

      (apiClient.post as any).mockResolvedValueOnce({ data: serverExpense });
      (apiClient.get as any).mockResolvedValueOnce({ data: [] }); // fetchBudgets refresh

      await useBudgetStore.getState().addExpense(newExpense as any);

      expect(apiClient.post).toHaveBeenCalledWith("/expenses", newExpense);
      expect(useBudgetStore.getState().expenses).toContainEqual(serverExpense);
    });

    it("should queue expense offline when navigator is offline", async () => {
      Object.defineProperty(navigator, "onLine", { value: false, configurable: true });

      const offlineExpense = {
        title: "Dinner",
        amount: 5000,
        category: ExpenseCategory.FOOD,
      };

      await useBudgetStore.getState().addExpense(offlineExpense as any);

      expect(queueForSync).toHaveBeenCalledWith(
        "expense",
        offlineExpense,
        expect.stringMatching(/^temp-/)
      );
      expect(useBudgetStore.getState().expenses).toHaveLength(1);
    });
  });

  describe("updateExpense & deleteExpense", () => {
    it("should update expense and refresh budgets", async () => {
      const existing: Expense = {
        id: "exp-update",
        title: "Old Title",
        amount: 1000,
        category: ExpenseCategory.OTHER,
        date: new Date(),
      };
      useBudgetStore.setState({ expenses: [existing] });

      const updated: Expense = { ...existing, title: "New Title", amount: 1200 };
      (apiClient.put as any).mockResolvedValueOnce({ data: updated });
      (apiClient.get as any).mockResolvedValueOnce({ data: [] });

      await useBudgetStore.getState().updateExpense("exp-update", { title: "New Title", amount: 1200 });

      expect(apiClient.put).toHaveBeenCalledWith("/expenses/exp-update", { title: "New Title", amount: 1200 });
      expect(useBudgetStore.getState().expenses[0].title).toBe("New Title");
    });

    it("should delete expense and remove from state", async () => {
      const existing: Expense = {
        id: "exp-del",
        title: "Delete Me",
        amount: 500,
        category: ExpenseCategory.UTILITIES,
        date: new Date(),
      };
      useBudgetStore.setState({ expenses: [existing] });

      (apiClient.delete as any).mockResolvedValueOnce({ data: { success: true } });
      (apiClient.get as any).mockResolvedValueOnce({ data: [] });

      await useBudgetStore.getState().deleteExpense("exp-del");

      expect(apiClient.delete).toHaveBeenCalledWith("/expenses/exp-del");
      expect(useBudgetStore.getState().expenses).toHaveLength(0);
    });
  });

  describe("setBudget & deleteBudget", () => {
    it("should add a new budget or update existing category budget", async () => {
      const newBudget: Budget = {
        id: "b-1",
        category: ExpenseCategory.FOOD,
        limit: 50000,
        spent: 0,
        period: BudgetPeriod.MONTHLY,
      };

      (apiClient.post as any).mockResolvedValueOnce({ data: newBudget });

      await useBudgetStore.getState().setBudget(ExpenseCategory.FOOD, 50000, BudgetPeriod.MONTHLY);

      expect(apiClient.post).toHaveBeenCalledWith("/budgets", {
        category: ExpenseCategory.FOOD,
        limit: 50000,
        period: BudgetPeriod.MONTHLY,
      });
      expect(useBudgetStore.getState().budgets).toContainEqual(newBudget);
    });

    it("should delete budget by id", async () => {
      const budget: Budget = {
        id: "b-del",
        category: ExpenseCategory.ENTERTAINMENT,
        limit: 15000,
        spent: 2000,
        period: BudgetPeriod.MONTHLY,
      };
      useBudgetStore.setState({ budgets: [budget] });

      (apiClient.delete as any).mockResolvedValueOnce({ data: { success: true } });

      await useBudgetStore.getState().deleteBudget("b-del");

      expect(apiClient.delete).toHaveBeenCalledWith("/budgets/b-del");
      expect(useBudgetStore.getState().budgets).toHaveLength(0);
    });
  });

  describe("task integration & calculations", () => {
    it("should calculate total spent across all expenses", () => {
      useBudgetStore.setState({
        expenses: [
          { id: "1", title: "A", amount: 1500, category: ExpenseCategory.FOOD, date: new Date() },
          { id: "2", title: "B", amount: 3500, category: ExpenseCategory.BOOKS, date: new Date() },
        ],
      });

      expect(useBudgetStore.getState().getTotalSpent()).toBe(5000);
    });

    it("should find and delete task-linked expenses", async () => {
      const linkedExpense: Expense = {
        id: "exp-linked",
        title: "Course Material",
        amount: 8000,
        category: ExpenseCategory.BOOKS,
        linkedTaskId: "task-101",
        date: new Date(),
      };
      useBudgetStore.setState({ expenses: [linkedExpense] });

      (apiClient.delete as any).mockResolvedValueOnce({ data: { success: true } });
      (apiClient.get as any).mockResolvedValueOnce({ data: [] });

      const matches = useBudgetStore.getState().getExpensesForTask("task-101");
      expect(matches).toHaveLength(1);

      await useBudgetStore.getState().deleteTaskExpenses("task-101");
      expect(apiClient.delete).toHaveBeenCalledWith("/expenses/exp-linked");
    });
  });
});
