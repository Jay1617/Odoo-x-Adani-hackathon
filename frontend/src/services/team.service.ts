import { api } from "./api";
import type { MaintenanceTeam, MaintenanceTeamFormData } from "@/types/team";

export const teamService = {
  getAll: async (): Promise<MaintenanceTeam[]> => {
    const response = await api.get<MaintenanceTeam[]>("/teams");
    return response.data;
  },

  getById: async (id: number): Promise<MaintenanceTeam> => {
    const response = await api.get<MaintenanceTeam>(`/teams/${id}`);
    return response.data;
  },

  create: async (data: MaintenanceTeamFormData): Promise<MaintenanceTeam> => {
    const response = await api.post<MaintenanceTeam>("/teams", data);
    return response.data;
  },

  update: async (id: number, data: Partial<MaintenanceTeamFormData>): Promise<MaintenanceTeam> => {
    const response = await api.put<MaintenanceTeam>(`/teams/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/teams/${id}`);
  },
};

