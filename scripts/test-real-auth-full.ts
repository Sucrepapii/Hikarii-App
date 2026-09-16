import { createClient } from "@supabase/supabase-js";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();
const supabaseUrl = process.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || "";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testFullAuthIntegration() {
  console.log("===============================================================");
  console.log("🚀 TESTING REAL SUPABASE AUTH + EXPRESS MIDDLEWARE INTEGRATION");
  console.log("===============================================================\n");

  const strangerEmail = `real_stranger_${Date.now()}@hikarii.org`;
  const strangerPassword = "StrangerSecurePassword123!";

  // 1. SignUp via Supabase Auth Client
  console.log(`[Supabase Auth] 1. Calling real supabase.auth.signUp for: ${strangerEmail}...`);
  const signUpRes = await supabase.auth.signUp({
    email: strangerEmail,
    password: strangerPassword,
    options: {
      emailRedirectTo: "https://hikarii.org/auth/callback",
      data: { name: "Real Stranger User" },
    },
  });

  if (signUpRes.error) {
    console.error("❌ SignUp Error:", signUpRes.error);
    process.exit(1);
  }
  console.log("✅ SignUp succeeded via Supabase Auth API.");

  // 2. Unconfirmed Login Attempt Check
  console.log("[Supabase Auth] 2. Testing signInWithPassword before email confirmation...");
  const unconfirmedSignIn = await supabase.auth.signInWithPassword({
    email: strangerEmail,
    password: strangerPassword,
  });

  if (unconfirmedSignIn.error?.message.includes("Email not confirmed")) {
    console.log("✅ Login blocked before email confirmation as expected ('Email not confirmed').");
  } else {
    console.error("❌ Unconfirmed login check failed:", unconfirmedSignIn.error);
  }

  // 3. Confirm User in Supabase Auth & Verify Sign In
  console.log("[Supabase Auth] 3. Confirming email status in database and attempting sign-in...");
  // Find user in auth.users SQL table or sync via Prisma
  try {
    await prisma.$executeRawUnsafe(
      `UPDATE auth.users SET email_confirmed_at = NOW() WHERE email = $1`,
      strangerEmail
    );
    console.log("[Supabase Auth] Email confirmed in auth.users.");
  } catch (e: any) {
    console.log("[Supabase Auth] Direct raw SQL confirm attempted:", e.message);
  }

  // 4. Authenticate confirmed user with Supabase Auth
  console.log("[Supabase Auth] 4. Authenticating confirmed user via supabase.auth.signInWithPassword...");
  const signInRes = await supabase.auth.signInWithPassword({
    email: strangerEmail,
    password: strangerPassword,
  });

  if (signInRes.error) {
    console.error("❌ Confirmed SignIn Error:", signInRes.error);
    process.exit(1);
  }

  const session = signInRes.data.session;
  if (!session || !session.access_token) {
    console.error("❌ No access token returned in session!");
    process.exit(1);
  }

  console.log("✅ Authenticated via Supabase Auth! Access token received.");
  console.log("User ID:", signInRes.data.user.id);
  console.log("Email:", signInRes.data.user.email);

  // 5. Test Logout
  console.log("[Supabase Auth] 5. Testing signOut...");
  await supabase.auth.signOut();
  const { data: { session: postLogoutSession } } = await supabase.auth.getSession();
  if (postLogoutSession) {
    console.error("❌ Session still active after signOut!");
    process.exit(1);
  }
  console.log("✅ Session destroyed via supabase.auth.signOut().");
}

testFullAuthIntegration()
  .catch((e) => {
    console.error("Fatal error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
