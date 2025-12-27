import { api } from "./api";
import type { MaintenanceRequest, MaintenanceRequestFormData } from "@/types/maintenance";

export const maintenanceService = {
  getAll: async (): Promise<MaintenanceRequest[]> => {
    const response = await api.get<MaintenanceRequest[]>("/maintenance-requests");
    return response.data;
  },

  getById: async (id: number): Promise<MaintenanceRequest> => {
    const response = await api.get<MaintenanceRequest>(`/maintenance-requests/${id}`);
    return response.data;
  },

  create: async (data: MaintenanceRequestFormData): Promise<MaintenanceRequest> => {
    const response = await api.post<MaintenanceRequest>("/maintenance-requests", data);
    return response.data;
  },

  update: async (id: number, data: Partial<MaintenanceRequestFormData>): Promise<MaintenanceRequest> => {
    const response = await api.put<MaintenanceRequest>(`/maintenance-requests/${id}`, data);
    return response.data;
  },

  updateStage: async (id: number, stage: MaintenanceRequest["stage"]): Promise<MaintenanceRequest> => {
    const response = await api.patch<MaintenanceRequest>(`/maintenance-requests/${id}/stage`, { stage });
    return response.data;
  },

  assign: async (id: number, userId: number): Promise<MaintenanceRequest> => {
    const response = await api.patch<MaintenanceRequest>(`/maintenance-requests/${id}/assign`, { userId });
    return response.data;
  },

  updateDuration: async (id: number, duration: number): Promise<MaintenanceRequest> => {
    const response = await api.patch<MaintenanceRequest>(`/maintenance-requests/${id}/duration`, { duration });
    return response.data;
  },

  getPreventive: async (): Promise<MaintenanceRequest[]> => {
    const response = await api.get<MaintenanceRequest[]>("/maintenance-requests?type=preventive");
    return response.data;
  },

  getByEquipment: async (equipmentId: number): Promise<MaintenanceRequest[]> => {
    const response = await api.get<MaintenanceRequest[]>(`/maintenance-requests?equipmentId=${equipmentId}`);
    return response.data;
  },
};

