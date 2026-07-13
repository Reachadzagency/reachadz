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
import { useOrders } from "@/context/OrdersContext"
import { useProjets } from "@/context/ProjetsContext"
import { useAuth } from "@/context/AuthContext"

export function IncomeFormDialog() {
  const [open, setOpen] = useState(false)
  const { incomes } = useFinance()
  const { active: orders } = useOrders()
  const { active: projets } = useProjets()
  const { currentUser } = useAuth()
  const [form, setForm] = useState({
    amount: 0,
    date: new Date().toISOString().slice(0, 10),
    orderId: "",
    projetId: "",
    clientName: "",
    notes: "",
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    incomes.add({
      amount: Number(form.amount) || 0,
      date: new Date(form.date).toISOString(),
      orderId: form.orderId || undefined,
      projetId: form.projetId || undefined,
      clientName: form.clientName,
      notes: form.notes,
      createdAt: new Date().toISOString(),
      createdBy: currentUser?.id ?? "system",
    })
    setOpen(false)
    setForm({ amount: 0, date: new Date().toISOString().slice(0, 10), orderId: "", projetId: "", clientName: "", notes: "" })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4" /> Nouveau revenu
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nouveau revenu</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Client</Label>
            <Input value={form.clientName} onChange={(e) => setForm((f) => ({ ...f, clientName: e.target.value }))} required />
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
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Commande liée (optionnel)</Label>
              <SelectNative value={form.orderId} onChange={(e) => setForm((f) => ({ ...f, orderId: e.target.value }))}>
                <option value="">— Aucune —</option>
                {orders.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.orderNumber}
                  </option>
                ))}
              </SelectNative>
            </div>
            <div className="space-y-1.5">
              <Label>Projet lié (optionnel)</Label>
              <SelectNative value={form.projetId} onChange={(e) => setForm((f) => ({ ...f, projetId: e.target.value }))}>
                <option value="">— Aucun —</option>
                {projets.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.reference}
                  </option>
                ))}
              </SelectNative>
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
