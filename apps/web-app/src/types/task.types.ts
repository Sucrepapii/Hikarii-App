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
  EXPENSE = "EXPENSE", // Task that costs money (e.g., "Fix laptop")
  INCOME = "INCOME", // Task that generates money (e.g., "Freelance project")
  NEUTRAL = "NEUTRAL", // No direct financial impact
}

export interface TaskBlock {
  id: string;
  title: string;
  duration: number; // minutes
  order: number;
  taskId: string;
  googleEventId?: string;
  scheduledStart?: Date;
  scheduledEnd?: Date;
}

export interface TaskFinancials {
  type: TaskType;
  estimatedCost?: number; // Expected expense amount
  actualCost?: number; // Real expense (when completed)
  estimatedIncome?: number; // Expected income
  actualIncome?: number; // Real income received
  linkedExpenseId?: string; // Auto-created expense
  lateFeePerDay?: number; // Penalty for delay
  cashFlowImpact: number; // Computed: negative for expenses, positive for income
}

export interface Task {
  id: string; // MongoDB ID (mapped from Prisma)
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date;
  createdAt: Date;
  tags: string[];
  estimatedDuration?: number; // minutes
  financials?: TaskFinancials; // Financial data for task-money intelligence
  blocks?: TaskBlock[];
  projectId?: string;
}

export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  searchQuery?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}
