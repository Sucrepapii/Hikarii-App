import app from "../server/src/server";
import connectDB from "../server/src/config/database";

export default async (req: any, res: any) => {
  try {
    console.log(`[API Request] ${req.method} ${req.url}`);

    if (!process.env.MONGODB_URI) {
      console.error("FATAL: MONGODB_URI is not defined");
      return res
        .status(500)
        .json({ error: "Configuration Error: MONGODB_URI is missing" });
    }

    await connectDB();
    return app(req, res);
  } catch (error: any) {
    console.error("Vercel Function Runtime Error:", error);
    res.status(500).json({
      error: "Function Invocation Failed",
      message: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};
