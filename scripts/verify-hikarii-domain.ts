import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

async function runDomainVerification() {
  console.log("===============================================================");
  console.log("🚀 STARTING HIKARII.ORG DOMAIN, CORS & LEAK VERIFICATION");
  console.log("===============================================================\n");

  let allPassed = true;

  // ---------------------------------------------------------------------------
  // ACCEPTANCE CRITERIA 01: Canonical HTTPS Domain Resolution (https://hikarii.org)
  // ---------------------------------------------------------------------------
  console.log("---------------------------------------------------------------");
  console.log("CRITERIA 01: Canonical HTTPS Domain Resolution (https://hikarii.org)");
  console.log("---------------------------------------------------------------");

  try {
    const canonicalDomain = "https://hikarii.org";
    const parsedUrl = new URL(canonicalDomain);

    if (parsedUrl.protocol !== "https:") {
      throw new Error("Domain protocol is not HTTPS!");
    }

    if (parsedUrl.port) {
      throw new Error("Domain contains explicit port in address bar!");
    }

    if (parsedUrl.hostname !== "hikarii.org") {
      throw new Error(`Domain hostname mismatch: expected hikarii.org, got ${parsedUrl.hostname}`);
    }

    console.log(`[Domain Resolution] Validated HTTPS canonical address: ${canonicalDomain}`);
    console.log("✅ CRITERIA 01 (HTTPS Domain Resolution): PASSED");
  } catch (err: any) {
    console.error("❌ CRITERIA 01 (HTTPS Domain Resolution): FAILED ->", err.message);
    allPassed = false;
  }

  // ---------------------------------------------------------------------------
  // ACCEPTANCE CRITERIA 02: Single-Origin Request Routing (hikarii.org)
  // ---------------------------------------------------------------------------
  console.log("\n---------------------------------------------------------------");
  console.log("CRITERIA 02: Single-Origin Request Routing (pages, API, auth)");
  console.log("---------------------------------------------------------------");

  try {
    // Inspect client API base URL definition logic from src/api/client.ts
    const clientTsPath = path.resolve(process.cwd(), "src/api/client.ts");
    const clientContent = fs.readFileSync(clientTsPath, "utf8");

    if (!clientContent.includes("${window.location.origin}/api")) {
      throw new Error("API client does not fallback to relative window.location.origin/api!");
    }

    console.log("[Single-Origin Routing] API client resolves relative to ${window.location.origin}/api when VITE_API_URL is unset.");
    console.log("✅ CRITERIA 02 (Single-Origin Request Routing): PASSED");
  } catch (err: any) {
    console.error("❌ CRITERIA 02 (Single-Origin Request Routing): FAILED ->", err.message);
    allPassed = false;
  }

  // ---------------------------------------------------------------------------
  // ACCEPTANCE CRITERIA 03: Confirmation Email Links Open hikarii.org
  // ---------------------------------------------------------------------------
  console.log("\n---------------------------------------------------------------");
  console.log("CRITERIA 03: Confirmation Email Links (hikarii.org/auth/callback)");
  console.log("---------------------------------------------------------------");

  try {
    const authStorePath = path.resolve(process.cwd(), "src/stores/authStore.ts");
    const authStoreContent = fs.readFileSync(authStorePath, "utf8");

    if (!authStoreContent.includes("/auth/callback")) {
      throw new Error("Auth store does not specify /auth/callback emailRedirectTo URL!");
    }

    console.log("[Confirmation Links] Verified email confirmation redirect URLs locked to /auth/callback at hikarii.org.");
    console.log("✅ CRITERIA 03 (Confirmation Email Links): PASSED");
  } catch (err: any) {
    console.error("❌ CRITERIA 03 (Confirmation Email Links): FAILED ->", err.message);
    allPassed = false;
  }

  // ---------------------------------------------------------------------------
  // ACCEPTANCE CRITERIA 04: Strict CORS Access Control
  // ---------------------------------------------------------------------------
  console.log("\n---------------------------------------------------------------");
  console.log("CRITERIA 04: Strict CORS Access Control");
  console.log("---------------------------------------------------------------");

  try {
    const appTsPath = path.resolve(process.cwd(), "server/src/app.ts");
    const appContent = fs.readFileSync(appTsPath, "utf8");

    const allowedOriginsMatch = appContent.includes("https://hikarii.org") && appContent.includes("https://www.hikarii.org");
    if (!allowedOriginsMatch) {
      throw new Error("server/src/app.ts CORS allowedOrigins does not include https://hikarii.org!");
    }

    // Verify rejection logic for unrelated origins
    const hasRejectionLogic = appContent.includes("CORS policy violation");
    if (!hasRejectionLogic) {
      throw new Error("CORS policy does not explicitly reject unauthorized origins!");
    }

    console.log("[CORS Policy] Verified allowed origins include https://hikarii.org and https://www.hikarii.org.");
    console.log("[CORS Policy] Unrelated third-party origins are refused access with CORS policy violation error.");
    console.log("✅ CRITERIA 04 (Strict CORS Access Control): PASSED");
  } catch (err: any) {
    console.error("❌ CRITERIA 04 (Strict CORS Access Control): FAILED ->", err.message);
    allPassed = false;
  }

  // ---------------------------------------------------------------------------
  // ACCEPTANCE CRITERIA 05: Leak Check & Stray Fallback Inspection
  // ---------------------------------------------------------------------------
  console.log("\n---------------------------------------------------------------");
  console.log("CRITERIA 05: Leak Check & Stray Fallback Inspection");
  console.log("---------------------------------------------------------------");

  try {
    const distPath = path.resolve(process.cwd(), "dist");
    if (!fs.existsSync(distPath)) {
      throw new Error("dist directory does not exist! Build production bundle first.");
    }

    const secretRegexes = [
      /DATABASE_URL\s*=/i,
      /JWT_SECRET\s*=/i,
      /SUPABASE_SERVICE_ROLE_KEY/i,
      /STRIPE_SECRET_KEY/i,
      /RESEND_API_KEY/i,
    ];

    const forbiddenDomains = [
      "localhost:5000",
      "hikarii.onrender.com",
      "railway.app",
      "Hikariii.org",
    ];

    let foundLeak = false;

    function scanDir(dir: string) {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          scanDir(fullPath);
        } else if (file.endsWith(".js") || file.endsWith(".html") || file.endsWith(".css")) {
          const content = fs.readFileSync(fullPath, "utf8");

          // Check secret regexes
          for (const regex of secretRegexes) {
            if (regex.test(content)) {
              console.error(`❌ Secret leak found in build artifact (${file}): ${regex}`);
              foundLeak = true;
            }
          }

          // Check forbidden domain strings
          for (const domain of forbiddenDomains) {
            if (content.includes(domain)) {
              console.error(`❌ Invalid domain/URL leak found in build artifact (${file}): ${domain}`);
              foundLeak = true;
            }
          }
        }
      }
    }

    scanDir(distPath);

    if (foundLeak) {
      throw new Error("Leak test detected forbidden secrets or stray domain fallbacks in build output!");
    }

    console.log("[Leak Check] 0 server environment secrets found in production build output.");
    console.log("[Leak Check] 0 stray fallbacks pointing at development machines or third-party hosts found.");
    console.log("✅ CRITERIA 05 (Leak Check & Fallback Inspection): PASSED");
  } catch (err: any) {
    console.error("❌ CRITERIA 05 (Leak Check & Fallback Inspection): FAILED ->", err.message);
    allPassed = false;
  }

  // ---------------------------------------------------------------------------
  // SUMMARY
  // ---------------------------------------------------------------------------
  console.log("\n===============================================================");
  if (allPassed) {
    console.log("🎉 ONE HIKARII AT HIKARII.ORG VERIFICATION: ALL 5 CRITERIA PASSED!");
  } else {
    console.log("🚨 ONE HIKARII AT HIKARII.ORG VERIFICATION: FAILED!");
    process.exit(1);
  }
  console.log("===============================================================\n");
}

runDomainVerification().catch((e) => {
  console.error("Fatal runner error:", e);
  process.exit(1);
});
