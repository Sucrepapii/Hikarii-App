import { describe, it, expect, vi, beforeEach } from "vitest";
import prisma from "../../config/db";

const {
  mockGetToken,
  mockSetCredentials,
  mockGenerateAuthUrl,
  mockEventsInsert,
} = vi.hoisted(() => ({
  mockGetToken: vi.fn(),
  mockSetCredentials: vi.fn(),
  mockGenerateAuthUrl: vi.fn().mockReturnValue("https://accounts.google.com/o/oauth2/v2/auth?scope=calendar"),
  mockEventsInsert: vi.fn(),
}));

vi.mock("googleapis", () => {
  return {
    google: {
      auth: {
        OAuth2: vi.fn().mockImplementation(function (this: any) {
          this.getToken = mockGetToken;
          this.setCredentials = mockSetCredentials;
          this.generateAuthUrl = mockGenerateAuthUrl;
        }),
      },
      calendar: vi.fn().mockImplementation(() => ({
        events: {
          insert: mockEventsInsert,
        },
      })),
    },
  };
});

vi.mock("../../config/db", () => ({
  default: {
    user: {
      update: vi.fn(),
      findUnique: vi.fn(),
    },
    task: {
      findUnique: vi.fn(),
    },
  },
}));

vi.mock("../../config/logger", () => ({
  default: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  },
}));

import {
  exchangeCodeForToken,
  createCalendarEvent,
  syncTaskBlocks,
  getAuthUrl,
} from "../google.calendar.service";

describe("GoogleCalendarService Unit Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAuthUrl", () => {
    it("should generate offline consent authorization URL", () => {
      const url = getAuthUrl();
      expect(url).toContain("https://accounts.google.com");
      expect(mockGenerateAuthUrl).toHaveBeenCalledWith(
        expect.objectContaining({
          access_type: "offline",
          prompt: "consent",
        })
      );
    });
  });

  describe("exchangeCodeForToken", () => {
    it("should exchange code and update user with Google tokens", async () => {
      mockGetToken.mockResolvedValueOnce({
        tokens: {
          access_token: "google-access-token-123",
          refresh_token: "google-refresh-token-456",
        },
      });

      const updatedUser = {
        id: "user-1",
        googleAccessToken: "google-access-token-123",
        googleRefreshToken: "google-refresh-token-456",
      };
      (prisma.user.update as any).mockResolvedValueOnce(updatedUser);

      const result = await exchangeCodeForToken("user-1", "auth-code-xyz");

      expect(mockGetToken).toHaveBeenCalledWith("auth-code-xyz");
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: "user-1" },
        data: {
          googleAccessToken: "google-access-token-123",
          googleRefreshToken: "google-refresh-token-456",
        },
      });
      expect(result).toEqual(updatedUser);
    });

    it("should throw a formatted error when token exchange fails", async () => {
      mockGetToken.mockRejectedValueOnce({
        response: { data: { error: "invalid_grant" } },
        message: "Bad request",
      });

      await expect(
        exchangeCodeForToken("user-1", "bad-code")
      ).rejects.toThrow("Google Auth Failed: invalid_grant");
    });
  });

  describe("createCalendarEvent", () => {
    it("should return null if user has no google access token", async () => {
      (prisma.user.findUnique as any).mockResolvedValueOnce({
        id: "user-no-token",
        googleAccessToken: null,
      });

      const result = await createCalendarEvent("user-no-token", {
        title: "Study Session",
      });

      expect(result).toBeNull();
      expect(mockEventsInsert).not.toHaveBeenCalled();
    });

    it("should create event successfully when user is authenticated with Google", async () => {
      (prisma.user.findUnique as any).mockResolvedValueOnce({
        id: "user-1",
        googleAccessToken: "token-abc",
        googleRefreshToken: "refresh-xyz",
      });

      mockEventsInsert.mockResolvedValueOnce({
        data: { id: "google-event-789", htmlLink: "https://calendar.google.com/..." },
      });

      const task = {
        title: "Sprint Planning",
        description: "Review Q4 deliverables",
        dueDate: "2026-11-01T10:00:00Z",
        estimatedDuration: 45,
      };

      const result = await createCalendarEvent("user-1", task);

      expect(mockSetCredentials).toHaveBeenCalledWith({
        access_token: "token-abc",
        refresh_token: "refresh-xyz",
      });
      expect(mockEventsInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          calendarId: "primary",
          requestBody: expect.objectContaining({
            summary: "Sprint Planning",
            description: "Review Q4 deliverables",
          }),
        })
      );
      expect(result).toEqual(expect.objectContaining({ id: "google-event-789" }));
    });

    it("should catch errors and return null safely on API failure", async () => {
      (prisma.user.findUnique as any).mockResolvedValueOnce({
        id: "user-1",
        googleAccessToken: "token-abc",
      });
      mockEventsInsert.mockRejectedValueOnce(new Error("Google Calendar Quota Exceeded"));

      const result = await createCalendarEvent("user-1", { title: "Test" });
      expect(result).toBeNull();
    });
  });

  describe("syncTaskBlocks", () => {
    it("should return null if user has no Google access token", async () => {
      (prisma.user.findUnique as any).mockResolvedValueOnce({
        id: "user-no-token",
        googleAccessToken: null,
      });

      const result = await syncTaskBlocks("user-no-token", "task-1", [
        { id: "b1", title: "Block 1", duration: 30, order: 0 },
      ]);

      expect(result).toBeNull();
    });

    it("should sync multiple task blocks to Google Calendar", async () => {
      (prisma.user.findUnique as any).mockResolvedValueOnce({
        id: "user-1",
        googleAccessToken: "token-abc",
      });
      (prisma.task.findUnique as any).mockResolvedValueOnce({
        title: "Math Homework",
        dueDate: "2026-10-25T14:00:00Z",
      });

      mockEventsInsert
        .mockResolvedValueOnce({ data: { id: "event-b1" } })
        .mockResolvedValueOnce({ data: { id: "event-b2" } });

      const blocks = [
        { id: "b1", title: "Read Chapter 1", duration: 30, order: 0 },
        { id: "b2", title: "Solve Problems 1-10", duration: 45, order: 1 },
      ];

      const result = await syncTaskBlocks("user-1", "task-1", blocks);

      expect(result).toHaveLength(2);
      expect(result).toEqual([
        { blockId: "b1", googleEventId: "event-b1" },
        { blockId: "b2", googleEventId: "event-b2" },
      ]);
      expect(mockEventsInsert).toHaveBeenCalledTimes(2);
    });
  });
});
