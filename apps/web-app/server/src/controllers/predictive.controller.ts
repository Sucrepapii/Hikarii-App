import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { PredictiveService } from "../services/predictive.service";
import prisma from "../config/db";
import { GoogleGenerativeAI } from "@google/generative-ai";

const predictiveService = new PredictiveService();

export const getForecast = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const forecasts = await predictiveService.generateForecast(req.userId);
    res.json(forecasts);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getCoachResponse = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { query } = req.body;
    if (!query) {
      res.status(400).json({ error: "Query is required" });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      res.status(500).json({ error: "AI Features are currently disabled (missing API key)" });
      return;
    }

    // Load active budgets and tasks for the user as context
    const [tasks, budgets] = await Promise.all([
      prisma.task.findMany({ where: { userId: req.userId } }),
      prisma.budget.findMany({ where: { userId: req.userId } }),
    ]);

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    // Format context
    const budgetsContext = budgets.map(b => `- Category: ${b.category}, Limit: ${b.limit}, Spent: ${b.spent}`).join("\n");
    const tasksContext = tasks.map(t => `- Title: ${t.title}, Priority: ${t.priority}, Status: ${t.status}, Type: ${(t.financials as any)?.type || 'NEUTRAL'}, Cost: ${(t.financials as any)?.estimatedCost || 0}, Income: ${(t.financials as any)?.estimatedIncome || 0}, Due: ${t.dueDate ? new Date(t.dueDate).toLocaleDateString() : 'N/A'}`).join("\n");

    const systemPrompt = `
You are Hikari, a financial and productivity assistant. You analyze the user's tasks and budgets to give them "radical clarity", in a hope-driven, premium, encouraging way.
Use the following user data to provide context for their query:

Active Budgets:
${budgetsContext || "No budgets set yet."}

Active Tasks:
${tasksContext || "No tasks created yet."}

Instructions:
- Give concise, smart, actionable recommendations based on the user's query and their data.
- Keep responses friendly but focused on time and money optimization (e.g. spending habits, saving opportunities, prioritizing high-value or overdue tasks).
- Do not make up information. If they ask about something not in their data, politely answer that you don't track it, but relate it back to how they can manage their finances in Hikari.

User Query: "${query}"
    `;

    const result = await model.generateContent(systemPrompt);
    const reply = result.response.text();

    res.json({ reply });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
