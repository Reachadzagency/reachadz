import { useAuditLog } from "@/context/AuditLogContext"
import { Card } from "@/components/ui/card"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { formatDateTime } from "@/lib/utils"

export default function AuditLogPage() {
  const { entries } = useAuditLog()

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Journal d'audit</h1>
        <p className="text-sm text-muted-foreground">Historique de toutes les actions effectuées dans le CRM.</p>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Utilisateur</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Détails</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((e) => (
              <TableRow key={e.id}>
                <TableCell>{formatDateTime(e.createdAt)}</TableCell>
                <TableCell className="font-medium">{e.userName}</TableCell>
                <TableCell>{e.action}</TableCell>
                <TableCell className="text-muted-foreground">{e.entityType}</TableCell>
                <TableCell className="max-w-[280px] truncate text-muted-foreground">{e.details}</TableCell>
              </TableRow>
            ))}
            {entries.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                  Aucune activité enregistrée pour l'instant.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
