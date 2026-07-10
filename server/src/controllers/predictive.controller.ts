import { Request, Response } from "express";
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
    const forecasts = await predictiveService.generateForecast(req.userId as string);
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
You are Hikarii, the friendly, concise, and helpful AI assistant built directly into the Hikarii Task & Budget application.

CRITICAL RULE: You MUST ONLY answer questions related to the Hikarii application, the user's tasks, the user's budgets, or general productivity and financial advice. If the user asks about anything outside of this scope (e.g., coding, general history, weather, trivia), politely decline and remind them you are here to help with their tasks and budget.

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

export const getSupportBotResponse = async (
  req: Request,
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

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const systemPrompt = `
You are Hikarii Support, the friendly, concise, and helpful public AI assistant for the Hikarii Task & Budget application.

CRITICAL RULE: You do NOT have access to the user's personal budgets, tasks, or financial data. 
If the user asks personal financial questions (e.g., "Can I afford dinner?", "What is my budget?"), politely inform them that you are a public support assistant and cannot view their private data, and direct them to log in and use the AI Coach inside the app for personalized insights.

CRITICAL RULE 2: You MUST ONLY answer questions related to the Hikarii application (features, pricing, the Hikarii Method, how to use the app) or general productivity/financial advice. If they ask about unrelated topics (e.g., coding, trivia, history), politely decline.

Instructions:
1. Be highly concise, welcoming, and conversational. 
2. Give practical, short answers. 
3. Keep formatting simple. Use bullet points only if necessary.
4. Do not invent features that don't exist. Hikarii is a premium productivity and financial management app with features like AI Smart Split, Budgets, and Tasks. (Note: there is no "New List" feature, just Tasks and Projects).

CRITICAL INSTRUCTION: If you mention a specific feature that has a page in the app, you MUST provide a markdown link to it using this exact format: [Page Name](/path). 
Valid paths are:
- Tasks page: [Tasks](/tasks)
- Budget page: [Budget](/budget)
- AI Coach: [AI Coach](/ai-coach)
- Dashboard: [Dashboard](/dashboard)
- Pricing/Billing: [Pro Plan](/pro)

Do not invent other paths. If they ask how to create a task, say something like: "You can create a task by visiting the [Tasks](/tasks) page and clicking 'Add Task'."

User Query: "${query}"
    `;

    const result = await model.generateContent(systemPrompt);
    const reply = result.response.text();

    res.json({ reply });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
