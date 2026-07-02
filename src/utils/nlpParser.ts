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
  const lateFeeRegex = /(?:late\s*fee|penalty|fine)\s*(?:of|is)?\s*(?:[₦$£€$])?\s*(\d+(?:\.\d+)?)(?:\s*(?:\/|per\s*|a\s*)(?:day|daily|month|weekly))?/i;
  const lateFeeMatch = cleanText.match(lateFeeRegex);
  if (lateFeeMatch) {
    result.lateFeePerDay = parseFloat(lateFeeMatch[1]);
    cleanText = cleanText.replace(lateFeeRegex, '').trim();
  }

  // 3. Parse Due Date (relative dates and absolute dates)
  const today = new Date();
  let dueDate = new Date();
  let dateMatched = false;
  let matchedDateSubstring = '';

  const setDateToToday = () => {
    dueDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  };

  // A) Relative: "today"
  const todayMatch = cleanText.match(/\btoday\b/i);
  if (todayMatch) {
    setDateToToday();
    dateMatched = true;
    matchedDateSubstring = todayMatch[0];
  }
  
  // B) Relative: "tomorrow"
  if (!dateMatched) {
    const tomorrowMatch = cleanText.match(/\btomorrow\b/i);
    if (tomorrowMatch) {
      setDateToToday();
      dueDate.setDate(dueDate.getDate() + 1);
      dateMatched = true;
      matchedDateSubstring = tomorrowMatch[0];
    }
  }

  // C) Relative: "next [weekday]"
  if (!dateMatched) {
    const nextDayRegex = /\bnext\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i;
    const matchNext = cleanText.match(nextDayRegex);
    if (matchNext) {
      const targetDayName = matchNext[1].toLowerCase();
      const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const targetDay = daysOfWeek.indexOf(targetDayName);
      const currentDay = today.getDay();
      
      let daysToAdd = targetDay - currentDay;
      if (daysToAdd <= 0) {
        daysToAdd += 7; // It is next week's day
      }
      setDateToToday();
      dueDate.setDate(dueDate.getDate() + daysToAdd);
      dateMatched = true;
      matchedDateSubstring = matchNext[0];
    }
  }

  // D) Relative: "in X days" or "in Y weeks"
  if (!dateMatched) {
    const inDaysRegex = /\bin\s+(\d+)\s+days?\b/i;
    const matchDays = cleanText.match(inDaysRegex);
    if (matchDays) {
      setDateToToday();
      dueDate.setDate(dueDate.getDate() + parseInt(matchDays[1]));
      dateMatched = true;
      matchedDateSubstring = matchDays[0];
    }
  }
  if (!dateMatched) {
    const inWeeksRegex = /\bin\s+(\d+)\s+weeks?\b/i;
    const matchWeeks = cleanText.match(inWeeksRegex);
    if (matchWeeks) {
      setDateToToday();
      dueDate.setDate(dueDate.getDate() + parseInt(matchWeeks[1]) * 7);
      dateMatched = true;
      matchedDateSubstring = matchWeeks[0];
    }
  }

  // E) Weekday with optional preposition: "on friday", "by monday", "this thursday", or just "friday"
  if (!dateMatched) {
    const weekdayRegex = /\b(?:on|by|this)?\s*(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i;
    const matchWeekday = cleanText.match(weekdayRegex);
    if (matchWeekday) {
      const targetDayName = matchWeekday[1].toLowerCase();
      const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const targetDay = daysOfWeek.indexOf(targetDayName);
      const currentDay = today.getDay();
      
      let daysToAdd = targetDay - currentDay;
      if (daysToAdd < 0) {
        daysToAdd += 7; // Must mean next week
      }
      setDateToToday();
      dueDate.setDate(dueDate.getDate() + daysToAdd);
      dateMatched = true;
      matchedDateSubstring = matchWeekday[0];
    }
  }

  // F) ISO Date: YYYY-MM-DD or YYYY/MM/DD
  if (!dateMatched) {
    const isoRegex = /\b(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})\b/;
    const matchIso = cleanText.match(isoRegex);
    if (matchIso) {
      const year = parseInt(matchIso[1]);
      const month = parseInt(matchIso[2]) - 1;
      const day = parseInt(matchIso[3]);
      const d = new Date(year, month, day);
      if (!isNaN(d.getTime())) {
        dueDate = d;
        dateMatched = true;
        matchedDateSubstring = matchIso[0];
      }
    }
  }

  // G) DD/MM/YYYY or DD-MM-YYYY or DD/MM or DD-MM
  if (!dateMatched) {
    const dmyRegex = /\b(\d{1,2})[-/.](\d{1,2})(?:[-/.](\d{2,4}))?\b/;
    const matchDmy = cleanText.match(dmyRegex);
    if (matchDmy) {
      const day = parseInt(matchDmy[1]);
      const month = parseInt(matchDmy[2]) - 1;
      let year = today.getFullYear();
      if (matchDmy[3]) {
        let yr = parseInt(matchDmy[3]);
        if (yr < 100) yr += 2000;
        year = yr;
      }
      const d = new Date(year, month, day);
      if (!isNaN(d.getTime())) {
        dueDate = d;
        dateMatched = true;
        matchedDateSubstring = matchDmy[0];
      }
    }
  }

  // H) Month Day: July 5th, July 5, etc.
  const monthNames = [
    'january', 'february', 'march', 'april', 'may', 'june',
    'july', 'august', 'september', 'october', 'november', 'december',
    'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'
  ];
  if (!dateMatched) {
    const monthDayRegex = new RegExp(`\\b(${monthNames.join('|')})\\s+(\\d{1,2})(?:st|nd|rd|th)?(?:\\s*,?\\s*(\\d{2,4}))?\\b`, 'i');
    const matchMonthDay = cleanText.match(monthDayRegex);
    if (matchMonthDay) {
      const monthStr = matchMonthDay[1];
      const day = parseInt(matchMonthDay[2]);
      let year = today.getFullYear();
      if (matchMonthDay[3]) {
        let yr = parseInt(matchMonthDay[3]);
        if (yr < 100) yr += 2000;
        year = yr;
      }
      let monthIdx = monthNames.indexOf(monthStr.toLowerCase());
      if (monthIdx >= 12) monthIdx -= 12;
      
      const d = new Date(year, monthIdx, day);
      if (!isNaN(d.getTime())) {
        dueDate = d;
        dateMatched = true;
        matchedDateSubstring = matchMonthDay[0];
      }
    }
  }

  // I) Day Month: 5 July, 5th of July, 15th August 2026, etc.
  if (!dateMatched) {
    const dayMonthRegex = new RegExp(`\\b(\\d{1,2})(?:st|nd|rd|th)?\\s*(?:of)?\\s*(${monthNames.join('|')})(?:\\s*,?\\s*(\\d{2,4}))?\\b`, 'i');
    const matchDayMonth = cleanText.match(dayMonthRegex);
    if (matchDayMonth) {
      const day = parseInt(matchDayMonth[1]);
      const monthStr = matchDayMonth[2];
      let year = today.getFullYear();
      if (matchDayMonth[3]) {
        let yr = parseInt(matchDayMonth[3]);
        if (yr < 100) yr += 2000;
        year = yr;
      }
      let monthIdx = monthNames.indexOf(monthStr.toLowerCase());
      if (monthIdx >= 12) monthIdx -= 12;
      
      const d = new Date(year, monthIdx, day);
      if (!isNaN(d.getTime())) {
        dueDate = d;
        dateMatched = true;
        matchedDateSubstring = matchDayMonth[0];
      }
    }
  }

  if (dateMatched) {
    result.dueDate = dueDate;
    cleanText = cleanText.replace(matchedDateSubstring, '').trim();
  }

  // 4. Parse Financial Amounts (with currency indicators first)
  const currencyAmountRegex = /(?:NGN|USD|GBP|EUR|CAD|₦|\$|£|€)\s*(\d+(?:\.\d+)?)|(\d+(?:\.\d+)?)\s*(?:NGN|USD|GBP|EUR|CAD)/gi;
  let amounts: number[] = [];
  let match;
  // Use a regex reset to find all matches
  const localRegex = new RegExp(currencyAmountRegex);
  while ((match = localRegex.exec(cleanText)) !== null) {
    const amtStr = match[1] || match[2];
    if (amtStr) {
      amounts.push(parseFloat(amtStr));
    }
  }

  // Clean the currency markers from text to make a clean title
  cleanText = cleanText.replace(currencyAmountRegex, '').trim();

  // If no currency-indicated amounts are found, search for any leftover standalone number
  if (amounts.length === 0) {
    const standaloneNumRegex = /\b(\d+(?:\.\d+)?)\b/;
    const standaloneMatch = cleanText.match(standaloneNumRegex);
    if (standaloneMatch) {
      amounts.push(parseFloat(standaloneMatch[1]));
      cleanText = cleanText.replace(standaloneNumRegex, '').trim();
    }
  }

  // 5. Determine Task Type & Assign Amount
  const incomeKeywords = /\b(earn|receive|get paid|income|invoice|salary|dividend|revenue|sell|gift|bonus|deposit|interest|refund|wages|payout)\b/i;
  const expenseKeywords = /\b(pay|buy|spend|cost|purchase|expense|bill|subscription|grocery|groceries|rent|fee|payment|order|shopping|transfer|outflow|tax|insurance|fine|penalty|charge|debt)\b/i;

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
    // Neutral task type but if there's an amount, let's look at the context
    if (amounts.length > 0) {
      result.taskType = TaskType.EXPENSE; // Default to expense if amount is provided
      result.estimatedCost = amounts[0];
    }
  }

  // 6. Parse Priority
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

  // 7. Parse Category for Expenses
  if (result.taskType === TaskType.EXPENSE) {
    const catKeywords: { category: ExpenseCategory; regex: RegExp }[] = [
      { category: ExpenseCategory.FOOD, regex: /\b(food|restaurant|dinner|lunch|eat|snack|cooking)\b/i },
      { category: ExpenseCategory.GROCERIES, regex: /\b(grocery|groceries|supermarket)\b/i },
      { category: ExpenseCategory.TRANSPORT, regex: /\b(transport|uber|bolt|taxi|bus|train|flight|fuel|gas|commute|car|bike)\b/i },
      { category: ExpenseCategory.ENTERTAINMENT, regex: /\b(entertainment|movie|cinema|netflix|spotify|game|party|club|concert|fun)\b/i },
      { category: ExpenseCategory.UTILITIES, regex: /\b(utilities|electricity|water|power|internet|wifi|cable|trash|sewer|bill|phone|airtime)\b/i },
      { category: ExpenseCategory.SHOPPING, regex: /\b(shopping|clothes|shoe|amazon|gadget|gear|buying|store)\b/i },
      { category: ExpenseCategory.HEALTH, regex: /\b(health|medicine|doctor|pharmacy|gym|hospital|clinic|dental|fitness)\b/i },
      { category: ExpenseCategory.TUITION, regex: /\b(tuition|fees|school|college|university)\b/i },
      { category: ExpenseCategory.BOOKS, regex: /\b(books|book|library|coursework|stationery)\b/i },
    ];

    const matchedCat = catKeywords.find((item) => item.regex.test(text));
    if (matchedCat) {
      result.expenseCategory = matchedCat.category;
    } else {
      result.expenseCategory = ExpenseCategory.OTHER;
    }
  }

  // Clean relative date patterns from title text
  const cleanPatterns = [
    /\bby\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/gi,
    /\bfor\s+/gi,
    /\bto\s+/gi,
    /\bof\s+/gi,
    /\bby\s+/gi,
    /\bis\s+/gi,
    /\bon\s+/gi,
    /\bat\s+/gi,
  ];

  let titleCandidate = cleanText;
  cleanPatterns.forEach((p) => {
    titleCandidate = titleCandidate.replace(p, '');
  });

  // Clean up any double spaces, trailing commas, or weird leftovers
  titleCandidate = titleCandidate
    .replace(/\s+/g, ' ')
    .replace(/,\s*,/g, '')
    .trim();

  // Repeatedly strip prepositions and trailing/leading non-word characters
  let lastTitle = '';
  while (lastTitle !== titleCandidate) {
    lastTitle = titleCandidate;
    titleCandidate = titleCandidate
      .replace(/\s+(?:for|of|on|by|to|at|is|in|a|the|with)\s*$/i, '')
      .replace(/^[,\s/\\:-]+|[,\s/\\:-]+$/g, '')
      .trim();
  }

  // If we cleaned it too much, fall back to the original cleanText or the text itself
  result.title = titleCandidate.length >= 3 ? titleCandidate : cleanText;

  // Capitalize first letter and format trailing chars
  if (result.title) {
    result.title = result.title.replace(/^[,\s/\\:-]+|[,\s/\\:-]+$/g, '');
    result.title = result.title.charAt(0).toUpperCase() + result.title.slice(1);
  }

  return result;
}
