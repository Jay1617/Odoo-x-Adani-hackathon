import type { Role } from "@/types/user";

export const canManageEquipment = (role: Role): boolean => {
  return role === "PLATFORM_ADMIN" || role === "COMPANY_ADMIN";
};

export const canManageTeams = (role: Role): boolean => {
  return role === "PLATFORM_ADMIN" || role === "COMPANY_ADMIN";
};

export const canCreateRequest = (): boolean => {
  return true; // All users can create requests
};

export const canAssignRequest = (role: Role): boolean => {
  return role === "PLATFORM_ADMIN" || role === "COMPANY_ADMIN";
};

export const canViewReports = (role: Role): boolean => {
  return role === "PLATFORM_ADMIN" || role === "COMPANY_ADMIN";
};

export const canManageCompanies = (role: Role): boolean => {
  return role === "PLATFORM_ADMIN";
};