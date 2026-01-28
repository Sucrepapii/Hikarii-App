import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { PatternDetectionService } from "../services/pattern.service";
import prisma from "../config/db";

const patternService = new PatternDetectionService();

export const detectPatterns = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    // This triggers the analysis logic
    const patterns = await patternService.detectPatterns(req.userId);

    // Also fetch all current patterns to return comprehensive list
    const allPatterns = await prisma.recurringExpense.findMany({
      where: { userId: req.userId },
      orderBy: { nextDueDate: "asc" },
    });

    res.json({
      newlyDetected: patterns.length,
      patterns: allPatterns,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getPatterns = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const patterns = await prisma.recurringExpense.findMany({
      where: { userId: req.userId },
      orderBy: { nextDueDate: "asc" },
    });
    res.json(patterns);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const confirmPattern = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const pattern = await prisma.recurringExpense.findFirst({
      where: { id, userId: req.userId },
    });

    if (!pattern) {
      res.status(404).json({ error: "Pattern not found" });
      return;
    }

    const updated = await prisma.recurringExpense.update({
      where: { id },
      data: { isConfirmed: true },
    });

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deletePattern = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const id = req.params.id as string;
    // Verify ownership
    const pattern = await prisma.recurringExpense.findFirst({
      where: { id, userId: req.userId },
    });

    if (!pattern) {
      res.status(404).json({ error: "Pattern not found" });
      return;
    }

    await prisma.recurringExpense.delete({
      where: { id },
    });

    res.json({ message: "Pattern deleted" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
