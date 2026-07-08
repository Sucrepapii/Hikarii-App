import { create } from "zustand";
import { collaborationService } from "../services/collaboration.service";
import { ProjectMember, ProjectComment, CollaborationRole } from "../types/project.types";

interface CollaborationState {
  members: ProjectMember[];
  comments: ProjectComment[];
  isMembersLoading: boolean;
  isCommentsLoading: boolean;
  error: string | null;

  fetchMembers: (projectId: string) => Promise<void>;
  inviteMember: (projectId: string, email: string, role: CollaborationRole) => Promise<void>;
  updateMemberRole: (projectId: string, memberId: string, role: CollaborationRole) => Promise<void>;
  removeMember: (projectId: string, memberId: string) => Promise<void>;

  pendingInvites: ProjectMember[];
  fetchPendingInvites: () => Promise<void>;
  acceptInvite: (token: string) => Promise<void>;

  recentActivity: any[];
  fetchRecentActivity: () => Promise<void>;
  markActivityAsRead: (projectId: string) => Promise<void>;

  fetchComments: (projectId: string) => Promise<void>;
  postComment: (projectId: string, content: string) => Promise<void>;
  deleteComment: (projectId: string, commentId: string) => Promise<void>;

  reset: () => void;
}

export const useCollaborationStore = create<CollaborationState>((set) => ({
  members: [],
  comments: [],
  pendingInvites: [],
  recentActivity: [],
  isMembersLoading: false,
  isCommentsLoading: false,
  error: null,

  fetchMembers: async (projectId) => {
    try {
      set({ isMembersLoading: true, error: null });
      const members = await collaborationService.getMembers(projectId);
      set({ members, isMembersLoading: false });
    } catch (error: any) {
      set({ error: error.message, isMembersLoading: false });
    }
  },

  inviteMember: async (projectId, email, role) => {
    try {
      set({ error: null });
      const member = await collaborationService.inviteMember(projectId, email, role);
      set((state) => ({ members: [...state.members, member] }));
    } catch (error: any) {
      const msg = error.response?.data?.error || error.message;
      set({ error: msg });
      throw new Error(msg);
    }
  },

  updateMemberRole: async (projectId, memberId, role) => {
    try {
      const updated = await collaborationService.updateMemberRole(projectId, memberId, role);
      set((state) => ({
        members: state.members.map((m) => (m.id === memberId ? updated : m)),
      }));
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  removeMember: async (projectId, memberId) => {
    try {
      await collaborationService.removeMember(projectId, memberId);
      set((state) => ({ members: state.members.filter((m) => m.id !== memberId) }));
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  fetchComments: async (projectId) => {
    try {
      set({ isCommentsLoading: true, error: null });
      const comments = await collaborationService.getComments(projectId);
      set({ comments, isCommentsLoading: false });
    } catch (error: any) {
      set({ error: error.message, isCommentsLoading: false });
    }
  },

  postComment: async (projectId, content) => {
    try {
      const comment = await collaborationService.postComment(projectId, content);
      set((state) => ({ comments: [...state.comments, comment] }));
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  deleteComment: async (projectId, commentId) => {
    try {
      await collaborationService.deleteComment(projectId, commentId);
      set((state) => ({ comments: state.comments.filter((c) => c.id !== commentId) }));
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  fetchPendingInvites: async () => {
    try {
      const invites = await collaborationService.getPendingInvites();
      set({ pendingInvites: invites });
    } catch (error: any) {
      console.error("Failed to fetch pending invites", error);
    }
  },

  acceptInvite: async (token) => {
    try {
      await collaborationService.acceptInvite(token);
      set((state) => ({
        pendingInvites: state.pendingInvites.filter((i) => i.token !== token),
      }));
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  fetchRecentActivity: async () => {
    try {
      const activity = await collaborationService.getRecentActivity();
      set({ recentActivity: activity });
    } catch (error: any) {
      console.error("Failed to fetch recent activity", error);
    }
  },

  markActivityAsRead: async (projectId) => {
    try {
      await collaborationService.markActivityAsRead(projectId);
      set((state) => ({
        recentActivity: state.recentActivity.filter((a) => a.projectId !== projectId),
      }));
    } catch (error: any) {
      console.error("Failed to mark activity as read", error);
    }
  },

  reset: () => set({ members: [], comments: [], pendingInvites: [], recentActivity: [], error: null }),
}));
