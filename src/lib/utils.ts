import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/** Merge Tailwind classes safely (used by every shadcn/ui component). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Format a number as Moroccan Dirham currency, e.g. 12 400,00 MAD */
export function formatMAD(amount: number): string {
  return (
    new Intl.NumberFormat("fr-MA", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount) + " MAD"
  )
}

/** Format a date as DD/MM/YYYY */
export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d)
}

/** Format a date + time as DD/MM/YYYY HH:mm */
export function formatDateTime(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d)
}

export function generateId(prefix = ""): string {
  const id = Math.random().toString(36).slice(2, 10)
  return prefix ? `${prefix}-${id}` : id
}
