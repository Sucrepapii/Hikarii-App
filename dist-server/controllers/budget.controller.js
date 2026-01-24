import { Budget, Expense } from "../models";
// Budget Controllers
export const getBudgets = async (req, res) => {
    try {
        const budgets = await Budget.find({ userId: req.userId });
        res.json(budgets);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const createBudget = async (req, res) => {
    try {
        // Calculate spent amount from existing expenses
        const expenses = await Expense.find({
            userId: req.userId,
            category: req.body.category,
        });
        const spent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
        const budget = await Budget.findOneAndUpdate({ userId: req.userId, category: req.body.category }, { ...req.body, userId: req.userId, spent }, { new: true, upsert: true, runValidators: true });
        res.status(201).json(budget);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const deleteBudget = async (req, res) => {
    try {
        const budget = await Budget.findOneAndDelete({
            _id: req.params.id,
            userId: req.userId,
        });
        if (!budget) {
            res.status(404).json({ error: "Budget not found" });
            return;
        }
        res.json({ message: "Budget deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// Expense Controllers
export const getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({ userId: req.userId }).sort({
            date: -1,
        });
        res.json(expenses);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const createExpense = async (req, res) => {
    try {
        const expense = await Expense.create({
            ...req.body,
            userId: req.userId,
        });
        // Update budget spent amount
        await Budget.findOneAndUpdate({ userId: req.userId, category: expense.category }, { $inc: { spent: expense.amount } });
        res.status(201).json(expense);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const updateExpense = async (req, res) => {
    try {
        const oldExpense = await Expense.findOne({
            _id: req.params.id,
            userId: req.userId,
        });
        if (!oldExpense) {
            res.status(404).json({ error: "Expense not found" });
            return;
        }
        const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        // Update budget if amount or category changed
        if (oldExpense.amount !== expense.amount ||
            oldExpense.category !== expense.category) {
            // Decrease old category
            await Budget.findOneAndUpdate({ userId: req.userId, category: oldExpense.category }, { $inc: { spent: -oldExpense.amount } });
            // Increase new category
            await Budget.findOneAndUpdate({ userId: req.userId, category: expense.category }, { $inc: { spent: expense.amount } });
        }
        res.json(expense);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findOneAndDelete({
            _id: req.params.id,
            userId: req.userId,
        });
        if (!expense) {
            res.status(404).json({ error: "Expense not found" });
            return;
        }
        // Update budget spent amount
        await Budget.findOneAndUpdate({ userId: req.userId, category: expense.category }, { $inc: { spent: -expense.amount } });
        res.json({ message: "Expense deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
