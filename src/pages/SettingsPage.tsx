import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useAgencySettings } from "@/context/AgencySettingsContext"
import { useAuth } from "@/context/AuthContext"
import { ROLE_LABELS } from "@/lib/permissions"
import { UserFormDialog } from "@/components/settings/UserFormDialog"
import { PermissionMatrix } from "@/components/settings/PermissionMatrix"

export default function SettingsPage() {
  const { settings, updateSettings } = useAgencySettings()
  const { users, currentUser, can } = useAuth()
  const [form, setForm] = useState(settings)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

  const canManageUsers = can("settings.manageUsers")
  const canManagePermissions = can("settings.managePermissions")
  const selectedUser = users.find((u) => u.id === selectedUserId)

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Paramètres</h1>
        <p className="text-sm text-muted-foreground">Agence, utilisateurs et permissions.</p>
      </div>

      <Tabs defaultValue="agency">
        <TabsList>
          <TabsTrigger value="agency">Agence</TabsTrigger>
          {canManageUsers && <TabsTrigger value="users">Utilisateurs</TabsTrigger>}
          {canManagePermissions && <TabsTrigger value="permissions">Permissions</TabsTrigger>}
        </TabsList>

        <TabsContent value="agency">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Identité de l'agence</CardTitle>
            </CardHeader>
            <CardContent className="max-w-md space-y-4">
              <div className="space-y-1.5">
                <Label>Nom de l'agence</Label>
                <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>URL du logo</Label>
                <Input
                  placeholder="https://..."
                  value={form.logoUrl ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, logoUrl: e.target.value }))}
                />
              </div>
              <Button onClick={() => updateSettings(form)}>Enregistrer</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {canManageUsers && (
          <TabsContent value="users">
            <Card>
              <CardHeader className="flex-row items-center justify-between space-y-0">
                <CardTitle className="text-base">Utilisateurs ({users.length})</CardTitle>
                <UserFormDialog />
              </CardHeader>
              <CardContent className="space-y-2">
                {users.map((u) => (
                  <div key={u.id} className="flex flex-wrap items-center justify-between gap-2 rounded-md border p-3">
                    <div>
                      <p className="font-medium">
                        {u.fullName} {u.id === currentUser?.id && <span className="text-xs text-muted-foreground">(vous)</span>}
                      </p>
                      <p className="text-xs text-muted-foreground">{u.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{ROLE_LABELS[u.role]}</Badge>
                      <Badge variant={u.active ? "success" : "destructive"}>{u.active ? "Actif" : "Désactivé"}</Badge>
                      <UserFormDialog user={u} trigger={<Button size="sm" variant="outline">Modifier</Button>} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {canManagePermissions && (
          <TabsContent value="permissions">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Permissions par utilisateur</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Chaque utilisateur part des permissions par défaut de son rôle. Cochez/décochez pour créer une
                  exception spécifique à cette personne.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="max-w-xs">
                  <Label>Utilisateur</Label>
                  <select
                    className="mt-1.5 flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                    value={selectedUserId ?? ""}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                  >
                    <option value="" disabled>
                      Sélectionner un utilisateur
                    </option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.fullName} ({ROLE_LABELS[u.role]})
                      </option>
                    ))}
                  </select>
                </div>
                {selectedUser && (
                  <div className="border-t pt-4">
                    <PermissionMatrix user={selectedUser} />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
