import { createContext, useContext, useState, type ReactNode } from "react";
import {type MaintenanceRequest } from "@/types/maintenance";
import { maintenanceService } from "@/services/maintenance.service";

interface MaintenanceContextType {
  requests: MaintenanceRequest[];
  loading: boolean;
  fetchRequests: () => Promise<void>;
  updateRequest: (id: number, data: Partial<MaintenanceRequest>) => Promise<void>;
}

const MaintenanceContext = createContext<MaintenanceContextType | undefined>(undefined);

export const MaintenanceProvider = ({ children }: { children: ReactNode }) => {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await maintenanceService.getAll();
      setRequests(data);
    } catch (error) {
      console.error("Failed to fetch requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateRequest = async (id: number, data: Partial<MaintenanceRequest>) => {
    try {
      const updateData = {
        ...data,
        equipmentId: typeof data.equipmentId === 'string' ? data.equipmentId : data.equipmentId?._id,
      };
      await maintenanceService.update(String(id), updateData);
      await fetchRequests();
    } catch (error) {
      console.error("Failed to update request:", error);
      throw error;
    }
  };

  return (
    <MaintenanceContext.Provider value={{ requests, loading, fetchRequests, updateRequest }}>
      {children}
    </MaintenanceContext.Provider>
  );
};

export const useMaintenance = () => {
  const context = useContext(MaintenanceContext);
  if (!context) {
    throw new Error("useMaintenance must be used within MaintenanceProvider");
  }
  return context;
};

