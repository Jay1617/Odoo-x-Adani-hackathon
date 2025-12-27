export interface TeamMember {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

export interface MaintenanceTeam {
  id: number;
  name: string;
  description?: string;
  members: TeamMember[];
  createdAt: string;
  updatedAt: string;
}

export interface MaintenanceTeamFormData {
  name: string;
  description?: string;
  memberIds: number[];
}

