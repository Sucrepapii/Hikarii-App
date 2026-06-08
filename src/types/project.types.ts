import { Task } from "./task.types";
import { Expense } from "./budget.types";

export type CollaborationRole = "VIEW_ONLY" | "CAN_ADD_EXPENSES" | "CAN_EDIT";
export type InviteStatus = "PENDING" | "ACCEPTED" | "DECLINED";

export interface ProjectMember {
  id: string;
  projectId: string;
  userId: string | null;
  invitedEmail: string;
  invitedById: string;
  role: CollaborationRole;
  status: InviteStatus;
  token?: string | null;
  user?: { id: string; name: string; email: string } | null;
  createdAt: string;
}

export interface ProjectComment {
  id: string;
  projectId: string;
  userId: string;
  content: string;
  user: { id: string; name: string; email: string };
  createdAt: string;
}

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
  // Collaboration
  isShared?: boolean;
  memberRole?: CollaborationRole | null;
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
