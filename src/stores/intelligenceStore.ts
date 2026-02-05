import { create } from "zustand";
import toast from "react-hot-toast";
import { Insight, TaskRecommendation } from "../types/intelligence.types";
import apiClient from "../api/client";

interface IntelligenceStore {
  insights: Insight[];
  recommendations: TaskRecommendation[];
  lastRefresh: Date | null;
  isLoading: boolean;
  error: string | null;

  refreshInsights: () => Promise<void>;
  dismissInsight: (id: string) => void;
  clearAllInsights: () => void;
}

export const useIntelligenceStore = create<IntelligenceStore>((set) => ({
  insights: [],
  recommendations: [],
  lastRefresh: null,
  isLoading: false,
  error: null,

  refreshInsights: async () => {
    try {
      set({ isLoading: true, error: null });

      const [insightsResponse, recommendationsResponse] = await Promise.all([
        apiClient.get("/insights"),
        apiClient.get("/insights/recommendations"),
      ]);

      set({
        insights: insightsResponse.data.insights || [],
        recommendations:
          recommendationsResponse.data.recommendations?.map((r: any) => ({
            taskId: r.taskId,
            reason: `Priority: ${r.task.priority}`,
            urgencyScore: r.urgencyScore,
            financialContext: r.task.financials?.estimatedCost
              ? "Has associated cost"
              : "",
            estimatedCost: r.task.financials?.estimatedCost || 0,
          })) || [],
        lastRefresh: new Date(),
        isLoading: false,
      });
    } catch (error: any) {
      const message = error.response?.data?.error || "Failed to fetch insights";
      toast.error(message);
      set({
        error: message,
        isLoading: false,
      });
    }
  },

  dismissInsight: (id) => {
    set((state) => ({
      insights: state.insights.filter((i) => i.id !== id),
    }));
  },

  clearAllInsights: () => {
    set({ insights: [], recommendations: [] });
  },
}));
