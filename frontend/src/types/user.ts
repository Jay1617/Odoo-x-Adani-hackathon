export type Role = "PLATFORM_ADMIN" | "COMPANY_ADMIN" | "MAINTENANCE_TEAM" | "EMPLOYEE";

export interface User {
  _id: string;
  id?: string; // Some parts might map it, but _id is source of truth
  name: string;
  email_id: string;
  role: Role;
  companyId?: string;
  maintenanceTeamId?: string;
  phone?: string;
  isActive?: boolean;
  lastLogin?: string;
  avatar?: string;
}

export interface RegisterData {
  name: string;
  email_id: string;
  password: string;
  role: Role;
  companyId?: string;
  maintenanceTeamId?: string;
  phone?: string;
  companyDetails?: {
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
  };
}

