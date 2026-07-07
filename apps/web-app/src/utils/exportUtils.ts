import { Task } from "../types/task.types";
import { Expense } from "../types/budget.types";

/**
 * Convert JSON data to CSV format
 */
const convertToCSV = (objArray: any[]) => {
  if (!objArray || objArray.length === 0) return "";

  const array = typeof objArray !== "object" ? JSON.parse(objArray) : objArray;

  // Extract headers
  const headers = Object.keys(array[0]).join(",");

  // Extract rows
  const str = array
    .map((row: any) => {
      return Object.values(row)
        .map((value) => {
          // Handle dates and objects
          if (value instanceof Date) {
            return `"${value.toISOString()}"`;
          }
          if (typeof value === "object" && value !== null) {
            return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
          }
          if (typeof value === "string") {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        })
        .join(",");
    })
    .join("\r\n");

  return `${headers}\r\n${str}`;
};

/**
 * Trigger file download for CSV
 */
const downloadCSV = (csvContent: string, fileName: string) => {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

/**
 * Export Tasks to CSV
 */
export const exportTasks = (tasks: Task[]) => {
  const data = tasks.map((t) => ({
    ID: t.id,
    Title: t.title,
    Status: t.status,
    Priority: t.priority,
    DueDate: t.dueDate ? new Date(t.dueDate).toLocaleDateString() : "",
    CreatedAt: new Date(t.createdAt).toLocaleDateString(),
  }));
  const csv = convertToCSV(data);
  downloadCSV(
    csv,
    `hikari_tasks_${new Date().toISOString().split("T")[0]}.csv`,
  );
};

/**
 * Export Expenses to CSV
 */
export const exportExpenses = (expenses: Expense[]) => {
  const data = expenses.map((e) => ({
    ID: e.id,
    Title: e.title,
    Amount: e.amount,
    Category: e.category,
    Date: new Date(e.date).toLocaleDateString(),
    LinkedTask: e.linkedTaskId || "",
  }));
  const csv = convertToCSV(data);
  downloadCSV(
    csv,
    `hikari_expenses_${new Date().toISOString().split("T")[0]}.csv`,
  );
};
