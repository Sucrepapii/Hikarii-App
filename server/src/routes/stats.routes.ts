import { Router, Request, Response } from "express";
import prisma from "../config/db";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const userCount = await prisma.user.count();
    
    const countries = await prisma.feedback.groupBy({
      by: ['country'],
      where: {
        country: {
          not: null
        }
      }
    });
    
    const countryCount = countries.length;

    const baseUsers = 3000;
    const baseCountries = 20;

    res.json({
      users: baseUsers + userCount,
      countries: baseCountries + countryCount,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
