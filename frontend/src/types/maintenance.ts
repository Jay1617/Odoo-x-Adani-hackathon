export type MaintenanceRequestType = "CORRECTIVE" | "PREVENTIVE";
export type MaintenanceRequestStatus = "NEW" | "IN_PROGRESS" | "REPAIRED" | "SCRAP";

export interface MaintenanceRequest {
  _id: string;
  subject: string;
  requestType: MaintenanceRequestType;
  status: MaintenanceRequestStatus;
  
  equipmentId: {
      _id: string;
      name: string;
      serialNumber: string;
      defaultMaintenanceCategory?: string;
  };
  
  scheduledDate?: string;
  duration?: number; // hours spent
  
  assignedTo?: {
      _id: string;
      name: string;
      email: string;
  };
  
  maintenanceTeamId?: {
      _id: string;
      name: string;
  };
  
  requestedBy?: {
      _id: string;
      name: string;
      email: string;
  };

  description?: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  resolution?: string;
  
  createdAt: string;
  updatedAt: string;
}

export interface MaintenanceRequestFormData {
  subject: string;
  requestType: MaintenanceRequestType;
  equipmentId: string;
  scheduledDate?: string;
  description?: string;
  priority?: string;
}
