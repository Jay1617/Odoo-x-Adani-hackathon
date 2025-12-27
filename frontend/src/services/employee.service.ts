import { api } from "./api";
import type { User } from "@/types/user";

export interface EmployeeFormData {
  name: string;
  email_id: string;
  password: string;
  role: "EMPLOYEE" | "MAINTENANCE_TEAM";
  phone?: string;
}

export const employeeService = {
  getAll: async (): Promise<User[]> => {
    const response = await api.get<{ employees: User[] }>("/employees");
    return response.data.employees || [];
  },

  create: async (data: EmployeeFormData): Promise<User> => {
    const response = await api.post<{ employee: User }>("/employees", data);
    return response.data.employee;
  },

  update: async (id: string, data: Partial<EmployeeFormData>): Promise<User> => {
    const response = await api.put<{ employee: User }>(`/employees/${id}`, data);
    return response.data.employee;
  },

  updateRole: async (id: string, role: "EMPLOYEE" | "MAINTENANCE_TEAM", maintenanceTeamId?: string): Promise<User> => {
    // The backend endpoint we added is /users/:id/role (in user routes)
    const payload: any = { role };
    if (maintenanceTeamId) {
        payload.maintenanceTeamId = maintenanceTeamId;
    }
    const response = await api.put<{ user: User }>(`/users/${id}/role`, payload);
    return response.data.user;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/employees/${id}`);
  },
};

