import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || "";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testRealAuth() {
  console.log("Testing real Supabase Auth integration...");
  const testEmail = `real_stranger_${Date.now()}@hikarii.org`;
  const testPassword = "StrangerSecurePassword123!";

  console.log(`1. Calling supabase.auth.signUp for: ${testEmail}...`);
  const signUpRes = await supabase.auth.signUp({
    email: testEmail,
    password: testPassword,
    options: {
      emailRedirectTo: "https://hikarii.org/auth/callback",
      data: { name: "Real Stranger User" },
    },
  });

  if (signUpRes.error) {
    console.error("SignUp Error:", signUpRes.error);
    return;
  }

  console.log("SignUp User:", JSON.stringify(signUpRes.data.user, null, 2));
  console.log("Session present?", !!signUpRes.data.session);

  console.log("2. Attempting supabase.auth.signInWithPassword before confirmation...");
  const signInUnconfirmedRes = await supabase.auth.signInWithPassword({
    email: testEmail,
    password: testPassword,
  });

  console.log("Unconfirmed SignIn Error Message:", signInUnconfirmedRes.error?.message);
  console.log("Unconfirmed SignIn Error Code:", (signInUnconfirmedRes.error as any)?.code);
}

testRealAuth();
