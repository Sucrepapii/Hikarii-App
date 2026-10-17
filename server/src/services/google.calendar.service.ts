import { google } from "googleapis";
import prisma from "../config/db";
import logger from "../config/logger";

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
    logger.debug({ userId }, "Exchanging code for Google OAuth token");

    const { tokens } = await oauth2Client.getToken(code);

    // Save tokens to user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        googleAccessToken: tokens.access_token,
        googleRefreshToken: tokens.refresh_token, // Only returned on first consent
      },
    });

    logger.info({ userId }, "Google OAuth tokens exchanged and saved successfully");
    return updatedUser;
  } catch (error: any) {
    const errorDetails = error.response?.data || error.message;
    logger.error({ errorDetails, userId }, "Error exchanging Google OAuth code for token");
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
      logger.info({ userId }, "No Google Access Token found for user; skipping calendar event creation");
      return null;
    }

    // Set credentials
    oauth2Client.setCredentials({
      access_token: user.googleAccessToken,
      refresh_token: user.googleRefreshToken,
    });

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    // Map Task to Google Event
    const event = {
      summary: task.title,
      description: task.description || "",
      start: {
        dateTime: new Date().toISOString(),
        timeZone: "UTC",
      },
      end: {
        dateTime: new Date(new Date().getTime() + 60 * 60 * 1000).toISOString(),
        timeZone: "UTC",
      },
      ...(task.dueDate && {
        start: {
          dateTime: new Date(task.dueDate).toISOString(),
          timeZone: "UTC",
        },
        end: {
          dateTime: new Date(
            new Date(task.dueDate).getTime() +
              (task.estimatedDuration
                ? task.estimatedDuration * 60000
                : 60 * 60 * 1000),
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

    logger.info({ userId, eventId: response.data.id }, "Google Calendar event created successfully");
    return response.data;
  } catch (error: any) {
    logger.error({ error: error.message, userId }, "Error creating Google Calendar event");
    return null;
  }
};

/**
 * Sync multiple task blocks to calendar
 */
export const syncTaskBlocks = async (
  userId: string,
  taskId: string,
  blocks: any[],
) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user?.googleAccessToken) return null;

    oauth2Client.setCredentials({
      access_token: user.googleAccessToken,
      refresh_token: user.googleRefreshToken,
    });

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    const parentTask = await prisma.task.findUnique({
      where: { id: taskId },
      select: { title: true, dueDate: true },
    });
    const parentTitle = parentTask?.title || "Task";

    let startDate = new Date();
    if (parentTask?.dueDate) {
      startDate = new Date(parentTask.dueDate);
    } else {
      startDate.setDate(startDate.getDate() + 1);
    }

    startDate.setHours(9, 0, 0, 0);

    let currentStartTime = startDate;
    const results = [];

    for (const block of blocks) {
      if (!block.duration) continue;

      const endTime = new Date(
        currentStartTime.getTime() + block.duration * 60000,
      );

      const event = {
        summary: `[${parentTitle}] ${block.title}`,
        description: `Block ${block.order + 1} of task: ${parentTitle}`,
        colorId: "5",
        start: {
          dateTime: currentStartTime.toISOString(),
          timeZone: "UTC",
        },
        end: {
          dateTime: endTime.toISOString(),
          timeZone: "UTC",
        },
      };

      try {
        const response = await calendar.events.insert({
          calendarId: "primary",
          requestBody: event,
        });
        results.push({ blockId: block.id, googleEventId: response.data.id });
        currentStartTime = new Date(endTime.getTime() + 5 * 60000);
      } catch (err: any) {
        logger.error({ blockTitle: block.title, error: err.message }, "Failed to sync calendar block");
      }
    }

    logger.info({ userId, taskId, count: results.length }, "Synced task blocks to Google Calendar");
    return results;
  } catch (error: any) {
    logger.error({ error: error.message, userId, taskId }, "Batch sync to Google Calendar failed");
    throw error;
  }
};

/**
 * Get Auth URL
 */
export const getAuthUrl = () => {
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent",
  });
};
