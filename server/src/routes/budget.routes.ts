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

// All routes require authentication
router.use(authenticate);

// Budget routes
router.get("/budgets", getBudgets);
router.post("/budgets", createBudget);
router.delete("/budgets/:id", deleteBudget);

// Expense routes
router.get("/expenses", getExpenses);
router.post("/expenses", createExpense);
router.put("/expenses/:id", updateExpense);
router.delete("/expenses/:id", deleteExpense);

export default router;
