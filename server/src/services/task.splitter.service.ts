import { Task } from "@prisma/client";

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
  /**
   * Analyzes a task title/description and suggests blocks.
   * Assume 60 minutes default if no duration capable logic yet.
   * In a real app, we might ask user for "Total Duration" first.
   */
  suggestBlocks(title: string, totalDurationMinutes: number = 60) {
    const normalizedTitle = title.toLowerCase();

    // Find matching template
    const template = TEMPLATES.find((t) =>
      t.keywords.some((k) => normalizedTitle.includes(k)),
    );

    const blocksToUse = template ? template.blocks : DEFAULT_TEMPLATE.blocks;

    return blocksToUse.map((block, index) => ({
      title: block.title,
      duration: Math.round(totalDurationMinutes * block.weight),
      order: index,
    }));
  }
}

export const taskSplitterService = new TaskSplitterService();
