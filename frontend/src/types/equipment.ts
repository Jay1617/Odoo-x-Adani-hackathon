export interface Equipment {
  _id: string; // MongoDB ID is _id usually, but let's map to id if we want, but usually _id
  id?: string; // Optional for frontend compat if mapped
  name: string;
  serialNumber: string;
  purchaseDate: string;
  warrantyExpiry?: string;
  location: string;
  department?: string;
  assignedTo?: {
      _id: string;
      name: string;
      email: string;
  }; 
  maintenanceTeamId?: {
      _id: string;
      name: string;
  };
  defaultMaintenanceCategory?: string;
  category?: string;
  status: "ACTIVE" | "INACTIVE" | "SCRAPPED";
  notes?: string;
  openRequestCount?: number; // From smart button logic
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
  assignedTo?: string; // User ID
  maintenanceTeamId?: string; // Team ID
  category?: string;
  notes?: string;
}
