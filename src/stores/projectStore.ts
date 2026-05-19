import { create } from "zustand";
import { projectService } from "../services/project.service";
import { Project, CreateProjectData } from "../types/project.types";

interface ProjectState {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  createProject: (data: CreateProjectData) => Promise<void>;
  updateProject: (
    id: string,
    data: Partial<CreateProjectData>,
  ) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  toggleProjectStatus: (
    id: string,
    status: "ACTIVE" | "COMPLETED",
  ) => Promise<void>;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  isLoading: false,
  error: null,

  fetchProjects: async () => {
    try {
      set({ isLoading: true, error: null });
      const projects = await projectService.getProjects();
      set({ projects, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  createProject: async (data) => {
    try {
      set({ isLoading: true, error: null });
      const newProject = await projectService.createProject(data);
      set((state) => ({
        projects: [newProject, ...state.projects],
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateProject: async (id, data) => {
    try {
      set({ isLoading: true, error: null });
      const updatedProject = await projectService.updateProject(id, data);
      set((state) => ({
        projects: state.projects.map((p) => (p.id === id ? updatedProject : p)),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  deleteProject: async (id) => {
    const previousProjects = get().projects;
    try {
      // Optimistic Update
      set((state) => ({
        projects: state.projects.filter((p) => p.id !== id),
        error: null,
      }));
      await projectService.deleteProject(id);
    } catch (error: any) {
      // Rollback
      set({ projects: previousProjects, error: error.message });
      throw error;
    }
  },

  toggleProjectStatus: async (id, status) => {
    const previousProjects = get().projects;
    try {
      // Optimistic Update
      set((state) => ({
        projects: state.projects.map((p) =>
          p.id === id ? { ...p, status } : p
        ),
        error: null,
      }));
      const updatedProject = await projectService.toggleProjectStatus(
        id,
        status,
      );
      // Sync exact server state
      set((state) => ({
        projects: state.projects.map((p) => (p.id === id ? updatedProject : p)),
      }));
    } catch (error: any) {
      // Rollback
      set({ projects: previousProjects, error: error.message });
      throw error;
    }
  },
}));
