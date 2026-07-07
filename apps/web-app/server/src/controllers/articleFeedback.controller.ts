import { Request, Response } from "express";
import prisma from "../config/db";

// Create Article Feedback
export const createArticleFeedback = async (req: Request, res: Response) => {
  try {
    const { articleSlug, isHelpful } = req.body;

    if (!articleSlug) {
      return res.status(400).json({ error: "Article slug is required" });
    }

    const feedback = await prisma.articleFeedback.create({
      data: {
        articleSlug,
        isHelpful: Boolean(isHelpful),
      },
    });

    res.status(201).json(feedback);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get Analytics for Article Feedback
export const getArticleFeedbackStats = async (req: Request, res: Response) => {
  try {
    const stats = await prisma.articleFeedback.groupBy({
      by: ["articleSlug", "isHelpful"],
      _count: {
        id: true,
      },
    });
    res.json(stats);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
