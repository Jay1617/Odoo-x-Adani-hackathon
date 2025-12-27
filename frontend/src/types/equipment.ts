export interface Equipment {
  id: number;
  name: string;
  serialNumber: string;
  purchaseDate: string;
  warrantyExpiry?: string;
  location: string;
  department?: string;
  employeeId?: number;
  employeeName?: string;
  maintenanceTeamId: number;
  maintenanceTeamName: string;
  technicianId?: number;
  technicianName?: string;
  category?: string;
  status: "active" | "inactive" | "scrapped";
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EquipmentFormData {
  name: string;
  serialNumber: string;
  purchaseDate: string;
  warrantyExpiry?: string;
  location: string;
  department?: string;
  employeeId?: number;
  maintenanceTeamId: number;
  technicianId?: number;
  category?: string;
  notes?: string;
}

