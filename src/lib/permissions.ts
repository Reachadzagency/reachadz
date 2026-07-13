import { PermissionKey, Role, User } from "@/types"

/**
 * Default permissions per role. This is the baseline every user starts
 * from. Individual users can then have specific permissions turned on/off
 * via `user.permissionOverrides` from the Settings > Users screen — that's
 * the "fully custom permission matrix" you asked for, layered on top of
 * these sane role defaults so you're never starting from a blank slate.
 */
const ROLE_DEFAULTS: Record<Role, Partial<Record<PermissionKey, boolean>>> = {
  admin: {
    "dashboard.view": true,
    "dashboard.viewFinancials": true,
    "orders.view": true,
    "orders.create": true,
    "orders.edit": true,
    "orders.delete": true,
    "projets.view": true,
    "projets.create": true,
    "projets.edit": true,
    "projets.delete": true,
    "clients.view": true,
    "clients.edit": true,
    "calendar.view": true,
    "team.view": true,
    "team.edit": true,
    "expenses.view": true,
    "expenses.edit": true,
    "incomes.view": true,
    "incomes.edit": true,
    "analytics.view": true,
    "toolAccess.view": true,
    "toolAccess.edit": true,
    "auditLog.view": true,
    "trash.view": true,
    "trash.restore": true,
    "academy.view": true,
    "academy.edit": true,
    "settings.view": true,
    "settings.manageUsers": true,
    "settings.managePermissions": true,
  },
  manager: {
    "dashboard.view": true,
    "dashboard.viewFinancials": true,
    "orders.view": true,
    "orders.create": true,
    "orders.edit": true,
    "orders.delete": true,
    "projets.view": true,
    "projets.create": true,
    "projets.edit": true,
    "projets.delete": true,
    "clients.view": true,
    "clients.edit": true,
    "calendar.view": true,
    "team.view": true,
    "team.edit": true,
    "expenses.view": true,
    "expenses.edit": true,
    "incomes.view": true,
    "incomes.edit": true,
    "analytics.view": true,
    "toolAccess.view": true,
    "toolAccess.edit": true,
    "auditLog.view": true,
    "trash.view": true,
    "trash.restore": true,
    "academy.view": true,
    "academy.edit": true,
    "settings.view": false,
    "settings.manageUsers": false,
    "settings.managePermissions": false,
  },
  team_leader: {
    "dashboard.view": true,
    "dashboard.viewFinancials": false,
    "orders.view": true,
    "orders.create": true,
    "orders.edit": true,
    "orders.delete": false,
    "projets.view": true,
    "projets.create": true,
    "projets.edit": true,
    "projets.delete": false,
    "clients.view": true,
    "clients.edit": false,
    "calendar.view": true,
    "team.view": true,
    "team.edit": false,
    "expenses.view": false,
    "expenses.edit": false,
    "incomes.view": false,
    "incomes.edit": false,
    "analytics.view": false,
    "toolAccess.view": false,
    "toolAccess.edit": false,
    "auditLog.view": false,
    "trash.view": false,
    "trash.restore": false,
    "academy.view": true,
    "academy.edit": false,
    "settings.view": false,
    "settings.manageUsers": false,
    "settings.managePermissions": false,
  },
  editor: {
    "dashboard.view": false,
    "dashboard.viewFinancials": false,
    "orders.view": true, // will still be filtered to "my assigned videos only" in the Orders page
    "orders.create": false,
    "orders.edit": false,
    "orders.delete": false,
    "projets.view": false,
    "projets.create": false,
    "projets.edit": false,
    "projets.delete": false,
    "clients.view": false,
    "clients.edit": false,
    "calendar.view": true,
    "team.view": false,
    "team.edit": false,
    "expenses.view": false,
    "expenses.edit": false,
    "incomes.view": false,
    "incomes.edit": false,
    "analytics.view": false,
    "toolAccess.view": false,
    "toolAccess.edit": false,
    "auditLog.view": false,
    "trash.view": false,
    "trash.restore": false,
    "academy.view": true,
    "academy.edit": false,
    "settings.view": false,
    "settings.manageUsers": false,
    "settings.managePermissions": false,
  },
}

/** True/false for a single permission, respecting per-user overrides. */
export function can(user: User | null | undefined, key: PermissionKey): boolean {
  if (!user) return false
  const override = user.permissionOverrides?.[key]
  if (override !== undefined) return override
  return ROLE_DEFAULTS[user.role]?.[key] ?? false
}

/** Full resolved permission map for a user (role defaults + their overrides). */
export function resolvePermissions(user: User): Record<PermissionKey, boolean> {
  const base = ROLE_DEFAULTS[user.role]
  return { ...base, ...user.permissionOverrides } as Record<PermissionKey, boolean>
}

export function getRoleDefaults(role: Role) {
  return ROLE_DEFAULTS[role]
}

export const ROLE_LABELS: Record<Role, string> = {
  admin: "Administrateur",
  manager: "Manager",
  team_leader: "Chef d'équipe",
  editor: "Éditeur",
}
