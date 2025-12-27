import { api } from "./api";
import type { Equipment, EquipmentFormData } from "@/types/equipment";

export const equipmentService = {
  getAll: async (): Promise<Equipment[]> => {
    const response = await api.get<Equipment[]>("/equipment");
    return response.data;
  },

  getById: async (id: number): Promise<Equipment> => {
    const response = await api.get<Equipment>(`/equipment/${id}`);
    return response.data;
  },

  create: async (data: EquipmentFormData): Promise<Equipment> => {
    const response = await api.post<Equipment>("/equipment", data);
    return response.data;
  },

  update: async (id: number, data: Partial<EquipmentFormData>): Promise<Equipment> => {
    const response = await api.put<Equipment>(`/equipment/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/equipment/${id}`);
  },

  getByDepartment: async (department: string): Promise<Equipment[]> => {
    const response = await api.get<Equipment[]>(`/equipment?department=${department}`);
    return response.data;
  },

  getByEmployee: async (employeeId: number): Promise<Equipment[]> => {
    const response = await api.get<Equipment[]>(`/equipment?employeeId=${employeeId}`);
    return response.data;
  },

  getMaintenanceRequests: async (equipmentId: number) => {
    const response = await api.get(`/equipment/${equipmentId}/maintenance-requests`);
    return response.data;
  },
};

