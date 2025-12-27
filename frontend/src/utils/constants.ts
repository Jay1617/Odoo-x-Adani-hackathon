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
  NEW: "New",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  ASSIGNED: "Assigned",
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
  APPROVED: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  REJECTED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  ASSIGNED: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  IN_PROGRESS: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  REPAIRED: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  SCRAP: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
};

