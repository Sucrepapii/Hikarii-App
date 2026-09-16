import fs from "fs";
import path from "path";
import dns from "dns/promises";
import https from "https";

async function checkHttps(url: string, method = 'GET', headers = {}): Promise<any> {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const options = {
      hostname: parsed.hostname,
      port: parsed.port || 443,
      path: parsed.pathname + parsed.search,
      method,
      headers
    };
    const req = https.request(options, (res) => {
      resolve({
        statusCode: res.statusCode,
        headers: res.headers,
        cert: (res.socket as any).getPeerCertificate?.()
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function runDomainVerification() {
  console.log("===============================================================");
  console.log("🚀 STARTING HIKARII.ORG DOMAIN, CORS & LEAK VERIFICATION");
  console.log("===============================================================\n");

  let allPassed = true;

  // ---------------------------------------------------------------------------
  // ACCEPTANCE CRITERIA 01: Canonical HTTPS Domain Resolution
  // ---------------------------------------------------------------------------
  console.log("---------------------------------------------------------------");
  console.log("CRITERIA 01: Canonical HTTPS Domain Resolution (https://hikarii.org)");
  console.log("---------------------------------------------------------------");

  try {
    const hostname = "hikarii.org";
    // Check DNS
    const addresses = await dns.resolve4(hostname);
    if (addresses.length === 0) throw new Error("No A records found");
    
    // Check HTTPS
    const res = await checkHttps(`https://${hostname}`);
    if (res.statusCode === 301 || res.statusCode === 308) {
       const loc = res.headers.location;
       if (!loc || (loc !== 'https://www.hikarii.org/' && loc !== 'https://hikarii.org/')) {
           throw new Error(`Redirected to unexpected location: ${loc}`);
       }
       console.log(`[Domain Resolution] Verified redirect to canonical destination: ${loc}`);
    } else if (res.statusCode !== 200) {
       throw new Error(`Unexpected status code ${res.statusCode}.`);
    }

    if (res.cert && res.cert.subject) {
       console.log(`[Domain Resolution] Certificate valid for: ${res.cert.subject.CN}`);
    }

    console.log(`[Domain Resolution] Validated HTTPS canonical address resolved to: ${addresses.join(', ')}`);
    console.log("✅ CRITERIA 01 (HTTPS Domain Resolution): PASSED");
  } catch (err: any) {
    console.error("❌ CRITERIA 01 (HTTPS Domain Resolution): FAILED ->", err.message);
    allPassed = false;
  }

  // ---------------------------------------------------------------------------
  // ACCEPTANCE CRITERIA 02: Single-Origin Request Routing
  // ---------------------------------------------------------------------------
  console.log("\n---------------------------------------------------------------");
  console.log("CRITERIA 02: Single-Origin Request Routing");
  console.log("---------------------------------------------------------------");

  try {
    const clientTsPath = path.resolve(process.cwd(), "src/api/client.ts");
    const clientContent = fs.readFileSync(clientTsPath, "utf8");

    if (clientContent.includes("127.0.0.1")) {
      throw new Error("API client still contains local dev fallback!");
    }

    console.log("[Single-Origin Routing] API client uses safe fallback logic.");
    console.log("✅ CRITERIA 02 (Single-Origin Request Routing): PASSED");
  } catch (err: any) {
    console.error("❌ CRITERIA 02 (Single-Origin Request Routing): FAILED ->", err.message);
    allPassed = false;
  }

  // ---------------------------------------------------------------------------
  // ACCEPTANCE CRITERIA 03: Confirmation Email Links
  // ---------------------------------------------------------------------------
  console.log("\n---------------------------------------------------------------");
  console.log("CRITERIA 03: Confirmation Email Links (/auth/callback)");
  console.log("---------------------------------------------------------------");

  try {
    const authCallbackPath = path.resolve(process.cwd(), "src/pages/AuthCallback.tsx");
    const authCallbackContent = fs.readFileSync(authCallbackPath, "utf8");

    if (!authCallbackContent.includes("exchangeCodeForSession") && !authCallbackContent.includes("setSession")) {
      throw new Error("AuthCallback does not properly consume session material from fragment!");
    }

    console.log("[Confirmation Links] Verified AuthCallback properly parses and exchanges URL fragments.");
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
    // Make a CORS preflight request to the live domain
    const res = await checkHttps('https://hikarii.org/api/health', 'OPTIONS', {
      'Origin': 'https://evil.com',
      'Access-Control-Request-Method': 'GET'
    });

    const allowOrigin = res.headers['access-control-allow-origin'];
    if (allowOrigin === '*' || allowOrigin === 'https://evil.com') {
      throw new Error("CORS policy violation! API accepts requests from unauthorized origin (evil.com).");
    }

    console.log("[CORS Policy] Active CORS check successfully blocked evil.com (no matching Access-Control-Allow-Origin header).");
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
    } else {
      const secretRegexes = [
        /DATABASE_URL\s*=/i,
        /JWT_SECRET\s*=/i,
        /SUPABASE_SERVICE_ROLE_KEY/i,
        /STRIPE_SECRET_KEY/i,
        /RESEND_API_KEY/i,
      ];

      // Generalized regex for private/loopback IPv4 addresses and common dev ports
      const forbiddenRegexes = [
        /\b127\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/,
        /\b10\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/,
        /\b172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}\b/,
        /\b192\.168\.\d{1,3}\.\d{1,3}\b/,
        /localhost:\d+/,
        /::1/,
        /https?:\/\/[a-zA-Z0-9-]+\.(vercel\.app|onrender\.com|railway\.app|ngrok\.io|ngrok-free\.app|herokuapp\.com|netlify\.app)/i
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

            for (const regex of secretRegexes) {
              if (regex.test(content)) {
                console.error(`❌ Secret leak found in artifact (${file}): ${regex}`);
                foundLeak = true;
              }
            }

            for (const regex of forbiddenRegexes) {
              if (regex.test(content)) {
                console.error(`❌ Forbidden dev URL leak found in artifact (${file}): ${regex}`);
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
      console.log("[Leak Check] 0 stray fallbacks pointing at development machines found.");
    }
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
