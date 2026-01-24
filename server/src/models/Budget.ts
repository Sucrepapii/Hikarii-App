import mongoose, { Schema, Document } from "mongoose";
import { ExpenseCategory } from "./Expense";

export enum BudgetPeriod {
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
  YEARLY = "YEARLY",
}

export interface IBudget extends Document {
  userId: mongoose.Types.ObjectId;
  category: ExpenseCategory;
  limit: number;
  spent: number;
  period: BudgetPeriod;
  createdAt: Date;
  updatedAt: Date;
}

const budgetSchema = new Schema<IBudget>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    category: {
      type: String,
      enum: Object.values(ExpenseCategory),
      required: [true, "Category is required"],
    },
    limit: {
      type: Number,
      required: [true, "Limit is required"],
      min: [0, "Limit must be positive"],
    },
    spent: {
      type: Number,
      default: 0,
      min: [0, "Spent cannot be negative"],
    },
    period: {
      type: String,
      enum: Object.values(BudgetPeriod),
      default: BudgetPeriod.MONTHLY,
    },
  },
  { timestamps: true },
);

// Unique constraint: one budget per category per user
budgetSchema.index({ userId: 1, category: 1 }, { unique: true });

export const Budget =
  (mongoose.models.Budget as mongoose.Model<IBudget>) ||
  mongoose.model<IBudget>("Budget", budgetSchema);
