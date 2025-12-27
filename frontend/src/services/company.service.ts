import { api } from "./api";
import type { Company } from "@/types/company";

export const companyService = {
  getAll: async (): Promise<Company[]> => {
    const response = await api.get<Company[]>("/companies");
    return response.data;
  },

  getById: async (id: number): Promise<Company> => {
    const response = await api.get<Company>(`/companies/${id}`);
    return response.data;
  },

  create: async (data: Omit<Company, "id" | "createdAt" | "updatedAt">): Promise<Company> => {
    const response = await api.post<Company>("/companies", data);
    return response.data;
  },

  update: async (id: number, data: Partial<Company>): Promise<Company> => {
    const response = await api.put<Company>(`/companies/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/companies/${id}`);
  },
};

