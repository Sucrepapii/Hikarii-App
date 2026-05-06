import apiClient from "../api/client";
import { ProjectMember, ProjectComment, CollaborationRole } from "../types/project.types";

const BASE = "/collaboration";

export const collaborationService = {
  // Members
  getMembers: async (projectId: string): Promise<ProjectMember[]> => {
    const res = await apiClient.get(`${BASE}/projects/${projectId}/members`);
    return res.data;
  },

  inviteMember: async (
    projectId: string,
    email: string,
    role: CollaborationRole
  ): Promise<ProjectMember> => {
    const res = await apiClient.post(`${BASE}/projects/${projectId}/members`, { email, role });
    return res.data.member;
  },

  updateMemberRole: async (
    projectId: string,
    memberId: string,
    role: CollaborationRole
  ): Promise<ProjectMember> => {
    const res = await apiClient.patch(`${BASE}/projects/${projectId}/members/${memberId}`, { role });
    return res.data;
  },

  removeMember: async (projectId: string, memberId: string): Promise<void> => {
    await apiClient.delete(`${BASE}/projects/${projectId}/members/${memberId}`);
  },

  acceptInvite: async (token: string): Promise<void> => {
    await apiClient.post(`${BASE}/invites/${token}/accept`);
  },

  // Comments
  getComments: async (projectId: string): Promise<ProjectComment[]> => {
    const res = await apiClient.get(`${BASE}/projects/${projectId}/comments`);
    return res.data;
  },

  postComment: async (projectId: string, content: string): Promise<ProjectComment> => {
    const res = await apiClient.post(`${BASE}/projects/${projectId}/comments`, { content });
    return res.data;
  },

  deleteComment: async (projectId: string, commentId: string): Promise<void> => {
    await apiClient.delete(`${BASE}/projects/${projectId}/comments/${commentId}`);
  },

  getPendingInvites: async (): Promise<ProjectMember[]> => {
    const res = await apiClient.get(`${BASE}/pending-invites`);
    return res.data;
  },
};
