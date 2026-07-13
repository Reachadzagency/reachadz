import { Trash2 } from "lucide-react"
import { useFinance } from "@/context/FinanceContext"
import { useOrders } from "@/context/OrdersContext"
import { useProjets } from "@/context/ProjetsContext"
import { Card } from "@/components/ui/card"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { IncomeFormDialog } from "@/components/finance/IncomeFormDialog"
import { formatDate, formatMAD } from "@/lib/utils"

export default function IncomesPage() {
  const { incomes } = useFinance()
  const { items: orders } = useOrders()
  const { items: projets } = useProjets()
  const total = incomes.active.reduce((s, i) => s + i.amount, 0)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Revenus</h1>
          <p className="text-sm text-muted-foreground">Total : {formatMAD(total)}</p>
        </div>
        <IncomeFormDialog />
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Lié à</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {incomes.active
              .slice()
              .sort((a, b) => b.date.localeCompare(a.date))
              .map((i) => {
                const linkedOrder = orders.find((o) => o.id === i.orderId)
                const linkedProjet = projets.find((p) => p.id === i.projetId)
                return (
                  <TableRow key={i.id}>
                    <TableCell>{formatDate(i.date)}</TableCell>
                    <TableCell>{i.clientName}</TableCell>
                    <TableCell>{linkedOrder?.orderNumber ?? linkedProjet?.reference ?? "—"}</TableCell>
                    <TableCell className="font-medium text-success">{formatMAD(i.amount)}</TableCell>
                    <TableCell className="max-w-[250px] truncate text-muted-foreground">{i.notes}</TableCell>
                    <TableCell>
                      <Button size="icon" variant="ghost" onClick={() => incomes.softDelete(i.id)}>
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            {incomes.active.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                  Aucun revenu enregistré.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
