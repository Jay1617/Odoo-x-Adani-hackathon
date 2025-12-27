import { api } from "./api";

export interface MaintenanceCategory {
  id: string;
  name: string;
  description?: string;
  companyId: string;
  assignedEmployees: any[];
  maxEmployees: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryFormData {
  name: string;
  description?: string;
  maxEmployees?: number;
}

export const categoryService = {
  getAll: async (companyId?: string): Promise<MaintenanceCategory[]> => {
    const params = companyId ? `?companyId=${companyId}` : "";
    const response = await api.get<{ categories: MaintenanceCategory[] }>(`/categories${params}`);
    return response.data.categories || [];
  },

  getById: async (id: string): Promise<MaintenanceCategory> => {
    const response = await api.get<{ category: MaintenanceCategory }>(`/categories/${id}`);
    return response.data.category;
  },

  create: async (data: CategoryFormData): Promise<MaintenanceCategory> => {
    const response = await api.post<{ category: MaintenanceCategory }>("/categories", data);
    return response.data.category;
  },

  update: async (id: string, data: Partial<CategoryFormData>): Promise<MaintenanceCategory> => {
    const response = await api.put<{ category: MaintenanceCategory }>(`/categories/${id}`, data);
    return response.data.category;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },

  assignEmployee: async (categoryId: string, employeeId: string): Promise<MaintenanceCategory> => {
    const response = await api.post<{ category: MaintenanceCategory }>(
      `/categories/${categoryId}/assign`,
      { employeeId }
    );
    return response.data.category;
  },

  removeEmployee: async (categoryId: string, employeeId: string): Promise<void> => {
    await api.delete(`/categories/${categoryId}/assign/${employeeId}`);
  },
};

