import {
  format,
  formatDistance,
  isAfter,
  isBefore,
  isToday,
  isTomorrow,
  parseISO,
} from "date-fns";

export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, "MMM dd, yyyy");
};

export const formatDateTime = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, "MMM dd, yyyy HH:mm");
};

export const formatRelativeDate = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? parseISO(date) : date;

  if (isToday(dateObj)) return "Today";
  if (isTomorrow(dateObj)) return "Tomorrow";

  return formatDistance(dateObj, new Date(), { addSuffix: true });
};

export const isOverdue = (date: Date | string): boolean => {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return isBefore(dateObj, new Date()) && !isToday(dateObj);
};

export const isDueSoon = (
  date: Date | string,
  daysThreshold: number = 3,
): boolean => {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  const thresholdDate = new Date();
  thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);

  return isAfter(dateObj, new Date()) && isBefore(dateObj, thresholdDate);
};
