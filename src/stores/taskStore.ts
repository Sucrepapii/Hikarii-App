import { create } from "zustand";
import { Task, TaskFinancials, TaskType } from "../types/task.types";
import apiClient from "../api/client";

interface TaskStore {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  activeSplitTaskId: string | null; // Global state for split modal

  // CRUD operations
  fetchTasks: () => Promise<void>;
  addTask: (task: Omit<Task, "id" | "createdAt">) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTaskStatus: (id: string) => Promise<void>;
  getTaskById: (id: string) => Task | undefined;

  // Financial integration methods
  updateTaskFinancials: (
    id: string,
    financials: Partial<TaskFinancials>,
  ) => Promise<void>;
  getTasksWithFinancialImpact: () => Task[];
  getIncomeTasks: () => Task[];
  getExpenseTasks: () => Task[];
  analyzeTask: (id: string) => Promise<void>;
  scheduleTaskBlocks: (id: string) => Promise<any>;
  openSplitModal: (taskId: string) => void;
  closeSplitModal: () => void;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,
  activeSplitTaskId: null,

  fetchTasks: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await apiClient.get("/tasks");
      set({ tasks: response.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Failed to fetch tasks",
        isLoading: false,
      });
    }
  },

  addTask: async (task) => {
    try {
      set({ isLoading: true, error: null });
      const response = await apiClient.post("/tasks", task);
      set((state) => ({
        tasks: [...state.tasks, response.data],
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Failed to create task",
        isLoading: false,
      });
      throw error;
    }
  },

  updateTask: async (id, updates) => {
    try {
      set({ isLoading: true, error: null });
      const response = await apiClient.put(`/tasks/${id}`, updates);
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === id ? response.data : task,
        ),
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Failed to update task",
        isLoading: false,
      });
      throw error;
    }
  },

  deleteTask: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await apiClient.delete(`/tasks/${id}`);
      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== id),
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Failed to delete task",
        isLoading: false,
      });
      throw error;
    }
  },

  toggleTaskStatus: async (id) => {
    try {
      const response = await apiClient.patch(`/tasks/${id}/toggle`);
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === id ? response.data : task,
        ),
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.error || "Failed to toggle task" });
      throw error;
    }
  },

  getTaskById: (id) => {
    return get().tasks.find((task) => task.id === id);
  },

  updateTaskFinancials: async (id, financials) => {
    const task = get().tasks.find((t) => t.id === id);
    if (!task) return;

    const updatedFinancials = {
      ...task.financials,
      ...financials,
      type: financials.type || task.financials?.type || TaskType.NEUTRAL,
      cashFlowImpact:
        (financials.actualIncome ||
          task.financials?.actualIncome ||
          financials.estimatedIncome ||
          0) -
        (financials.actualCost ||
          task.financials?.actualCost ||
          financials.estimatedCost ||
          0),
    };

    await get().updateTask(id, { financials: updatedFinancials });
  },

  getTasksWithFinancialImpact: () => {
    return get().tasks.filter((task) => task.financials !== undefined);
  },

  getIncomeTasks: () => {
    return get().tasks.filter(
      (task) => task.financials?.type === TaskType.INCOME,
    );
  },

  getExpenseTasks: () => {
    return get().tasks.filter(
      (task) => task.financials?.type === TaskType.EXPENSE,
    );
  },

  analyzeTask: async (id) => {
    try {
      // Don't set global loading, maybe just local UI loading handled by component
      const response = await apiClient.post(`/tasks/${id}/analyze-split`);

      if (response.data.blocks) {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, blocks: response.data.blocks } : task,
          ),
        }));
      }
    } catch (error: any) {
      console.error("Analysis failed", error);
      throw error;
    }
  },

  scheduleTaskBlocks: async (id: string) => {
    try {
      const response = await apiClient.post(`/tasks/${id}/schedule-blocks`);
      if (response.data.results) {
        // Update task blocks with googleEventIds if returned
        set((state) => ({
          tasks: state.tasks.map((task) => {
            if (task.id !== id || !task.blocks) return task;

            const updatedBlocks = task.blocks.map((block) => {
              const result = response.data.results.find(
                (r: any) => r.blockId === block.id,
              );
              return result
                ? { ...block, googleEventId: result.googleEventId }
                : block;
            });

            return { ...task, blocks: updatedBlocks };
          }),
        }));
      }
      console.error("Scheduling failed", error);
      throw error;
    }
  },

  openSplitModal: (taskId: string) => {
    set({ activeSplitTaskId: taskId });
  },

  closeSplitModal: () => {
    set({ activeSplitTaskId: null });
  },
}));
