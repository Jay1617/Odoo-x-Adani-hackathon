import { api } from "./api";
import type { Company } from "@/types/company";

export interface CompanyFormData {
  name: string;
  email?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
}

export const companyService = {
  getAll: async (): Promise<Company[]> => {
    const response = await api.get<{ companies: Company[] }>("/companies");
    return response.data.companies || [];
  },

  getById: async (id: string): Promise<Company> => {
    const response = await api.get<{ company: Company }>(`/companies/${id}`);
    return response.data.company;
  },

  create: async (data: CompanyFormData): Promise<Company> => {
    const response = await api.post<{ company: Company }>("/companies", data);
    return response.data.company;
  },

  update: async (id: string, data: Partial<CompanyFormData>): Promise<Company> => {
    const response = await api.put<{ company: Company }>(`/companies/${id}`, data);
    return response.data.company;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/companies/${id}`);
  },

  getPublic: async (): Promise<{ _id: string; name: string }[]> => {
    const response = await api.get<{ companies: { _id: string; name: string }[] }>("/companies/public");
    // Interceptor unwraps response.data.data to response.data
    return response.data.companies;
  },
};
