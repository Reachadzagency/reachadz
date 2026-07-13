import { useEffect, useState } from "react"
import { Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { SelectNative } from "@/components/ui/select-native"
import { useProjets } from "@/context/ProjetsContext"
import { useClients } from "@/context/ClientsContext"
import { useTeam } from "@/context/TeamContext"
import { useAuth } from "@/context/AuthContext"
import { Projet, PROJET_STATUSES, PROJET_TYPES } from "@/types"

interface ProjetFormDialogProps {
  projet?: Projet
  trigger?: React.ReactNode
}

export function ProjetFormDialog({ projet, trigger }: ProjetFormDialogProps) {
  const [open, setOpen] = useState(false)
  const { createProjet, update, nextReference } = useProjets()
  const { active: clients, add: addClient } = useClients()
  const { active: team } = useTeam()
  const { currentUser } = useAuth()

  const managers = team.filter((t) => t.function === "manager")
  const designers = team.filter((t) => t.function === "designer")
  const mediaBuyers = team.filter((t) => t.function === "media_buyer")

  const [isNewClient, setIsNewClient] = useState(false)
  const [form, setForm] = useState(() => getInitialForm(projet))

  useEffect(() => {
    if (open) setForm(getInitialForm(projet))
  }, [open, projet])

  function getInitialForm(p?: Projet) {
    return {
      clientId: p?.clientId ?? clients[0]?.id ?? "",
      newClientName: "",
      type: p?.type ?? "ads",
      status: p?.status ?? "new",
      managerId: p?.managerId ?? "",
      designerId: p?.designerId ?? "",
      mediaBuyerId: p?.mediaBuyerId ?? "",
      price: p?.price ?? 0,
      startDate: p?.startDate?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
      dueDate: p?.dueDate?.slice(0, 10) ?? "",
      description: p?.description ?? "",
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    let clientId = form.clientId
    let clientName = clients.find((c) => c.id === clientId)?.name ?? ""

    if (isNewClient) {
      const created = addClient({ name: form.newClientName, phone: "", city: "", createdAt: new Date().toISOString() })
      clientId = created.id
      clientName = created.name
    }

    const payload = {
      reference: projet?.reference ?? nextReference(),
      clientId,
      clientName,
      type: form.type as Projet["type"],
      status: form.status as Projet["status"],
      managerId: form.managerId || undefined,
      designerId: form.designerId || undefined,
      mediaBuyerId: form.mediaBuyerId || undefined,
      price: Number(form.price) || 0,
      startDate: new Date(form.startDate).toISOString(),
      dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : new Date().toISOString(),
      description: form.description,
      createdBy: projet?.createdBy ?? currentUser?.id ?? "system",
    }

    if (projet) {
      update(projet.id, { ...payload, updatedAt: new Date().toISOString() })
    } else {
      createProjet(payload)
    }
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button size="sm">
            <Plus className="h-4 w-4" /> Nouveau projet
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{projet ? "Modifier le projet" : "Nouveau projet"}</DialogTitle>
          <DialogDescription>
            {projet ? projet.reference : "Une référence sera générée automatiquement."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <div className="flex items-center justify-between">
                <Label>Client</Label>
                <button
                  type="button"
                  className="text-xs text-primary hover:underline"
                  onClick={() => setIsNewClient((v) => !v)}
                >
                  {isNewClient ? "Choisir un client existant" : "+ Nouveau client"}
                </button>
              </div>
              {isNewClient ? (
                <Input
                  placeholder="Nom du client"
                  value={form.newClientName}
                  onChange={(e) => setForm((f) => ({ ...f, newClientName: e.target.value }))}
                  required
                />
              ) : (
                <SelectNative value={form.clientId} onChange={(e) => setForm((f) => ({ ...f, clientId: e.target.value }))} required>
                  <option value="" disabled>
                    Sélectionner un client
                  </option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </SelectNative>
              )}
            </div>

            <div className="space-y-1.5">
              <Label>Type de projet</Label>
              <SelectNative value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}>
                {PROJET_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </SelectNative>
            </div>
            <div className="space-y-1.5">
              <Label>Statut</Label>
              <SelectNative value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}>
                {PROJET_STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </SelectNative>
            </div>

            <div className="space-y-1.5">
              <Label>Manager</Label>
              <SelectNative value={form.managerId} onChange={(e) => setForm((f) => ({ ...f, managerId: e.target.value }))}>
                <option value="">— Aucun —</option>
                {managers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.fullName}
                  </option>
                ))}
              </SelectNative>
            </div>
            <div className="space-y-1.5">
              <Label>Designer</Label>
              <SelectNative value={form.designerId} onChange={(e) => setForm((f) => ({ ...f, designerId: e.target.value }))}>
                <option value="">— Aucun —</option>
                {designers.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.fullName}
                  </option>
                ))}
              </SelectNative>
            </div>
            <div className="space-y-1.5">
              <Label>Media Buyer</Label>
              <SelectNative value={form.mediaBuyerId} onChange={(e) => setForm((f) => ({ ...f, mediaBuyerId: e.target.value }))}>
                <option value="">— Aucun —</option>
                {mediaBuyers.map((mb) => (
                  <option key={mb.id} value={mb.id}>
                    {mb.fullName}
                  </option>
                ))}
              </SelectNative>
            </div>
            <div className="space-y-1.5">
              <Label>Prix (MAD)</Label>
              <Input
                type="number"
                min={0}
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label>Date de début</Label>
              <Input type="date" value={form.startDate} onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))} required />
            </div>
            <div className="space-y-1.5">
              <Label>Date d'échéance</Label>
              <Input type="date" value={form.dueDate} onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))} required />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Détails du projet..."
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit">{projet ? "Enregistrer" : "Créer le projet"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
