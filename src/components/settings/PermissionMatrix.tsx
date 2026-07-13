import { useAuth } from "@/context/AuthContext"
import { getRoleDefaults } from "@/lib/permissions"
import { PermissionKey, User } from "@/types"

const GROUPS: { label: string; keys: PermissionKey[] }[] = [
  { label: "Tableau de bord", keys: ["dashboard.view", "dashboard.viewFinancials"] },
  { label: "Commandes", keys: ["orders.view", "orders.create", "orders.edit", "orders.delete"] },
  { label: "Projets", keys: ["projets.view", "projets.create", "projets.edit", "projets.delete"] },
  { label: "Clients", keys: ["clients.view", "clients.edit"] },
  { label: "Calendrier", keys: ["calendar.view"] },
  { label: "Équipe", keys: ["team.view", "team.edit"] },
  { label: "Dépenses", keys: ["expenses.view", "expenses.edit"] },
  { label: "Revenus", keys: ["incomes.view", "incomes.edit"] },
  { label: "Analytique", keys: ["analytics.view"] },
  { label: "Accès outils", keys: ["toolAccess.view", "toolAccess.edit"] },
  { label: "Journal d'audit", keys: ["auditLog.view"] },
  { label: "Corbeille", keys: ["trash.view", "trash.restore"] },
  { label: "Académie", keys: ["academy.view", "academy.edit"] },
  { label: "Paramètres", keys: ["settings.view", "settings.manageUsers", "settings.managePermissions"] },
]

const KEY_LABELS: Partial<Record<PermissionKey, string>> = {
  "dashboard.view": "Voir",
  "dashboard.viewFinancials": "Voir finances",
  "orders.view": "Voir",
  "orders.create": "Créer",
  "orders.edit": "Modifier",
  "orders.delete": "Supprimer",
  "projets.view": "Voir",
  "projets.create": "Créer",
  "projets.edit": "Modifier",
  "projets.delete": "Supprimer",
  "clients.view": "Voir",
  "clients.edit": "Modifier",
  "calendar.view": "Voir",
  "team.view": "Voir",
  "team.edit": "Modifier",
  "expenses.view": "Voir",
  "expenses.edit": "Modifier",
  "incomes.view": "Voir",
  "incomes.edit": "Modifier",
  "analytics.view": "Voir",
  "toolAccess.view": "Voir",
  "toolAccess.edit": "Modifier",
  "auditLog.view": "Voir",
  "trash.view": "Voir",
  "trash.restore": "Restaurer",
  "academy.view": "Voir",
  "academy.edit": "Modifier",
  "settings.view": "Voir",
  "settings.manageUsers": "Gérer utilisateurs",
  "settings.managePermissions": "Gérer permissions",
}

export function PermissionMatrix({ user }: { user: User }) {
  const { updateUser } = useAuth()
  const roleDefaults = getRoleDefaults(user.role)

  function isEnabled(key: PermissionKey) {
    return user.permissionOverrides?.[key] ?? roleDefaults[key] ?? false
  }

  function toggle(key: PermissionKey) {
    const next = { ...(user.permissionOverrides ?? {}), [key]: !isEnabled(key) }
    updateUser(user.id, { permissionOverrides: next })
  }

  return (
    <div className="space-y-4">
      {GROUPS.map((group) => (
        <div key={group.label}>
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{group.label}</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {group.keys.map((key) => (
              <label key={key} className="flex items-center gap-1.5 text-sm">
                <input type="checkbox" className="h-3.5 w-3.5" checked={isEnabled(key)} onChange={() => toggle(key)} />
                {KEY_LABELS[key] ?? key}
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
