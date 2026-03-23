import { Request, Response } from "express";
import prisma from "../config/db";

// Get All Feedback
export const getFeedbacks = async (req: Request, res: Response) => {
  try {
    const feedbacks = await prisma.feedback.findMany({
      orderBy: { createdAt: "desc" },
      take: 50, // Limit to recent 50
    });
    res.json(feedbacks);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Create Feedback
export const createFeedback = async (req: Request, res: Response) => {
  try {
    const { name, rating, comment } = req.body;

    const feedback = await prisma.feedback.create({
      data: {
        name: name || "Anonymous",
        rating: Number(rating),
        comment,
      },
    });

    res.status(201).json(feedback);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
