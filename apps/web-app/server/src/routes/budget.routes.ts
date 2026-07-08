import { Router } from "express";
import {
  getBudgets,
  createBudget,
  deleteBudget,
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
} from "../controllers/budget.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

// Budget routes
router.get("/budgets", authenticate, getBudgets);
router.post("/budgets", authenticate, createBudget);
router.delete("/budgets/:id", authenticate, deleteBudget);

// Expense routes
router.get("/expenses", authenticate, getExpenses);
router.post("/expenses", authenticate, createExpense);
router.put("/expenses/:id", authenticate, updateExpense);
router.delete("/expenses/:id", authenticate, deleteExpense);

export default router;
