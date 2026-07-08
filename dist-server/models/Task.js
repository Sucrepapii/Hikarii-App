import mongoose, { Schema } from "mongoose";
import { TaskStatus, TaskPriority, TaskType } from "./types";
const taskSchema = new Schema({
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
}, { timestamps: true });
// Index for efficient queries
taskSchema.index({ userId: 1, status: 1 });
taskSchema.index({ userId: 1, dueDate: 1 });
export const Task = mongoose.models.Task ||
    mongoose.model("Task", taskSchema);
