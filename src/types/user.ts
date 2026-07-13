export type Role = "admin" | "manager" | "team_leader" | "editor"

/** Every distinct action/page a user could be allowed to do or see. */
export type PermissionKey =
  | "dashboard.view"
  | "dashboard.viewFinancials"
  | "orders.view"
  | "orders.create"
  | "orders.edit"
  | "orders.delete"
  | "projets.view"
  | "projets.create"
  | "projets.edit"
  | "projets.delete"
  | "clients.view"
  | "clients.edit"
  | "calendar.view"
  | "team.view"
  | "team.edit"
  | "expenses.view"
  | "expenses.edit"
  | "incomes.view"
  | "incomes.edit"
  | "analytics.view"
  | "toolAccess.view"
  | "toolAccess.edit"
  | "auditLog.view"
  | "trash.view"
  | "trash.restore"
  | "academy.view"
  | "academy.edit"
  | "settings.view"
  | "settings.manageUsers"
  | "settings.managePermissions"

export interface User {
  id: string
  fullName: string
  email: string
  /** Never store real passwords like this in production. MVP only — see lib/storage.ts note. */
  password: string
  role: Role
  avatarUrl?: string
  /** Per-user overrides layered on top of the role's default permissions. */
  permissionOverrides?: Partial<Record<PermissionKey, boolean>>
  active: boolean
  createdAt: string
}
