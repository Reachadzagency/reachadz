import { useEffect, useState } from "react"
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
import { SelectNative } from "@/components/ui/select-native"
import { useTeam } from "@/context/TeamContext"
import { PaymentType, TeamFunction, TeamMember } from "@/types"

interface TeamMemberFormDialogProps {
  function_: TeamFunction
  member?: TeamMember
  trigger?: React.ReactNode
}

export function TeamMemberFormDialog({ function_, member, trigger }: TeamMemberFormDialogProps) {
  const [open, setOpen] = useState(false)
  const { add, update } = useTeam()

  const [form, setForm] = useState(() => getInitial(member))

  useEffect(() => {
    if (open) setForm(getInitial(member))
  }, [open, member])

  function getInitial(m?: TeamMember) {
    return {
      fullName: m?.fullName ?? "",
      email: m?.email ?? "",
      phone: m?.phone ?? "",
      paymentType: (m?.paymentType ?? "freelancer") as PaymentType,
      rate: m?.rate ?? 0,
      monthlySalary: m?.monthlySalary ?? 0,
      active: m?.active ?? true,
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const payload = { ...form, function: function_ }
    if (member) {
      update(member.id, payload)
    } else {
      add({ ...payload, createdAt: new Date().toISOString() })
    }
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button size="sm">
            <Plus className="h-4 w-4" /> Ajouter
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{member ? "Modifier le membre" : "Nouveau membre de l'équipe"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Nom complet</Label>
            <Input value={form.fullName} onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required />
            </div>
            <div className="space-y-1.5">
              <Label>Téléphone</Label>
              <Input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Type de paiement</Label>
            <SelectNative
              value={form.paymentType}
              onChange={(e) => setForm((f) => ({ ...f, paymentType: e.target.value as PaymentType }))}
            >
              <option value="freelancer">Freelance (payé par vidéo/projet)</option>
              <option value="salary">Salarié (salaire mensuel fixe)</option>
              <option value="manager">Manager</option>
            </SelectNative>
          </div>
          {form.paymentType === "freelancer" ? (
            <div className="space-y-1.5">
              <Label>Taux par vidéo (MAD)</Label>
              <Input
                type="number"
                min={0}
                value={form.rate}
                onChange={(e) => setForm((f) => ({ ...f, rate: Number(e.target.value) }))}
              />
            </div>
          ) : (
            <div className="space-y-1.5">
              <Label>Salaire mensuel (MAD)</Label>
              <Input
                type="number"
                min={0}
                value={form.monthlySalary}
                onChange={(e) => setForm((f) => ({ ...f, monthlySalary: Number(e.target.value) }))}
              />
            </div>
          )}
          <div className="flex items-center gap-2">
            <input
              id="active"
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
              className="h-4 w-4"
            />
            <Label htmlFor="active" className="!m-0">
              Actif
            </Label>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit">{member ? "Enregistrer" : "Ajouter"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
