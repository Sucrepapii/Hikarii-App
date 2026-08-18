import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";
import path from "path";

// Load .env from server root or project root
const envPath = path.resolve(__dirname, "../../.env");
console.log("Loading .env from:", envPath);
dotenv.config({ path: envPath });

async function testGemini() {
  const apiKey = process.env.GEMINI_API_KEY;
  console.log("API Key present:", !!apiKey);

  if (!apiKey) {
    console.error(
      "❌ Error: GEMINI_API_KEY not found in environment variables.",
    );
    return;
  }

  console.log("API Key (first 5 chars):", apiKey.substring(0, 5) + "...");
  const genAI = new GoogleGenerativeAI(apiKey);

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });
    const prompt = "Explain how AI works in one sentence.";
    console.log(`Sending prompt to gemini-3.6-flash: "${prompt}"`);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("✅ Success! AI Response:");
    console.log(text);
  } catch (error: any) {
    console.error("❌ API Call Failed:");
    console.error("Message:", error.message);
  }
}

testGemini();
