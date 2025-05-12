import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// utils/toSlug.ts
export const toSlug = (str: string) =>
  str.replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');

export function unSlug(str: string) {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function slugifySchedule(schedule: string): string {
  // Remove colons and split
  return schedule
    .replace(/[: ]/g, '-')   // replaces ":" and " " with "-"
    .replace(/-+/g, '-')     // collapse multiple dashes
    .toUpperCase();          // standardize casing
}

export function unslugSchedule(slug: string) {
  // Split the slug into parts
  const parts = slug.split('-');
  
  // Extract days (first part)
  const days = parts[0];
  
  // Extract start time components
  const startHour = parts[1];
  const startMinute = parts[2];
  const startPeriod = parts[3];
  
  // Extract end time components
  const endHour = parts[4];
  const endMinute = parts[5];
  const endPeriod = parts[6];
  
  // Format the times with colons
  const startTime = `${startHour}:${startMinute} ${startPeriod}`;
  const endTime = `${endHour}:${endMinute} ${endPeriod}`;
  
  // Combine everything
  return `${days} ${startTime} - ${endTime}`;
}

