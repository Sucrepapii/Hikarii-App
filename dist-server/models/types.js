// import mongoose from "mongoose";
// Enums
export var TaskStatus;
(function (TaskStatus) {
    TaskStatus["TODO"] = "TODO";
    TaskStatus["IN_PROGRESS"] = "IN_PROGRESS";
    TaskStatus["COMPLETED"] = "COMPLETED";
})(TaskStatus || (TaskStatus = {}));
export var TaskPriority;
(function (TaskPriority) {
    TaskPriority["LOW"] = "LOW";
    TaskPriority["MEDIUM"] = "MEDIUM";
    TaskPriority["HIGH"] = "HIGH";
    TaskPriority["URGENT"] = "URGENT";
})(TaskPriority || (TaskPriority = {}));
export var TaskType;
(function (TaskType) {
    TaskType["EXPENSE"] = "EXPENSE";
    TaskType["INCOME"] = "INCOME";
    TaskType["NEUTRAL"] = "NEUTRAL";
})(TaskType || (TaskType = {}));
export var BudgetPeriod;
(function (BudgetPeriod) {
    BudgetPeriod["DAILY"] = "DAILY";
    BudgetPeriod["WEEKLY"] = "WEEKLY";
    BudgetPeriod["MONTHLY"] = "MONTHLY";
    BudgetPeriod["YEARLY"] = "YEARLY";
})(BudgetPeriod || (BudgetPeriod = {}));
export var ExpenseCategory;
(function (ExpenseCategory) {
    ExpenseCategory["FOOD"] = "FOOD";
    ExpenseCategory["TRANSPORT"] = "TRANSPORT";
    ExpenseCategory["ENTERTAINMENT"] = "ENTERTAINMENT";
    ExpenseCategory["UTILITIES"] = "UTILITIES";
    ExpenseCategory["SHOPPING"] = "SHOPPING";
    ExpenseCategory["HEALTH"] = "HEALTH";
    ExpenseCategory["OTHER"] = "OTHER";
})(ExpenseCategory || (ExpenseCategory = {}));
