import type { Role } from "@/types/user";

export const canManageEquipment = (role: Role): boolean => {
  return role === "main_admin" || role === "company_admin";
};

export const canManageTeams = (role: Role): boolean => {
  return role === "main_admin" || role === "company_admin";
};

export const canCreateRequest = (role: Role): boolean => {
  return true; // All users can create requests
};

export const canAssignRequest = (role: Role): boolean => {
  return role === "main_admin" || role === "company_admin";
};

export const canViewReports = (role: Role): boolean => {
  return role === "main_admin" || role === "company_admin";
};

export const canManageCompanies = (role: Role): boolean => {
  return role === "main_admin";
};

