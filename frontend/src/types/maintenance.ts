export type MaintenanceRequestType = "corrective" | "preventive";
export type MaintenanceRequestStage = "new" | "in_progress" | "repaired" | "scrap";

export interface MaintenanceRequest {
  id: number;
  subject: string;
  type: MaintenanceRequestType;
  stage: MaintenanceRequestStage;
  equipmentId: number;
  equipmentName: string;
  equipmentSerialNumber?: string;
  scheduledDate?: string;
  duration?: number; // hours spent
  assignedToId?: number;
  assignedToName?: string;
  assignedToAvatar?: string;
  maintenanceTeamId: number;
  maintenanceTeamName: string;
  description?: string;
  isOverdue: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MaintenanceRequestFormData {
  subject: string;
  type: MaintenanceRequestType;
  equipmentId: number;
  scheduledDate?: string;
  description?: string;
}

