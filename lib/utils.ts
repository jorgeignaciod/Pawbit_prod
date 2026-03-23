import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAgeLabel(birthDate: string) {
  const today = new Date();
  const birth = new Date(birthDate);
  const monthDiff =
    (today.getFullYear() - birth.getFullYear()) * 12 +
    (today.getMonth() - birth.getMonth());

  if (monthDiff < 12) {
    return `${Math.max(monthDiff, 1)} meses`;
  }

  const years = Math.floor(monthDiff / 12);
  return `${years} ${years === 1 ? "año" : "años"}`;
}

export function getInitials(value: string) {
  return value
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function delay(ms = 500) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
