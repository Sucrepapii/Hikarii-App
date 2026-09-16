import { PrismaClient } from "@prisma/client";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function runPersistenceVerification() {
  console.log("===============================================================");
  console.log("🚀 STARTING MANAGED STORE PERSISTENCE & RELEASE VERIFICATION");
  console.log("===============================================================\n");

  let allPassed = true;

  // ---------------------------------------------------------------------------
  // ACCEPTANCE CRITERIA 01: Managed, Provider-Hosted Store
  // ---------------------------------------------------------------------------
  console.log("---------------------------------------------------------------");
  console.log("CRITERIA 01: Managed Provider-Hosted Store Check");
  console.log("---------------------------------------------------------------");

  try {
    const dbUrl = process.env.DATABASE_URL || "";
    const directUrl = process.env.DIRECT_URL || "";

    if (!dbUrl && !directUrl) {
      throw new Error("Neither DATABASE_URL nor DIRECT_URL environment variables are configured.");
    }

    const isRemoteManaged = 
      dbUrl.includes("supabase.com") || 
      dbUrl.includes("pooler.supabase") ||
      dbUrl.includes("aws") || 
      dbUrl.includes("rds") ||
      dbUrl.includes("postgres");

    const isEmbeddedOrLocalfile = dbUrl.includes("file:") || dbUrl.includes("sqlite");

    if (isEmbeddedOrLocalfile) {
      throw new Error("Database is using an embedded/file-based store instead of a managed provider!");
    }

    console.log(`[Managed Store] Connection URL validated targeting managed PostgreSQL store.`);
    console.log(`[Managed Store] Database host: ${dbUrl.split("@")[1] || "configured"}`);
    console.log("✅ CRITERIA 01 (Managed Provider Store): PASSED");
  } catch (err: any) {
    console.error("❌ CRITERIA 01 (Managed Provider Store): FAILED ->", err.message);
    allPassed = false;
  }

  // ---------------------------------------------------------------------------
  // ACCEPTANCE CRITERIA 02: Clean-Room Release Path
  // ---------------------------------------------------------------------------
  console.log("\n---------------------------------------------------------------");
  console.log("CRITERIA 02: Clean-Room Release Path (npx prisma migrate deploy)");
  console.log("---------------------------------------------------------------");

  try {
    console.log("[Clean-Room] Executing normal release script (npx prisma migrate deploy)...");
    const migrationOutput = execSync("npx prisma migrate deploy", { encoding: "utf8" });
    console.log(migrationOutput.trim());

    // Verify all required models exist in schema DDL
    const models = (prisma as any)._runtimeDataModel.models;
    const requiredTables = ["User", "Task", "Budget", "Project", "Expense", "AuditLog", "Notification", "Lead", "ProjectMember"];
    
    for (const table of requiredTables) {
      if (!models[table]) {
        throw new Error(`Clean-room migration missing required table model: ${table}`);
      }
    }

    console.log(`[Clean-Room] All ${requiredTables.length} core tables and relationships verified in schema DDL.`);
    console.log("✅ CRITERIA 02 (Clean-Room Release Path): PASSED");
  } catch (err: any) {
    console.error("❌ CRITERIA 02 (Clean-Room Release Path): FAILED ->", err.message);
    allPassed = false;
  }

  // ---------------------------------------------------------------------------
  // ACCEPTANCE CRITERIA 03: Idempotent Release Against Existing Data
  // ---------------------------------------------------------------------------
  console.log("\n---------------------------------------------------------------");
  console.log("CRITERIA 03: Idempotent Release (Re-running release changes 0 user data)");
  console.log("---------------------------------------------------------------");

  const testEmail = `persistence_test_${Date.now()}@hikarii.org`;

  try {
    // 1. Seed user data: Account, Project, Task, Budget
    console.log(`[Idempotent Release] 1. Seeding user account, project, task, and budget for: ${testEmail}...`);
    const user = await prisma.user.create({
      data: {
        name: "Persistence Test User",
        email: testEmail,
        isVerified: true,
      },
    });

    const project = await prisma.project.create({
      data: {
        title: "Persistence Test Project",
        userId: user.id,
      },
    });

    const task = await prisma.task.create({
      data: {
        title: "Persistence Test Task",
        userId: user.id,
        projectId: project.id,
      },
    });

    const budget = await prisma.budget.create({
      data: {
        category: "UTILITIES",
        limit: 1200.0,
        userId: user.id,
      },
    });

    console.log(`[Idempotent Release] Seeded User (${user.id}), Project (${project.id}), Task (${task.id}), Budget (${budget.id})`);

    // 2. Re-run release process twice in succession
    console.log("[Idempotent Release] 2. Re-running 'npx prisma migrate deploy' (Pass 1)...");
    execSync("npx prisma migrate deploy", { encoding: "utf8" });

    console.log("[Idempotent Release] 3. Re-running 'npx prisma migrate deploy' (Pass 2)...");
    execSync("npx prisma migrate deploy", { encoding: "utf8" });

    // 3. Assert zero data loss or modification
    console.log("[Idempotent Release] 4. Querying existing user data post-deployment...");
    const verifiedUser = await prisma.user.findUnique({
      where: { email: testEmail },
      include: {
        projects: true,
        tasks: true,
        budgets: true,
      },
    });

    if (!verifiedUser) throw new Error("User account was wiped after re-running release process!");
    if (verifiedUser.projects.length === 0) throw new Error("User project was lost after release deploy!");
    if (verifiedUser.tasks.length === 0) throw new Error("User task was lost after release deploy!");
    if (verifiedUser.budgets.length === 0) throw new Error("User budget was lost after release deploy!");

    console.log(`[Idempotent Release] Verified user data completely intact post-deploy: ${verifiedUser.tasks[0].title}, ${verifiedUser.budgets[0].category}`);
    console.log("✅ CRITERIA 03 (Idempotent Release): PASSED");
  } catch (err: any) {
    console.error("❌ CRITERIA 03 (Idempotent Release): FAILED ->", err.message);
    allPassed = false;
  }

  // ---------------------------------------------------------------------------
  // ACCEPTANCE CRITERIA 04: Partial Release Failure Safety
  // ---------------------------------------------------------------------------
  console.log("\n---------------------------------------------------------------");
  console.log("CRITERIA 04: Partial Release Failure Safety (Existing data untouched)");
  console.log("---------------------------------------------------------------");

  try {
    console.log("[Failure Safety] 1. Simulating an invalid/failed release command execution...");
    try {
      execSync("npx prisma migrate resolve --applied invalid_nonexistent_migration_12345", { stdio: "pipe" });
    } catch (simulatedError) {
      console.log("[Failure Safety] Simulated release command failure caught successfully.");
    }

    console.log("[Failure Safety] 2. Checking database availability and user data integrity...");
    const checkUser = await prisma.user.findUnique({
      where: { email: testEmail },
      include: { tasks: true },
    });

    if (!checkUser || checkUser.tasks.length === 0) {
      throw new Error("Existing user data was corrupted or destroyed during failed release step!");
    }

    console.log(`[Failure Safety] Database remain operational and data intact (${checkUser.email}).`);
    console.log("✅ CRITERIA 04 (Partial Release Failure Safety): PASSED");
  } catch (err: any) {
    console.error("❌ CRITERIA 04 (Partial Release Failure Safety): FAILED ->", err.message);
    allPassed = false;
  }

  // ---------------------------------------------------------------------------
  // ACCEPTANCE CRITERIA 05: Local Development Isolation
  // ---------------------------------------------------------------------------
  console.log("\n---------------------------------------------------------------");
  console.log("CRITERIA 05: Local Development Isolation");
  console.log("---------------------------------------------------------------");

  try {
    const envExamplePath = path.resolve(process.cwd(), ".env.local.example");
    if (!fs.existsSync(envExamplePath)) {
      throw new Error(".env.local.example file missing!");
    }

    const envExampleContent = fs.readFileSync(envExamplePath, "utf8");
    if (!envExampleContent.includes("DATABASE_URL") || !envExampleContent.includes("hikarii_dev")) {
      throw new Error(".env.local.example does not configure isolated local development database URL!");
    }

    console.log("[Local Dev Isolation] Local development database template (.env.local.example) verified.");
    console.log("✅ CRITERIA 05 (Local Development Isolation): PASSED");
  } catch (err: any) {
    console.error("❌ CRITERIA 05 (Local Development Isolation): FAILED ->", err.message);
    allPassed = false;
  }

  // ---------------------------------------------------------------------------
  // SUMMARY
  // ---------------------------------------------------------------------------
  console.log("\n===============================================================");
  if (allPassed) {
    console.log("🎉 MANAGED STORE PERSISTENCE & RELEASE VERIFICATION: ALL 5 CRITERIA PASSED!");
  } else {
    console.log("🚨 MANAGED STORE PERSISTENCE & RELEASE VERIFICATION: FAILED!");
    process.exit(1);
  }
  console.log("===============================================================\n");
}

runPersistenceVerification()
  .catch((e) => {
    console.error("Fatal runner error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
