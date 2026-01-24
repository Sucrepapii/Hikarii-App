import app from "../server/src/server";
import connectDB from "../server/src/config/database";

export default async (req: any, res: any) => {
  try {
    await connectDB();
    return app(req, res);
  } catch (error: any) {
    console.error("Vercel Function Error:", error);
    res.status(500).json({ error: error.message || "Server Error" });
  }
};
