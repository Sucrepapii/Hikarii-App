import { TaskType, TaskPriority } from '../types/task.types';
import { ExpenseCategory } from '../types/budget.types';

export interface ParsedTask {
  title: string;
  description?: string;
  dueDate?: Date;
  taskType: TaskType;
  priority: TaskPriority;
  estimatedCost?: number;
  estimatedIncome?: number;
  lateFeePerDay?: number;
  expenseCategory?: ExpenseCategory;
  estimatedDuration?: number;
}

export function parseNaturalLanguageTask(text: string): ParsedTask {
  let cleanText = text.trim();
  const result: ParsedTask = {
    title: '',
    taskType: TaskType.NEUTRAL,
    priority: TaskPriority.MEDIUM,
  };

  // 1. Parse Duration e.g. "(2 hours)" or "(30 mins)"
  const durationRegex = /\((\d+(?:\.\d+)?)\s*(h|hr|hrs|hours|m|min|mins|minutes)\)/i;
  const durationMatch = cleanText.match(durationRegex);
  if (durationMatch) {
    const val = parseFloat(durationMatch[1]);
    const unit = durationMatch[2].toLowerCase();
    let mins = val;
    if (unit.startsWith('h')) {
      mins = val * 60;
    }
    result.estimatedDuration = Math.round(mins);
    // Remove from clean text
    cleanText = cleanText.replace(durationRegex, '').trim();
  }

  // 2. Parse Late Fee e.g. "late fee 500", "penalty of 200", "fine of 100"
  const lateFeeRegex = /(?:late\s*fee|penalty|fine)\s*(?:of|is)?\s*(?:[₦$£€$])?\s*(\d+(?:\.\d+)?)/i;
  const lateFeeMatch = cleanText.match(lateFeeRegex);
  if (lateFeeMatch) {
    result.lateFeePerDay = parseFloat(lateFeeMatch[1]);
    cleanText = cleanText.replace(lateFeeRegex, '').trim();
  }

  // 3. Parse Financial Amounts (Cost or Income)
  const currencyAmountRegex = /(?:NGN|USD|GBP|EUR|CAD|₦|\$|£|€)\s*(\d+(?:\.\d+)?)|(\d+(?:\.\d+)?)\s*(?:NGN|USD|GBP|EUR|CAD)/gi;
  let amounts: number[] = [];
  let match;
  const localRegex = new RegExp(currencyAmountRegex);
  while ((match = localRegex.exec(cleanText)) !== null) {
    const amtStr = match[1] || match[2];
    if (amtStr) {
      amounts.push(parseFloat(amtStr));
    }
  }

  cleanText = cleanText.replace(currencyAmountRegex, '').trim();

  // 4. Determine Task Type & Assign Amount
  const incomeKeywords = /\b(earn|receive|get paid|income|invoice|salary|dividend|revenue|sell)\b/i;
  const expenseKeywords = /\b(pay|buy|spend|cost|purchase|expense|bill|subscription|grocery|groceries|rent|fee)\b/i;

  if (incomeKeywords.test(text)) {
    result.taskType = TaskType.INCOME;
    if (amounts.length > 0) {
      result.estimatedIncome = amounts[0];
    }
  } else if (expenseKeywords.test(text)) {
    result.taskType = TaskType.EXPENSE;
    if (amounts.length > 0) {
      result.estimatedCost = amounts[0];
    }
  } else {
    if (amounts.length > 0) {
      result.taskType = TaskType.EXPENSE;
      result.estimatedCost = amounts[0];
    }
  }

  // 5. Parse Priority
  const urgentKeywords = /\b(urgent|critical|asap|emergency)\b/i;
  const highKeywords = /\b(high|important|must)\b/i;
  const lowKeywords = /\b(low|sometime|backburner|minor)\b/i;

  if (urgentKeywords.test(text)) {
    result.priority = TaskPriority.URGENT;
  } else if (highKeywords.test(text)) {
    result.priority = TaskPriority.HIGH;
  } else if (lowKeywords.test(text)) {
    result.priority = TaskPriority.LOW;
  }

  // 6. Parse Category for Expenses
  if (result.taskType === TaskType.EXPENSE) {
    const catKeywords: { category: ExpenseCategory; regex: RegExp }[] = [
      { category: ExpenseCategory.FOOD, regex: /\b(food|grocery|groceries|restaurant|dinner|lunch|eat|snack|cooking)\b/i },
      { category: ExpenseCategory.TRANSPORT, regex: /\b(transport|uber|bolt|taxi|bus|train|flight|fuel|gas|commute|car|bike)\b/i },
      { category: ExpenseCategory.ENTERTAINMENT, regex: /\b(entertainment|movie|cinema|netflix|spotify|game|party|club|concert|fun)\b/i },
      { category: ExpenseCategory.UTILITIES, regex: /\b(utilities|electricity|water|power|internet|wifi|cable|trash|sewer|bill|phone|airtime)\b/i },
      { category: ExpenseCategory.SHOPPING, regex: /\b(shopping|clothes|shoe|amazon|gadget|gear|buying|store)\b/i },
      { category: ExpenseCategory.HEALTH, regex: /\b(health|medicine|doctor|pharmacy|gym|hospital|clinic|dental|fitness)\b/i },
    ];

    const matchedCat = catKeywords.find((item) => item.regex.test(text));
    if (matchedCat) {
      result.expenseCategory = matchedCat.category;
    } else {
      result.expenseCategory = ExpenseCategory.OTHER;
    }
  }

  // 7. Parse Due Date (relative dates)
  const today = new Date();
  let dueDate = new Date();
  let dateMatched = false;

  if (/\btoday\b/i.test(text)) {
    dueDate = today;
    dateMatched = true;
  } else if (/\btomorrow\b/i.test(text)) {
    dueDate.setDate(today.getDate() + 1);
    dateMatched = true;
  } else {
    const nextDayRegex = /\bnext\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i;
    const matchNext = text.match(nextDayRegex);
    if (matchNext) {
      const targetDayName = matchNext[1].toLowerCase();
      const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const targetDay = daysOfWeek.indexOf(targetDayName);
      const currentDay = today.getDay();
      
      let daysToAdd = targetDay - currentDay;
      if (daysToAdd <= 0) {
        daysToAdd += 7;
      }
      dueDate.setDate(today.getDate() + daysToAdd);
      dateMatched = true;
    } else {
      const inDaysRegex = /\bin\s+(\d+)\s+days?\b/i;
      const matchDays = text.match(inDaysRegex);
      if (matchDays) {
        dueDate.setDate(today.getDate() + parseInt(matchDays[1]));
        dateMatched = true;
      } else {
        const inWeeksRegex = /\bin\s+(\d+)\s+weeks?\b/i;
        const matchWeeks = text.match(inWeeksRegex);
        if (matchWeeks) {
          dueDate.setDate(today.getDate() + parseInt(matchWeeks[1]) * 7);
          dateMatched = true;
        }
      }
    }
  }

  if (dateMatched) {
    result.dueDate = dueDate;
  }

  const cleanPatterns = [
    /\btoday\b/gi,
    /\btomorrow\b/gi,
    /\bnext\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/gi,
    /\bin\s+(\d+)\s+(days?|weeks?)\b/gi,
    /\bby\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/gi,
    /\bfor\s+/gi,
    /\bto\s+/gi,
    /\bof\s+/gi,
    /\bby\s+/gi,
    /\bis\s+/gi,
  ];

  let titleCandidate = cleanText;
  cleanPatterns.forEach((p) => {
    titleCandidate = titleCandidate.replace(p, '');
  });

  titleCandidate = titleCandidate
    .replace(/\s+/g, ' ')
    .replace(/,\s*,/g, '')
    .trim();

  result.title = titleCandidate.length >= 3 ? titleCandidate : cleanText;

  if (result.title) {
    result.title = result.title.charAt(0).toUpperCase() + result.title.slice(1);
  }

  return result;
}
