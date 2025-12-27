export type Role = "main_admin" | "company_admin" | "employee";

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  companyId?: number;
  avatar?: string;
}

