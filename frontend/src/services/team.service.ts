import { api } from "./api";
import type { MaintenanceTeam, MaintenanceTeamFormData } from "@/types/team";

export const teamService = {
  getAll: async (): Promise<MaintenanceTeam[]> => {
    const response = await api.get<MaintenanceTeam[]>("/maintenance-teams");
    return response.data;
  },

  getById: async (id: string): Promise<MaintenanceTeam> => {
    const response = await api.get<MaintenanceTeam>(`/maintenance-teams/${id}`);
    return response.data;
  },

  create: async (data: MaintenanceTeamFormData): Promise<MaintenanceTeam> => {
    const response = await api.post<MaintenanceTeam>("/maintenance-teams", data);
    return response.data;
  },

  update: async (id: string, data: Partial<MaintenanceTeamFormData>): Promise<MaintenanceTeam> => {
    const response = await api.put<MaintenanceTeam>(`/maintenance-teams/${id}`, data);
    return response.data;
  },
};
