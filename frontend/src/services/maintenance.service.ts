import { api } from "./api";
import type { MaintenanceRequest, MaintenanceRequestFormData, MaintenanceRequestStatus } from "@/types/maintenance";

export const maintenanceService = {
  getAll: async (params?: any): Promise<MaintenanceRequest[]> => {
    const query = new URLSearchParams(params).toString();
    const response = await api.get<MaintenanceRequest[]>(`/maintenance-requests?${query}`);
    return response.data;
  },

  getById: async (id: string): Promise<MaintenanceRequest> => {
    const response = await api.get<MaintenanceRequest>(`/maintenance-requests/${id}`);
    return response.data;
  },

  create: async (data: MaintenanceRequestFormData): Promise<MaintenanceRequest> => {
    const response = await api.post<MaintenanceRequest>("/maintenance-requests", data);
    return response.data;
  },

  update: async (id: string, data: Partial<MaintenanceRequestFormData> | { status: string; duration?: number; assignedTo?: string }): Promise<MaintenanceRequest> => {
    const response = await api.put<MaintenanceRequest>(`/maintenance-requests/${id}`, data);
    return response.data;
  },

  // Helper method for status updates (e.g. Kanban drag drop)
  updateStatus: async (id: string, status: MaintenanceRequestStatus): Promise<MaintenanceRequest> => {
     return maintenanceService.update(id, { status });
  },

  getPreventive: async (): Promise<MaintenanceRequest[]> => {
    const response = await api.get<MaintenanceRequest[]>("/maintenance-requests?type=PREVENTIVE");
    return response.data;
  },

  getByEquipment: async (equipmentId: string): Promise<MaintenanceRequest[]> => {
    const response = await api.get<MaintenanceRequest[]>(`/maintenance-requests?equipmentId=${equipmentId}`);
    return response.data;
  },
  getByTeam: async (teamId: string): Promise<MaintenanceRequest[]> => {
    const response = await api.get<MaintenanceRequest[]>(`/maintenance-requests?maintenanceTeamId=${teamId}`);
    return response.data;
  },
};
