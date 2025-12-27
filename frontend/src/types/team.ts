export interface MaintenanceTeam {
  _id: string;
  name: string;
  description?: string;
  members: {
      _id: string;
      name: string;
      email: string;
  }[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface MaintenanceTeamFormData {
  name: string;
  description?: string;
  members?: string[]; // Array of User IDs
}
