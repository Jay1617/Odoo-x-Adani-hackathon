import dayjs from "dayjs";

export const formatDate = (date: string | Date): string => {
  return dayjs(date).format("MMM DD, YYYY");
};

export const formatDateTime = (date: string | Date): string => {
  return dayjs(date).format("MMM DD, YYYY HH:mm");
};

export const isOverdue = (date: string | Date | undefined): boolean => {
  if (!date) return false;
  return dayjs(date).isBefore(dayjs(), "day");
};

export const isToday = (date: string | Date): boolean => {
  return dayjs(date).isSame(dayjs(), "day");
};

export const isPast = (date: string | Date): boolean => {
  return dayjs(date).isBefore(dayjs(), "day");
};

export const isFuture = (date: string | Date): boolean => {
  return dayjs(date).isAfter(dayjs(), "day");
};

