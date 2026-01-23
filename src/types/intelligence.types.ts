export enum InsightType {
  TASK_RECOMMENDATION = "TASK_RECOMMENDATION",
  BUDGET_WARNING = "BUDGET_WARNING",
  CASH_FLOW_ALERT = "CASH_FLOW_ALERT",
  POSTPONE_SUGGESTION = "POSTPONE_SUGGESTION",
}

export enum InsightPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

export interface Insight {
  id: string;
  type: InsightType;
  priority: InsightPriority;
  title: string;
  message: string;
  actionable: boolean;
  taskId?: string;
  expenseId?: string;
  suggestedAction?: string;
  financialImpact?: number;
  createdAt: Date;
}

export interface TaskRecommendation {
  taskId: string;
  reason: string;
  urgencyScore: number; // 0-100
  financialContext: string;
}
