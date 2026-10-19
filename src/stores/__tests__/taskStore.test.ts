import { describe, it, expect, vi, beforeEach } from "vitest";
import { useTaskStore } from "../taskStore";
import apiClient from "../../api/client";
import { queueForSync } from "../../utils/syncManager";
import { TaskStatus, TaskPriority, TaskType, Task } from "../../types/task.types";

vi.mock("../../api/client", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("../../utils/syncManager", () => ({
  queueForSync: vi.fn(),
}));

vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("taskStore Unit Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useTaskStore.setState({
      tasks: [],
      isLoading: false,
      error: null,
      activeSplitTaskId: null,
    });
  });

  describe("fetchTasks", () => {
    it("should fetch tasks successfully and update store", async () => {
      const mockTasks: Task[] = [
        {
          id: "t1",
          title: "Complete Thesis",
          status: TaskStatus.TODO,
          priority: TaskPriority.HIGH,
          dueDate: new Date(),
          tags: ["study"],
          createdAt: new Date(),
        },
      ];

      (apiClient.get as any).mockResolvedValueOnce({ data: mockTasks });

      await useTaskStore.getState().fetchTasks();

      expect(apiClient.get).toHaveBeenCalledWith("/tasks");
      expect(useTaskStore.getState().tasks).toEqual(mockTasks);
      expect(useTaskStore.getState().isLoading).toBe(false);
      expect(useTaskStore.getState().error).toBeNull();
    });

    it("should set error state when fetchTasks fails", async () => {
      (apiClient.get as any).mockRejectedValueOnce({
        response: { data: { error: "Network error" } },
      });

      await useTaskStore.getState().fetchTasks();

      expect(useTaskStore.getState().error).toBe("Network error");
      expect(useTaskStore.getState().isLoading).toBe(false);
    });
  });

  describe("addTask", () => {
    it("should create task online and append to list", async () => {
      Object.defineProperty(navigator, "onLine", { value: true, configurable: true });

      const newTask = {
        title: "Buy Textbooks",
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
        dueDate: new Date(),
        tags: ["school"],
      };

      const serverTask: Task = {
        ...newTask,
        id: "server-t1",
        createdAt: new Date(),
      };

      (apiClient.post as any).mockResolvedValueOnce({ data: serverTask });

      await useTaskStore.getState().addTask(newTask as any);

      expect(apiClient.post).toHaveBeenCalledWith("/tasks", newTask);
      expect(useTaskStore.getState().tasks).toContainEqual(serverTask);
    });

    it("should queue task offline when navigator.onLine is false", async () => {
      Object.defineProperty(navigator, "onLine", { value: false, configurable: true });

      const offlineTask = {
        title: "Offline Task",
        status: TaskStatus.TODO,
        priority: TaskPriority.LOW,
        dueDate: new Date(),
        tags: [],
      };

      await useTaskStore.getState().addTask(offlineTask as any);

      expect(queueForSync).toHaveBeenCalledWith(
        "task",
        offlineTask,
        expect.stringMatching(/^temp-/)
      );
      expect(useTaskStore.getState().tasks).toHaveLength(1);
      expect(useTaskStore.getState().tasks[0].title).toBe("Offline Task");
    });
  });

  describe("updateTask & deleteTask", () => {
    it("should update task properties in store", async () => {
      const initialTask: Task = {
        id: "t-edit",
        title: "Original Title",
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
        dueDate: new Date(),
        tags: [],
        createdAt: new Date(),
      };
      useTaskStore.setState({ tasks: [initialTask] });

      const updatedTask: Task = { ...initialTask, title: "Updated Title" };
      (apiClient.put as any).mockResolvedValueOnce({ data: updatedTask });

      await useTaskStore.getState().updateTask("t-edit", { title: "Updated Title" });

      expect(apiClient.put).toHaveBeenCalledWith("/tasks/t-edit", { title: "Updated Title" });
      expect(useTaskStore.getState().tasks[0].title).toBe("Updated Title");
    });

    it("should delete task and remove from store", async () => {
      const task: Task = {
        id: "t-delete",
        title: "To Be Deleted",
        status: TaskStatus.TODO,
        priority: TaskPriority.LOW,
        dueDate: new Date(),
        tags: [],
        createdAt: new Date(),
      };
      useTaskStore.setState({ tasks: [task] });

      (apiClient.delete as any).mockResolvedValueOnce({ data: { success: true } });

      await useTaskStore.getState().deleteTask("t-delete");

      expect(apiClient.delete).toHaveBeenCalledWith("/tasks/t-delete");
      expect(useTaskStore.getState().tasks).toHaveLength(0);
    });
  });

  describe("toggleTaskStatus", () => {
    it("should toggle task status between TODO and COMPLETED", async () => {
      const task: Task = {
        id: "t-toggle",
        title: "Toggle Me",
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
        dueDate: new Date(),
        tags: [],
        createdAt: new Date(),
      };
      useTaskStore.setState({ tasks: [task] });

      const completedTask = { ...task, status: TaskStatus.COMPLETED };
      (apiClient.patch as any).mockResolvedValueOnce({ data: completedTask });

      await useTaskStore.getState().toggleTaskStatus("t-toggle");

      expect(apiClient.patch).toHaveBeenCalledWith("/tasks/t-toggle/toggle");
      expect(useTaskStore.getState().tasks[0].status).toBe(TaskStatus.COMPLETED);
    });
  });

  describe("financial helper methods", () => {
    it("should correctly classify income, expense, and neutral tasks", () => {
      const incomeTask: Task = {
        id: "t-inc",
        title: "Freelance Gig",
        status: TaskStatus.TODO,
        priority: TaskPriority.HIGH,
        dueDate: new Date(),
        tags: [],
        financials: { type: TaskType.INCOME, estimatedIncome: 500, cashFlowImpact: 500 },
        createdAt: new Date(),
      };
      const expenseTask: Task = {
        id: "t-exp",
        title: "Pay Rent",
        status: TaskStatus.TODO,
        priority: TaskPriority.URGENT,
        dueDate: new Date(),
        tags: [],
        financials: { type: TaskType.EXPENSE, estimatedCost: 1200, cashFlowImpact: -1200 },
        createdAt: new Date(),
      };
      const neutralTask: Task = {
        id: "t-neu",
        title: "Gym Workout",
        status: TaskStatus.TODO,
        priority: TaskPriority.LOW,
        dueDate: new Date(),
        tags: [],
        createdAt: new Date(),
      };

      useTaskStore.setState({ tasks: [incomeTask, expenseTask, neutralTask] });

      expect(useTaskStore.getState().getIncomeTasks()).toEqual([incomeTask]);
      expect(useTaskStore.getState().getExpenseTasks()).toEqual([expenseTask]);
      expect(useTaskStore.getState().getTasksWithFinancialImpact()).toEqual([incomeTask, expenseTask]);
    });
  });

  describe("split modal state", () => {
    it("should open and close split modal", () => {
      useTaskStore.getState().openSplitModal("task-split-123");
      expect(useTaskStore.getState().activeSplitTaskId).toBe("task-split-123");

      useTaskStore.getState().closeSplitModal();
      expect(useTaskStore.getState().activeSplitTaskId).toBeNull();
    });
  });
});
