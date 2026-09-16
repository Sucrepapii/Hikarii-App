import dotenv from "dotenv";
dotenv.config();

console.log("VITE_SUPABASE_URL:", process.env.VITE_SUPABASE_URL ? "SET: " + process.env.VITE_SUPABASE_URL : "UNSET");
console.log("VITE_SUPABASE_ANON_KEY:", process.env.VITE_SUPABASE_ANON_KEY ? "SET (length " + process.env.VITE_SUPABASE_ANON_KEY.length + ")" : "UNSET");
console.log("SUPABASE_SERVICE_ROLE_KEY:", process.env.SUPABASE_SERVICE_ROLE_KEY ? "SET (length " + process.env.SUPABASE_SERVICE_ROLE_KEY.length + ")" : "UNSET");
