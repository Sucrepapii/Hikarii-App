import { Response } from "express";
import { randomBytes } from "crypto";
import prisma from "../config/db";
import { AuthRequest } from "../middleware/auth.middleware";
import { sendEmail } from "../services/email.service";
import { getInviteTemplate } from "../utils/emailTemplates";

// ── HELPERS ──────────────────────────────────────────────────────────────────

const FREE_COLLAB_LIMIT = 1; // Free users can share 1 project
const isPro = (user: any) =>
  user?.subscriptionStatus === "PRO" || user?.subscriptionStatus === "TRIAL";

/** Check that current user is the owner of the project */
async function assertOwner(projectId: string, userId: string) {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (project?.userId !== userId) return null;
  return project;
}

/** Check that current user has at least a given role in a shared project */
async function getMemberRole(projectId: string, userId: string) {
  const membership = await (prisma as any).projectMember.findFirst({
    where: { projectId, userId, status: "ACCEPTED" },
  });
  return membership?.role ?? null;
}

// ── INVITE A COLLABORATOR ────────────────────────────────────────────────────

export const inviteMember = async (req: AuthRequest, res: Response) => {
  try {
    const { id: projectId } = req.params;
    const { email, role = "VIEW_ONLY" } = req.body;

    if (!email) return res.status(400).json({ error: "Email is required" });

    const project = await assertOwner(projectId as string, req.userId!);
    if (!project || project.userId !== req.userId!) {
      return res.status(403).json({ error: "Only the project owner can invite members" });
    }

    // Subscription gating: free users can share only FREE_COLLAB_LIMIT project(s)
    const currentUser = await prisma.user.findUnique({ where: { id: req.userId! } });
    if (!isPro(currentUser)) {
      const sharedProjectIds = await (prisma as any).projectMember.findMany({
        where: { invitedById: req.userId!, status: { not: "DECLINED" } },
        select: { projectId: true },
        distinct: ["projectId"],
      });
      if (sharedProjectIds.length >= FREE_COLLAB_LIMIT && !sharedProjectIds.some((m: any) => m.projectId === projectId)) {
        return res.status(403).json({
          error: "Free plan allows sharing only 1 project. Upgrade to PRO for unlimited collaboration.",
          code: "UPGRADE_REQUIRED",
        });
      }
    }

    // Prevent owner from inviting themselves
    if (email === currentUser?.email) {
      return res.status(400).json({ error: "You cannot invite yourself" });
    }

    // Check for existing invite
    const existing = await (prisma as any).projectMember.findFirst({
      where: { projectId, invitedEmail: email },
    });
    if (existing) {
      if (existing.status === "ACCEPTED")
        return res.status(409).json({ error: "This user is already a member" });
      if (existing.status === "PENDING")
        return res.status(409).json({ error: "Invite already sent and pending" });
    }

    const token = randomBytes(32).toString("hex");

    // Find invited user if already registered
    const invitedUser = await prisma.user.findUnique({ where: { email } });

    const member = await (prisma as any).projectMember.create({
      data: {
        projectId,
        invitedEmail: email,
        invitedById: req.userId!,
        userId: invitedUser?.id ?? null,
        role,
        status: "PENDING",
        token,
      },
    });

    // Send email invite
    const clientUrl = process.env.CLIENT_URL || "https://www.hikarii.org";
    const inviteLink = `${clientUrl}/invites/${token}`;

    try {
      await sendEmail(
        email,
        `Invitation to collaborate on "${project.title}"`,
        getInviteTemplate(currentUser!.name, project.title, inviteLink),
        { fromName: "Hikari Collaboration" }
      );
    } catch (emailErr) {
      console.error("Failed to send invite email:", emailErr);
      // We still return 201 because the database record is created
    }

    res.status(201).json({ message: "Invite sent successfully", member });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// ── ACCEPT AN INVITE (via token link) ───────────────────────────────────────

export const acceptInvite = async (req: AuthRequest, res: Response) => {
  try {
    const { token } = req.params;

    const member = await (prisma as any).projectMember.findUnique({ where: { token } });
    if (!member) return res.status(404).json({ error: "Invalid or expired invite link" });
    if (member.status !== "PENDING") return res.status(400).json({ error: "Invite already used" });

    const updatedMember = await (prisma as any).projectMember.update({
      where: { token },
      data: { status: "ACCEPTED", userId: req.userId!, token: null },
    });

    res.json({ message: "Invite accepted", member: updatedMember });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// ── LIST MEMBERS ─────────────────────────────────────────────────────────────

export const getMembers = async (req: AuthRequest, res: Response) => {
  try {
    const { id: projectId } = req.params;

    // Must be owner or member
    const isOwner = await assertOwner(projectId as string, req.userId!);
    const role = await getMemberRole(projectId as string, req.userId!);
    if (!isOwner && !role) return res.status(403).json({ error: "Access denied" });

    const members = await (prisma as any).projectMember.findMany({
      where: { projectId: projectId as string },
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: "asc" },
    });

    res.json(members);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// ── UPDATE MEMBER ROLE ───────────────────────────────────────────────────────

export const updateMemberRole = async (req: AuthRequest, res: Response) => {
  try {
    const { id: projectId, memberId } = req.params;
    const { role } = req.body;

    const isOwner = await assertOwner(projectId as string, req.userId!);
    if (!isOwner) return res.status(403).json({ error: "Only the project owner can change roles" });

    const updated = await (prisma as any).projectMember.update({
      where: { id: memberId },
      data: { role },
    });

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// ── REMOVE A MEMBER ──────────────────────────────────────────────────────────

export const removeMember = async (req: AuthRequest, res: Response) => {
  try {
    const { id: projectId, memberId } = req.params;

    const isOwner = await assertOwner(projectId as string, req.userId!);
    if (!isOwner) return res.status(403).json({ error: "Only the project owner can remove members" });

    await (prisma as any).projectMember.delete({ where: { id: memberId } });

    res.json({ message: "Member removed" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// ── COMMENTS / ACTIVITY LOG ──────────────────────────────────────────────────

export const getComments = async (req: AuthRequest, res: Response) => {
  try {
    const { id: projectId } = req.params;

    const isOwner = await assertOwner(projectId as string, req.userId!);
    const role = await getMemberRole(projectId, req.userId!);
    if (!isOwner && !role) return res.status(403).json({ error: "Access denied" });

    const comments = await (prisma as any).projectComment.findMany({
      where: { projectId },
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: "asc" },
    });

    res.json(comments);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const postComment = async (req: AuthRequest, res: Response) => {
  try {
    const { id: projectId } = req.params;
    const { content } = req.body;

    if (!content?.trim()) return res.status(400).json({ error: "Comment cannot be empty" });

    const isOwner = await assertOwner(projectId as string, req.userId!);
    const role = await getMemberRole(projectId, req.userId!);
    if (!isOwner && !role) return res.status(403).json({ error: "Access denied" });

    const comment = await (prisma as any).projectComment.create({
      data: { content: content.trim(), projectId, userId: req.userId! },
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    res.status(201).json(comment);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteComment = async (req: AuthRequest, res: Response) => {
  try {
    const { commentId } = req.params;

    const comment = await (prisma as any).projectComment.findUnique({
      where: { id: commentId },
    });
    if (!comment) return res.status(404).json({ error: "Comment not found" });
    if (comment.userId !== req.userId) {
      return res.status(403).json({ error: "You can only delete your own comments" });
    }

    await (prisma as any).projectComment.delete({ where: { id: commentId } });
    res.json({ message: "Comment deleted" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
