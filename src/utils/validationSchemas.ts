import { z } from "zod";
import { TaskStatus, TaskPriority, TaskType } from "../types/task.types";
import { ExpenseCategory } from "../types/budget.types";

export const taskSchema = z
  .object({
    title: z.string().min(1, "Title is required").max(100, "Title is too long"),
    description: z.string().max(500, "Description is too long").optional(),
    status: z.nativeEnum(TaskStatus),
    priority: z.nativeEnum(TaskPriority),
    dueDate: z.date({ required_error: "Due date is required" }),
    tags: z.array(z.string()).default([]),
    projectId: z.string().optional(),
    // Financial fields
    taskType: z.nativeEnum(TaskType).default(TaskType.NEUTRAL),
    estimatedCost: z.number().positive().optional(),
    estimatedIncome: z.number().positive().optional(),
    lateFeePerDay: z.number().positive().optional(),
    expenseCategory: z.nativeEnum(ExpenseCategory).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.taskType === TaskType.EXPENSE) {
      if (!data.estimatedCost) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Cost is required for expense tasks",
          path: ["estimatedCost"],
        });
      }
    }
    if (data.taskType === TaskType.INCOME) {
      if (!data.estimatedIncome) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Income amount is required",
          path: ["estimatedIncome"],
        });
      }
    }
  });

export const expenseSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  amount: z.number().positive("Amount must be positive"),
  category: z.nativeEnum(ExpenseCategory),
  date: z.date(),
  description: z.string().max(300, "Description is too long").optional(),
  linkedTaskId: z.string().optional(),
});

export const budgetSchema = z.object({
  category: z.nativeEnum(ExpenseCategory),
  limit: z.number().positive("Budget limit must be positive"),
});

export type TaskFormData = z.infer<typeof taskSchema>;
export type ExpenseFormData = z.infer<typeof expenseSchema>;
export type BudgetFormData = z.infer<typeof budgetSchema>;
