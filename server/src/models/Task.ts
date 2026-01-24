import mongoose, { Schema, Document } from "mongoose";

export enum TaskStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

export enum TaskPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  URGENT = "URGENT",
}

export enum TaskType {
  EXPENSE = "EXPENSE",
  INCOME = "INCOME",
  NEUTRAL = "NEUTRAL",
}

export interface TaskFinancials {
  type: TaskType;
  estimatedCost?: number;
  actualCost?: number;
  estimatedIncome?: number;
  actualIncome?: number;
  linkedExpenseId?: string;
  lateFeePerDay?: number;
  cashFlowImpact: number;
}

export interface ITask extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date;
  tags: string[];
  financials?: TaskFinancials;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
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
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    status: {
      type: String,
      enum: Object.values(TaskStatus),
      default: TaskStatus.TODO,
    },
    priority: {
      type: String,
      enum: Object.values(TaskPriority),
      default: TaskPriority.MEDIUM,
    },
    dueDate: {
      type: Date,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    financials: {
      type: {
        type: String,
        enum: Object.values(TaskType),
      },
      estimatedCost: Number,
      actualCost: Number,
      estimatedIncome: Number,
      actualIncome: Number,
      linkedExpenseId: String,
      lateFeePerDay: Number,
      cashFlowImpact: {
        type: Number,
        default: 0,
      },
    },
  },
  { timestamps: true },
);

// Index for efficient queries
taskSchema.index({ userId: 1, status: 1 });
taskSchema.index({ userId: 1, dueDate: 1 });

export const Task =
  mongoose.models.Task || mongoose.model<ITask>("Task", taskSchema);
