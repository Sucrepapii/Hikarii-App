import express from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
  inviteMember,
  acceptInvite,
  getMembers,
  updateMemberRole,
  removeMember,
  getComments,
  postComment,
  deleteComment,
} from "../controllers/collaboration.controller";

const router = express.Router();

router.use(authenticate);

// Invite accept (by token — public-ish but still needs auth to know who is accepting)
router.post("/invites/:token/accept", acceptInvite);

// Member management (scoped to a project)
router.get("/projects/:id/members", getMembers);
router.post("/projects/:id/members", inviteMember);
router.patch("/projects/:id/members/:memberId", updateMemberRole);
router.delete("/projects/:id/members/:memberId", removeMember);

// Activity log (comments)
router.get("/projects/:id/comments", getComments);
router.post("/projects/:id/comments", postComment);
router.delete("/projects/:id/comments/:commentId", deleteComment);

export default router;
