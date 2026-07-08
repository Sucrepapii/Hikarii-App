import apiClient from "../api/client";
import {
  Project,
  CreateProjectData,
  ProjectSummary,
} from "../types/project.types";

export const projectService = {
  getProjects: async (): Promise<Project[]> => {
    const response = await apiClient.get("/projects");
    return response.data;
  },

  getProject: async (id: string): Promise<Project> => {
    const response = await apiClient.get(`/projects/${id}`);
    return response.data;
  },

  createProject: async (data: CreateProjectData): Promise<Project> => {
    const response = await apiClient.post("/projects", data);
    return response.data;
  },

  updateProject: async (
    id: string,
    data: Partial<CreateProjectData>,
  ): Promise<Project> => {
    const response = await apiClient.put(`/projects/${id}`, data);
    return response.data;
  },

  deleteProject: async (id: string): Promise<void> => {
    await apiClient.delete(`/projects/${id}`);
  },

  toggleProjectStatus: async (
    id: string,
    status: "ACTIVE" | "COMPLETED",
  ): Promise<Project> => {
    const response = await apiClient.put(`/projects/${id}`, { status });
    return response.data;
  },

  getProjectSummary: async (id: string): Promise<ProjectSummary> => {
    const response = await apiClient.get(`/projects/${id}/summary`);
    return response.data;
  },

  scopeProject: async (prompt: string, totalBudget?: number): Promise<any> => {
    const response = await apiClient.post("/projects/scope", { prompt, totalBudget });
    return response.data;
  },
};
