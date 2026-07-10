import apiClient from "../api/client";
import { useTaskStore } from "../stores/taskStore";
import { useBudgetStore } from "../stores/budgetStore";
import toast from "react-hot-toast";

interface SyncItem {
  id: string; // temp id
  type: "task" | "expense";
  payload: any;
}

const SYNC_QUEUE_KEY = "Hikarii-sync-queue";

export const getSyncQueue = (): SyncItem[] => {
  try {
    const raw = localStorage.getItem(SYNC_QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Failed to read sync queue", e);
    return [];
  }
};

export const saveSyncQueue = (queue: SyncItem[]) => {
  localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
};

export const queueForSync = (type: "task" | "expense", payload: any, tempId: string) => {
  const queue = getSyncQueue();
  queue.push({ id: tempId, type, payload });
  saveSyncQueue(queue);
  
  toast.success(`Saved offline. Will sync when online!`, {
    icon: "📴",
  });
};

let isSyncing = false;

export const triggerSync = async () => {
  if (isSyncing || !navigator.onLine) return;
  
  const queue = getSyncQueue();
  if (queue.length === 0) return;
  
  isSyncing = true;
  const toastId = toast.loading("Syncing offline changes...", { icon: "🔄" });
  
  const failedItems: SyncItem[] = [];
  
  for (const item of queue) {
    try {
      if (item.type === "task") {
        await apiClient.post("/tasks", item.payload);
      } else if (item.type === "expense") {
        await apiClient.post("/expenses", item.payload);
      }
    } catch (err) {
      console.error(`Failed to sync item ${item.id}`, err);
      // Keep in queue to retry next time
      failedItems.push(item);
    }
  }
  
  saveSyncQueue(failedItems);
  isSyncing = false;
  
  if (failedItems.length === 0) {
    toast.success("All offline changes synced successfully!", { id: toastId });
  } else {
    toast.error(`Sync completed with some failures. Retrying later.`, { id: toastId });
  }
  
  // Refresh stores to ensure UI matches database state
  try {
    await Promise.all([
      useTaskStore.getState().fetchTasks(),
      useBudgetStore.getState().fetchExpenses(),
      useBudgetStore.getState().fetchBudgets(),
    ]);
  } catch (err) {
    console.error("Failed to refresh stores after sync", err);
  }
};

// Initialize listeners
if (typeof window !== "undefined") {
  window.addEventListener("online", () => {
    triggerSync();
  });
}
