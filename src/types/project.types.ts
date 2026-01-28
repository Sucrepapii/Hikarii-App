import { Task } from "./task.types";
import { Expense } from "./budget.types";

export interface Project {
  id: string;
  title: string;
  description?: string;
  status: "ACTIVE" | "ARCHIVED" | "COMPLETED";
  startDate?: string;
  endDate?: string;
  budgetLimit?: number;
  userId: string;
  tasks?: Task[];
  expenses?: Expense[];
  progress?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectSummary {
  projectId: string;
  progress: number;
  totalSpent: number;
  budgetLimit: number;
  budgetHealth: number;
  daysRemaining: number | null;
}

export interface CreateProjectData {
  title: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  budgetLimit?: number;
}
