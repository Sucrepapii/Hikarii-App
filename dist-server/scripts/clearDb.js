// import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/database";
import { User } from "../models/User";
import { Task } from "../models/Task";
import { Budget } from "../models/Budget";
import { Expense } from "../models/Expense";
dotenv.config();
const clearDb = async () => {
    try {
        await connectDB();
        console.log("🗑️  Clearing database...");
        await User.deleteMany({});
        console.log("✅ Users cleared");
        await Task.deleteMany({});
        console.log("✅ Tasks cleared");
        await Budget.deleteMany({});
        console.log("✅ Budgets cleared");
        await Expense.deleteMany({});
        console.log("✅ Expenses cleared");
        console.log("✨ Database cleared successfully");
        process.exit(0);
    }
    catch (error) {
        console.error("❌ Error clearing database:", error);
        process.exit(1);
    }
};
clearDb();
