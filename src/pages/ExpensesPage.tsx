import { Trash2 } from "lucide-react"
import { useFinance } from "@/context/FinanceContext"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ExpenseFormDialog, EXPENSE_CATEGORIES } from "@/components/finance/ExpenseFormDialog"
import { formatDate, formatMAD } from "@/lib/utils"

export default function ExpensesPage() {
  const { expenses } = useFinance()
  const total = expenses.active.reduce((s, e) => s + e.amount, 0)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dépenses</h1>
          <p className="text-sm text-muted-foreground">Total : {formatMAD(total)}</p>
        </div>
        <ExpenseFormDialog />
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.active
              .slice()
              .sort((a, b) => b.date.localeCompare(a.date))
              .map((e) => (
                <TableRow key={e.id}>
                  <TableCell>{formatDate(e.date)}</TableCell>
                  <TableCell>{EXPENSE_CATEGORIES.find((c) => c.value === e.category)?.label}</TableCell>
                  <TableCell className="font-medium text-destructive">{formatMAD(e.amount)}</TableCell>
                  <TableCell className="max-w-[300px] truncate text-muted-foreground">{e.notes}</TableCell>
                  <TableCell>
                    <Button size="icon" variant="ghost" onClick={() => expenses.softDelete(e.id)}>
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            {expenses.active.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                  Aucune dépense enregistrée.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
