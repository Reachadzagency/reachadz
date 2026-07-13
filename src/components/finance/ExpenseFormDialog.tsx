import { useState } from "react"
import { Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { SelectNative } from "@/components/ui/select-native"
import { useFinance } from "@/context/FinanceContext"
import { useAuth } from "@/context/AuthContext"
import { ExpenseCategory } from "@/types"

const CATEGORIES: { value: ExpenseCategory; label: string }[] = [
  { value: "salaries", label: "Salaires" },
  { value: "freelancers", label: "Freelances" },
  { value: "ads_spend", label: "Dépenses publicitaires" },
  { value: "tools_subscriptions", label: "Outils / abonnements" },
  { value: "office", label: "Bureau" },
  { value: "other", label: "Autre" },
]

export function ExpenseFormDialog() {
  const [open, setOpen] = useState(false)
  const { expenses } = useFinance()
  const { currentUser } = useAuth()
  const [form, setForm] = useState({
    category: "other" as ExpenseCategory,
    amount: 0,
    date: new Date().toISOString().slice(0, 10),
    notes: "",
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    expenses.add({
      category: form.category,
      amount: Number(form.amount) || 0,
      date: new Date(form.date).toISOString(),
      notes: form.notes,
      createdAt: new Date().toISOString(),
      createdBy: currentUser?.id ?? "system",
    })
    setOpen(false)
    setForm({ category: "other", amount: 0, date: new Date().toISOString().slice(0, 10), notes: "" })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4" /> Nouvelle dépense
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nouvelle dépense</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Catégorie</Label>
            <SelectNative value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as ExpenseCategory }))}>
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </SelectNative>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Montant (MAD)</Label>
              <Input type="number" min={0} value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: Number(e.target.value) }))} required />
            </div>
            <div className="space-y-1.5">
              <Label>Date</Label>
              <Input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} required />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Notes</Label>
            <Textarea value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit">Ajouter</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export { CATEGORIES as EXPENSE_CATEGORIES }
