import mongoose, { Schema, Document } from "mongoose";

export enum ExpenseCategory {
  FOOD = "FOOD",
  TRANSPORT = "TRANSPORT",
  ENTERTAINMENT = "ENTERTAINMENT",
  UTILITIES = "UTILITIES",
  SHOPPING = "SHOPPING",
  HEALTH = "HEALTH",
  OTHER = "OTHER",
}

export interface IExpense extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: Date;
  description?: string;
  linkedTaskId?: mongoose.Types.ObjectId;
  isAutoCreated?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const expenseSchema = new Schema<IExpense>(
  {
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
  },
  { timestamps: true },
);

// Indexes for efficient queries
expenseSchema.index({ userId: 1, date: -1 });
expenseSchema.index({ userId: 1, category: 1 });

export const Expense =
  (mongoose.models.Expense as mongoose.Model<IExpense>) ||
  mongoose.model<IExpense>("Expense", expenseSchema);
