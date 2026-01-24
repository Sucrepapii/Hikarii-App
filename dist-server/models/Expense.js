import mongoose, { Schema } from "mongoose";
import { ExpenseCategory } from "./types";
const expenseSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true,
        maxlength: [100, "Title cannot exceed 100 characters"],
    },
    amount: {
        type: Number,
        required: [true, "Amount is required"],
        min: [0, "Amount must be positive"],
    },
    category: {
        type: String,
        enum: Object.values(ExpenseCategory),
        required: [true, "Category is required"],
    },
    date: {
        type: Date,
        default: Date.now,
    },
    description: {
        type: String,
        trim: true,
        maxlength: [300, "Description cannot exceed 300 characters"],
    },
    linkedTaskId: {
        type: Schema.Types.ObjectId,
        ref: "Task",
    },
    isAutoCreated: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
// Indexes for efficient queries
expenseSchema.index({ userId: 1, date: -1 });
expenseSchema.index({ userId: 1, category: 1 });
export const Expense = mongoose.models.Expense ||
    mongoose.model("Expense", expenseSchema);
