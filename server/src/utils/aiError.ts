/**
 * Maps complex or technical Gemini API error messages into user-friendly notifications.
 */
export function getFriendlyAIError(error: any): string {
  const message = error?.message || String(error);

  // 503 Service Unavailable / High demand
  if (
    message.includes("503") ||
    message.includes("Service Unavailable") ||
    message.includes("high demand") ||
    message.includes("overloaded")
  ) {
    return "The AI Coach is currently experiencing very high traffic. Please wait a moment and try again.";
  }

  // 429 Rate limit / Quota exceeded
  if (
    message.includes("429") ||
    message.includes("quota") ||
    message.includes("RESOURCE_EXHAUSTED") ||
    message.includes("rate limit")
  ) {
    return "Request limit reached. Please wait a moment before asking another question.";
  }

  // API Key / Auth Issues
  if (
    message.includes("API key not valid") ||
    message.includes("API_KEY_INVALID") ||
    message.includes("leaked") ||
    message.includes("403 Forbidden") ||
    message.includes("Forbidden")
  ) {
    return "AI service configuration error. Please contact support to verify the API key setup.";
  }

  // Fallback
  return "Connection issue with the AI service. Please try again in a few moments.";
}
