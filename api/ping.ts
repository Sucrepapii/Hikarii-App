export default function handler(_req: any, res: any) {
  res.status(200).json({
    status: "pong",
    timestamp: new Date().toISOString(),
    env: {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: process.env.VERCEL,
    },
  });
}
