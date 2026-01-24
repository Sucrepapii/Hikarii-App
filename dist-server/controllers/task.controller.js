import { Task } from "../models/Task";
import { TaskStatus } from "../models/types";
export const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.userId }).sort({
            createdAt: -1,
        });
        res.json(tasks);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const createTask = async (req, res) => {
    try {
        const task = await Task.create({
            ...req.body,
            userId: req.userId,
        });
        res.status(201).json(task);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const getTaskById = async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            userId: req.userId,
        });
        if (!task) {
            res.status(404).json({ error: "Task not found" });
            return;
        }
        res.json(task);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const updateTask = async (req, res) => {
    try {
        const task = await Task.findOneAndUpdate({ _id: req.params.id, userId: req.userId }, req.body, { new: true, runValidators: true });
        if (!task) {
            res.status(404).json({ error: "Task not found" });
            return;
        }
        res.json(task);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            userId: req.userId,
        });
        if (!task) {
            res.status(404).json({ error: "Task not found" });
            return;
        }
        res.json({ message: "Task deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const toggleTaskStatus = async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            userId: req.userId,
        });
        if (!task) {
            res.status(404).json({ error: "Task not found" });
            return;
        }
        // Toggle between TODO and COMPLETED
        task.status =
            task.status === TaskStatus.COMPLETED
                ? TaskStatus.TODO
                : TaskStatus.COMPLETED;
        await task.save();
        res.json(task);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
