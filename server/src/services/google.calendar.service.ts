import { google } from "googleapis";
import prisma from "../config/db";
import fs from "fs";
import path from "path";

const logToFile = (message: string, data?: any) => {
  // Also log to console for immediate visibility
  console.log(`[DEBUG] ${message}`, data ? JSON.stringify(data, null, 2) : "");
  try {
    const logPath = path.join(process.cwd(), "debug.log");
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message} ${data ? JSON.stringify(data, null, 2) : ""}\n`;
    fs.appendFileSync(logPath, logEntry);
  } catch (e) {
    console.error("Failed to write to debug.log", e);
  }
};

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "postmessage", // For React One-Tap/Popup flow which handles redirect differently
);

// Scopes for Calendar
const SCOPES = [
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/calendar.events",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
];

/**
 * Exchange auth code for tokens
 */
export const exchangeCodeForToken = async (userId: string, code: string) => {
  try {
    // Debugging logs to file
    logToFile("CWD:", process.cwd());
    logToFile("Exchanging code for token");
    logToFile(
      "Client ID prefix:",
      process.env.GOOGLE_CLIENT_ID?.substring(0, 10),
    );
    logToFile("Redirect URI (Configured):", (oauth2Client as any).redirectUri);
    // @ts-ignore
    logToFile("Redirect URI (Internal):", oauth2Client._redirectUri);

    const { tokens } = await oauth2Client.getToken(code);

    // Save tokens to user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        googleAccessToken: tokens.access_token,
        googleRefreshToken: tokens.refresh_token, // Only returned on first consent
      },
    });

    return updatedUser;
  } catch (error: any) {
    const errorDetails = error.response?.data || error.message;
    logToFile("Error exchanging code:", errorDetails);

    console.error("Error exchanging code for token details:", errorDetails);
    throw new Error(
      `Google Auth Failed: ${error.response?.data?.error || error.message}`,
    );
  }
};

/**
 * Create a calendar event for a task
 */
export const createCalendarEvent = async (userId: string, task: any) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user?.googleAccessToken) {
      console.log("No Google Access Token for user", userId);
      return null;
    }

    // Set credentials
    oauth2Client.setCredentials({
      access_token: user.googleAccessToken,
      refresh_token: user.googleRefreshToken,
    });

    // Handle token refresh if needed (googleapis handles this automatically if refresh_token is present)

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    // Map Task to Google Event
    const event = {
      summary: task.title,
      description: task.description || "",
      start: {
        dateTime: new Date().toISOString(), // Default to now if no due date, logic can be improved
        timeZone: "UTC", // Use user's timezone if available
      },
      end: {
        dateTime: new Date(new Date().getTime() + 60 * 60 * 1000).toISOString(), // +1 hour default
        timeZone: "UTC",
      },
      // If task has specific due date:
      ...(task.dueDate && {
        start: {
          dateTime: new Date(task.dueDate).toISOString(),
          timeZone: "UTC",
        },
        end: {
          // Assume 1 hour duration or all day
          dateTime: new Date(
            new Date(task.dueDate).getTime() + 60 * 60 * 1000,
          ).toISOString(),
          timeZone: "UTC",
        },
      }),
      reminders: {
        useDefault: true,
      },
    };

    const response = await calendar.events.insert({
      calendarId: "primary",
      requestBody: event,
    });

    return response.data;
  } catch (error: any) {
    console.error("Error creating calendar event:", error);
    // If token invalid, we might want to flag user to re-auth
    return null;
  }
};

/**
 * Get Auth URL (if doing server-side redirect flow, though we are using frontend popup)
 */
export const getAuthUrl = () => {
  return oauth2Client.generateAuthUrl({
    access_type: "offline", // Essential for refresh token
    scope: SCOPES,
    prompt: "consent", // Force consent to get refresh token
  });
};
