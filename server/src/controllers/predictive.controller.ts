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
You are Hikari, the friendly, concise, and helpful AI assistant built directly into the Hikari Task & Budget application.

CRITICAL RULE: You MUST ONLY answer questions related to the Hikari application, the user's tasks, the user's budgets, or general productivity and financial advice. If the user asks about anything outside of this scope (e.g., coding, general history, weather, trivia), politely decline and remind them you are here to help with their tasks and budget.

Use the following user data to provide context for their query:

Active Budgets:
${budgetsContext || "No budgets set yet."}

Active Tasks:
${tasksContext || "No tasks created yet."}

Instructions:
1. Be highly concise and conversational. Do not use overly formal buzzwords like "radical clarity," "financial mastery," or "elite execution." 
2. Give practical, short answers. If they ask "Can I afford dinner?", give a quick "Yes/No" and a 1-2 sentence reason based on their FOOD or ENTERTAINMENT budget.
3. Keep formatting simple. Use bullet points only if necessary, and avoid long, multi-paragraph essays.
4. Do not invent data. If they ask about something not in their budgets/tasks, tell them it's not currently tracked.

User Query: "${query}"
    `;

    const result = await model.generateContent(systemPrompt);
    const reply = result.response.text();

    res.json({ reply });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
