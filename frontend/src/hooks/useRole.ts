import { useAuth } from "./useAuth";
import type { Role } from "@/types/user";

export const useRole = () => {
  const { user } = useAuth();
  return user?.role as Role | undefined;
};

export const useHasRole = (allowedRoles: Role[]): boolean => {
  const role = useRole();
  return role ? allowedRoles.includes(role) : false;
};

