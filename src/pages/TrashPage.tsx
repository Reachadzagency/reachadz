import { RotateCcw, Trash2 } from "lucide-react"
import { useOrders } from "@/context/OrdersContext"
import { useProjets } from "@/context/ProjetsContext"
import { useClients } from "@/context/ClientsContext"
import { useTeam } from "@/context/TeamContext"
import { useAuth } from "@/context/AuthContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatDateTime } from "@/lib/utils"

interface TrashSectionProps {
  title: string
  rows: { id: string; label: string; deletedAt: string }[]
  onRestore: (id: string) => void
  onHardDelete: (id: string) => void
  canManage: boolean
}

function TrashSection({ title, rows, onRestore, onHardDelete, canManage }: TrashSectionProps) {
  if (rows.length === 0) return null
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          {title} ({rows.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {rows.map((r) => (
          <div key={r.id} className="flex items-center justify-between rounded-md border p-2.5 text-sm">
            <div>
              <p className="font-medium">{r.label}</p>
              <p className="text-xs text-muted-foreground">Supprimé le {formatDateTime(r.deletedAt)}</p>
            </div>
            {canManage && (
              <div className="flex gap-1">
                <Button size="sm" variant="outline" onClick={() => onRestore(r.id)}>
                  <RotateCcw className="h-3.5 w-3.5" /> Restaurer
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    if (confirm("Supprimer définitivement ? Cette action est irréversible.")) onHardDelete(r.id)
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5 text-destructive" />
                </Button>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default function TrashPage() {
  const orders = useOrders()
  const projets = useProjets()
  const clients = useClients()
  const team = useTeam()
  const { can } = useAuth()
  const canManage = can("trash.restore")

  const totalTrashed = orders.trashed.length + projets.trashed.length + clients.trashed.length + team.trashed.length

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Corbeille</h1>
        <p className="text-sm text-muted-foreground">
          {totalTrashed} élément(s) supprimé(s) — restauration manuelle uniquement, aucune suppression automatique.
        </p>
      </div>

      <TrashSection
        title="Commandes vidéos"
        rows={orders.trashed.map((o) => ({ id: o.id, label: `${o.orderNumber} — ${o.clientName}`, deletedAt: o.deletedAt! }))}
        onRestore={orders.restore}
        onHardDelete={orders.hardDelete}
        canManage={canManage}
      />
      <TrashSection
        title="Projets"
        rows={projets.trashed.map((p) => ({ id: p.id, label: `${p.reference} — ${p.clientName}`, deletedAt: p.deletedAt! }))}
        onRestore={projets.restore}
        onHardDelete={projets.hardDelete}
        canManage={canManage}
      />
      <TrashSection
        title="Clients"
        rows={clients.trashed.map((c) => ({ id: c.id, label: c.name, deletedAt: c.deletedAt! }))}
        onRestore={clients.restore}
        onHardDelete={clients.hardDelete}
        canManage={canManage}
      />
      <TrashSection
        title="Équipe"
        rows={team.trashed.map((t) => ({ id: t.id, label: t.fullName, deletedAt: t.deletedAt! }))}
        onRestore={team.restore}
        onHardDelete={team.hardDelete}
        canManage={canManage}
      />

      {totalTrashed === 0 && (
        <Card className="border-dashed">
          <CardContent className="py-16 text-center text-sm text-muted-foreground">
            La corbeille est vide.
          </CardContent>
        </Card>
      )}
    </div>
  )
}
