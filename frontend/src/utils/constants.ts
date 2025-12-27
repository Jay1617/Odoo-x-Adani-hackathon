export const MAINTENANCE_STAGES = {
  NEW: "new",
  IN_PROGRESS: "in_progress",
  REPAIRED: "repaired",
  SCRAP: "scrap",
} as const;

export const MAINTENANCE_TYPES = {
  CORRECTIVE: "corrective",
  PREVENTIVE: "preventive",
} as const;

export const EQUIPMENT_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  SCRAPPED: "scrapped",
} as const;

export const STAGE_LABELS: Record<string, string> = {
  new: "New",
  in_progress: "In Progress",
  repaired: "Repaired",
  scrap: "Scrap",
};

export const TYPE_LABELS: Record<string, string> = {
  corrective: "Corrective",
  preventive: "Preventive",
};

export const STAGE_COLORS: Record<string, string> = {
  new: "bg-blue-100 text-blue-800",
  in_progress: "bg-yellow-100 text-yellow-800",
  repaired: "bg-green-100 text-green-800",
  scrap: "bg-red-100 text-red-800",
};

