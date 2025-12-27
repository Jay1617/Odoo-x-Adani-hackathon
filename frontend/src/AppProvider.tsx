import { type ReactNode } from "react";
import { AuthProvider } from "./context/AuthContext";
import { UIProvider } from "./context/UIContext";
import { MaintenanceProvider } from "./context/MaintenanceContext";

export const AppProvider = ({ children }: { children: ReactNode }) => {
  return (
    <AuthProvider>
      <UIProvider>
        <MaintenanceProvider>{children}</MaintenanceProvider>
      </UIProvider>
    </AuthProvider>
  );
};
