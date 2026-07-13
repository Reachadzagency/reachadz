/**
 * Local persistence layer.
 *
 * Every context in /src/context reads and writes through THIS file only —
 * never touches localStorage directly. That means when we move to a real
 * backend (Supabase or Node/Express + PostgreSQL), we only rewrite the
 * functions in here (and turn them into async API calls); no page or
 * component needs to change.
 */

const STORAGE_PREFIX = "agency-crm:"

export function loadCollection<T>(key: string, fallback: T[]): T[] {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key)
    if (!raw) return fallback
    return JSON.parse(raw) as T[]
  } catch {
    return fallback
  }
}

export function saveCollection<T>(key: string, data: T[]): void {
  localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data))
}

export function loadValue<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function saveValue<T>(key: string, value: T): void {
  localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value))
}

export function clearAll(): void {
  Object.keys(localStorage)
    .filter((k) => k.startsWith(STORAGE_PREFIX))
    .forEach((k) => localStorage.removeItem(k))
}

export const STORAGE_KEYS = {
  users: "users",
  currentUserId: "currentUserId",
  orders: "orders",
  projets: "projets",
  clients: "clients",
  teamMembers: "teamMembers",
  expenses: "expenses",
  incomes: "incomes",
  notifications: "notifications",
  auditLog: "auditLog",
  theme: "theme",
  agencySettings: "agencySettings",
  toolAccess: "toolAccess",
  academyLessons: "academyLessons",
} as const
