import prisma from "./src/config/db";
import { PatternDetectionService } from "./src/services/pattern.service";

async function run() {
  const user = await prisma.user.findFirst();
  console.log("Testing User:", user?.name);
  if (!user) return;

  const svc = new PatternDetectionService();
  const res = await svc.detectPatterns(user.id);

  console.log("\n--- SCAN RESULT ---");
  console.log(JSON.stringify(res, null, 2));
}

run();
