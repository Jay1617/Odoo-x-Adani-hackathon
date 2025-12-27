import { api } from "./api";
import type { Equipment, EquipmentFormData } from "@/types/equipment";

export const equipmentService = {
  getAll: async (params?: any): Promise<Equipment[]> => {
    // Backend supports filtering by department, assignedTo
    const query = new URLSearchParams(params).toString();
    const response = await api.get<Equipment[]>(`/equipments?${query}`);
    return response.data;
  },

  getById: async (id: string): Promise<Equipment> => {
    const response = await api.get<Equipment>(`/equipments/${id}`);
    return response.data;
  },

  create: async (data: EquipmentFormData): Promise<Equipment> => {
    const response = await api.post<Equipment>("/equipments", data);
    return response.data;
  },

  update: async (id: string, data: Partial<EquipmentFormData>): Promise<Equipment> => {
    const response = await api.put<Equipment>(`/equipments/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/equipments/${id}`);
  },
};
