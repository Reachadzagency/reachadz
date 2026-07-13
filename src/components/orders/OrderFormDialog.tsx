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
import { useOrders } from "@/context/OrdersContext"
import { useClients } from "@/context/ClientsContext"
import { useTeam } from "@/context/TeamContext"
import { useAuth } from "@/context/AuthContext"
import { Order, OrderVideo, ORDER_STATUSES } from "@/types"
import { generateId } from "@/lib/utils"

interface OrderFormDialogProps {
  order?: Order
  trigger?: React.ReactNode
}

export function OrderFormDialog({ order, trigger }: OrderFormDialogProps) {
  const [open, setOpen] = useState(false)
  const { createOrder, update, nextOrderNumber } = useOrders()
  const { active: clients, add: addClient } = useClients()
  const { active: team } = useTeam()
  const { currentUser } = useAuth()

  const editors = team.filter((t) => t.function === "editor")
  const filmmakers = team.filter((t) => t.function === "filmmaker")

  const [isNewClient, setIsNewClient] = useState(false)
  const [form, setForm] = useState(() => getInitialForm(order))

  useEffect(() => {
    if (open) setForm(getInitialForm(order))
  }, [open, order])

  function getInitialForm(o?: Order) {
    return {
      clientId: o?.clientId ?? clients[0]?.id ?? "",
      newClientName: "",
      phone: o?.phone ?? "",
      city: o?.city ?? "",
      projetLabel: o?.projetLabel ?? "",
      numberOfVideos: o?.numberOfVideos ?? 1,
      pricePerVideo: o?.pricePerVideo ?? 0,
      scriptToValidate: o?.scriptToValidate ?? "",
      filmmakerId: o?.filmmakerId ?? "",
      editorId: o?.editorId ?? "",
      maxDeliveryDate: o?.maxDeliveryDate?.slice(0, 10) ?? "",
      status: o?.status ?? "new_order",
    }
  }

  function handleClientChange(clientId: string) {
    const client = clients.find((c) => c.id === clientId)
    setForm((f) => ({ ...f, clientId, phone: client?.phone ?? f.phone, city: client?.city ?? f.city }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    let clientId = form.clientId
    let clientName = clients.find((c) => c.id === clientId)?.name ?? ""

    if (isNewClient) {
      const created = addClient({
        name: form.newClientName,
        phone: form.phone,
        city: form.city,
        createdAt: new Date().toISOString(),
      })
      clientId = created.id
      clientName = created.name
    }

    const numberOfVideos = Number(form.numberOfVideos) || 1

    let videos: OrderVideo[]
    if (order) {
      // keep existing videos, add/remove to match new count
      videos = [...order.videos]
      while (videos.length < numberOfVideos) {
        videos.push({ id: generateId("vid"), index: videos.length + 1, status: "new_order", editorId: form.editorId || undefined })
      }
      videos = videos.slice(0, numberOfVideos)
    } else {
      videos = Array.from({ length: numberOfVideos }).map((_, i) => ({
        id: generateId("vid"),
        index: i + 1,
        status: "new_order" as const,
        editorId: form.editorId || undefined,
      }))
    }

    const payload = {
      orderNumber: order?.orderNumber ?? nextOrderNumber(),
      clientId,
      clientName,
      phone: form.phone,
      city: form.city,
      projetLabel: form.projetLabel,
      numberOfVideos,
      pricePerVideo: Number(form.pricePerVideo) || 0,
      scriptToValidate: form.scriptToValidate,
      scriptValidated: order?.scriptValidated ?? false,
      filmmakerId: form.filmmakerId || undefined,
      editorId: form.editorId || undefined,
      status: form.status as Order["status"],
      maxDeliveryDate: form.maxDeliveryDate ? new Date(form.maxDeliveryDate).toISOString() : new Date().toISOString(),
      videos,
      createdBy: order?.createdBy ?? currentUser?.id ?? "system",
    }

    if (order) {
      update(order.id, { ...payload, updatedAt: new Date().toISOString() })
    } else {
      createOrder(payload)
    }
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button size="sm">
            <Plus className="h-4 w-4" /> Nouvelle commande
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{order ? "Modifier la commande" : "Nouvelle commande"}</DialogTitle>
          <DialogDescription>
            {order ? order.orderNumber : "Un numéro de commande sera généré automatiquement."}
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
                <SelectNative
                  value={form.clientId}
                  onChange={(e) => handleClientChange(e.target.value)}
                  required
                >
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
              <Label>Téléphone</Label>
              <Input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} required />
            </div>
            <div className="space-y-1.5">
              <Label>Ville</Label>
              <Input value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} required />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label>Projet</Label>
              <Input
                placeholder="Ex: Vidéos UGC produits"
                value={form.projetLabel}
                onChange={(e) => setForm((f) => ({ ...f, projetLabel: e.target.value }))}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Nombre de vidéos</Label>
              <Input
                type="number"
                min={1}
                value={form.numberOfVideos}
                onChange={(e) => setForm((f) => ({ ...f, numberOfVideos: Number(e.target.value) }))}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>Prix par vidéo (MAD)</Label>
              <Input
                type="number"
                min={0}
                value={form.pricePerVideo}
                onChange={(e) => setForm((f) => ({ ...f, pricePerVideo: Number(e.target.value) }))}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label>Cadreur / Filmmaker</Label>
              <SelectNative
                value={form.filmmakerId}
                onChange={(e) => setForm((f) => ({ ...f, filmmakerId: e.target.value }))}
              >
                <option value="">— Aucun —</option>
                {filmmakers.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.fullName}
                  </option>
                ))}
              </SelectNative>
            </div>
            <div className="space-y-1.5">
              <Label>Éditeur assigné</Label>
              <SelectNative value={form.editorId} onChange={(e) => setForm((f) => ({ ...f, editorId: e.target.value }))}>
                <option value="">— Aucun —</option>
                {editors.map((ed) => (
                  <option key={ed.id} value={ed.id}>
                    {ed.fullName}
                  </option>
                ))}
              </SelectNative>
            </div>

            <div className="space-y-1.5">
              <Label>Date limite de livraison</Label>
              <Input
                type="date"
                value={form.maxDeliveryDate}
                onChange={(e) => setForm((f) => ({ ...f, maxDeliveryDate: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>Statut</Label>
              <SelectNative value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}>
                {ORDER_STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </SelectNative>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label>Script à valider</Label>
              <Textarea
                placeholder="Collez le texte du script ou un lien vers le document"
                value={form.scriptToValidate}
                onChange={(e) => setForm((f) => ({ ...f, scriptToValidate: e.target.value }))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit">{order ? "Enregistrer" : "Créer la commande"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
