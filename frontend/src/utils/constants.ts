export const MAINTENANCE_STAGES = {
  NEW: "NEW",
  IN_PROGRESS: "IN_PROGRESS",
  REPAIRED: "REPAIRED",
  SCRAP: "SCRAP",
} as const;

export const MAINTENANCE_TYPES = {
  CORRECTIVE: "CORRECTIVE",
  PREVENTIVE: "PREVENTIVE",
} as const;

export const EQUIPMENT_STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  SCRAPPED: "SCRAPPED",
} as const;

export const STAGE_LABELS: Record<string, string> = {
  NEW: "New",
  IN_PROGRESS: "In Progress",
  REPAIRED: "Repaired",
  SCRAP: "Scrap",
};

export const TYPE_LABELS: Record<string, string> = {
  CORRECTIVE: "Corrective",
  PREVENTIVE: "Preventive",
};

export const STAGE_COLORS: Record<string, string> = {
  NEW: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  IN_PROGRESS: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  REPAIRED: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  SCRAP: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 border border-gray-500",
};
