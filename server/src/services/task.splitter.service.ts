import { Task } from "@prisma/client";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface SplitTemplate {
  keywords: string[];
  blocks: { title: string; weight: number }[]; // weight is percentage (0-1)
}

const TEMPLATES: SplitTemplate[] = [
  {
    keywords: ["write", "draft", "essay", "report", "blog", "article", "paper"],
    blocks: [
      { title: "Research & Notes", weight: 0.25 },
      { title: "Outline Structure", weight: 0.15 },
      { title: "Drafting", weight: 0.4 },
      { title: "Review & Polish", weight: 0.2 },
    ],
  },
  {
    keywords: ["study", "learn", "read", "prepare for exam", "course"],
    blocks: [
      { title: "Review Materials", weight: 0.3 },
      { title: "Practice / Exercises", weight: 0.4 },
      { title: "Summarize Key Points", weight: 0.3 },
    ],
  },
  {
    keywords: [
      "build",
      "code",
      "develop",
      "implement",
      "program",
      "fix",
      "debug",
    ],
    blocks: [
      { title: "Design & Plan", weight: 0.2 },
      { title: "Implementation", weight: 0.5 },
      { title: "Testing & Validation", weight: 0.3 },
    ],
  },
  {
    keywords: ["plan", "organize", "schedule"],
    blocks: [
      { title: "Brainstorming", weight: 0.3 },
      { title: "Categorization", weight: 0.3 },
      { title: "Finalizing Plan", weight: 0.4 },
    ],
  },
];

const DEFAULT_TEMPLATE = {
  blocks: [
    { title: "Preparation", weight: 0.1 },
    { title: "Core Work", weight: 0.8 },
    { title: "Wrap-up & Review", weight: 0.1 },
  ],
};

export class TaskSplitterService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;

  constructor() {
    // Ensure env is loaded even if instantiated early
    if (!process.env.GEMINI_API_KEY) {
      console.log(
        "[TaskSplitter] GEMINI_API_KEY not found in process.env, attempting to safely load dotenv...",
      );
      // Dynamically require to avoid top-level side effects if possible, though constructor is runtime.
      // We'll rely on the main app having loaded it, but let's log explicitly.
    }

    const apiKey = process.env.GEMINI_API_KEY;
    console.log(`[TaskSplitter] Initializing. API Key present: ${!!apiKey}`);

    if (apiKey) {
      try {
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({
          model: "gemini-1.5-flash",
        });
        console.log("[TaskSplitter] Gemini model initialized successfully.");
      } catch (error) {
        console.error("Failed to initialize Gemini AI:", error);
      }
    } else {
      console.warn("[TaskSplitter] No API Key provided. AI features disabled.");
    }
  }

  /**
   * Analyzes a task title/description and suggests blocks.
   * Assume 60 minutes default if no duration capable logic yet.
   * In a real app, we might ask user for "Total Duration" first.
   */
  async suggestBlocks(title: string, totalDurationMinutes: number = 60) {
    // 1. Try AI-based splitting if configured
    if (this.model) {
      try {
        console.log(`[TaskSplitter] Attempting AI split for: "${title}"`);
        const prompt = `
          You are a productivity expert. Break down the task "${title}" into 3-5 subtasks (blocks) that fit within a total of ${totalDurationMinutes} minutes.
          
          Return ONLY a raw JSON array (no markdown code blocks, no explanation) with this structure:
          [
            { "title": "Subtask Name", "duration": number }
          ]
          
          The sum of durations should equal exactly ${totalDurationMinutes}.
          Adjust the subtask titles to be specific to the context (e.g., if "Plan vacation", use "Book Flights", not just "Preparation").
        `;

        const result = await this.model.generateContent(prompt);
        const responseText = result.response.text();
        console.log("[TaskSplitter] Raw AI Response:", responseText);

        // Cleanup response if it contains markdown code blocks
        const cleanedText = responseText
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();

        const aiBlocks = JSON.parse(cleanedText);

        if (Array.isArray(aiBlocks) && aiBlocks.length > 0) {
          console.log(
            "[TaskSplitter] AI parsed valid blocks:",
            aiBlocks.length,
          );
          return aiBlocks.map((block: any, index: number) => ({
            title: block.title,
            duration: Number(block.duration),
            order: index,
          }));
        } else {
          console.warn("[TaskSplitter] AI response was not a valid array.");
        }
      } catch (error) {
        console.error(
          "[TaskSplitter] AI generation failed, falling back to templates:",
          error,
        );
        // Fallthrough to template logic
      }
    } else {
      console.log("[TaskSplitter] Skipping AI (Model not initialized).");
    }

    // 2. Fallback to Keyword Template Logic
    const normalizedTitle = title.toLowerCase();
    const template = TEMPLATES.find((t) =>
      t.keywords.some((k) => normalizedTitle.includes(k)),
    );
    const blocksToUse = template ? template.blocks : DEFAULT_TEMPLATE.blocks;
    let topic = "";

    if (template) {
      // Find the specific keyword that matched
      const matchedKeyword = template.keywords.find((k) =>
        normalizedTitle.includes(k),
      );
      if (matchedKeyword) {
        // Extract the topic (everything after the keyword, cleaned up)
        // e.g. "Write History Essay" -> keyword "write" -> topic "History Essay"
        const parts = normalizedTitle.split(matchedKeyword);
        if (parts.length > 1) {
          topic = parts.slice(1).join(matchedKeyword).trim(); // Join back in case keyword appears twice, though simple split is usually enough

          // Cleanup common prepositions if they start the topic
          // e.g. "Write about History" -> "about History" -> "History"
          const prepositions = ["about", "a", "an", "the", "for", "on"];
          for (const prep of prepositions) {
            if (topic.startsWith(prep + " ")) {
              topic = topic.substring(prep.length + 1).trim();
            }
          }
        }
      }
    }

    // Capitalize topic for display
    const formattedTopic =
      topic.length > 0 ? topic.charAt(0).toUpperCase() + topic.slice(1) : "";

    return blocksToUse.map((block, index) => {
      let blockTitle = block.title;
      // Inject topic if available and not already redundant
      if (formattedTopic) {
        if (
          blockTitle.includes("Review") ||
          blockTitle.includes("Drafting") ||
          blockTitle.includes("Research")
        ) {
          blockTitle = `${blockTitle} ${formattedTopic}`;
        } else if (
          blockTitle === "Implementation" ||
          blockTitle === "Design & Plan"
        ) {
          blockTitle = `${blockTitle} for ${formattedTopic}`;
        }
      }

      return {
        title: blockTitle,
        duration: Math.round(totalDurationMinutes * block.weight),
        order: index,
      };
    });
  }
}

export const taskSplitterService = new TaskSplitterService();
