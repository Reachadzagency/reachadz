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
import { Textarea } from "@/components/ui/textarea"
import { useClients } from "@/context/ClientsContext"
import { Client } from "@/types"

export function ClientFormDialog({ client, trigger }: { client?: Client; trigger?: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const { add, update } = useClients()
  const [form, setForm] = useState({
    name: client?.name ?? "",
    phone: client?.phone ?? "",
    city: client?.city ?? "",
    email: client?.email ?? "",
    notes: client?.notes ?? "",
  })

  useEffect(() => {
    if (open) {
      setForm({
        name: client?.name ?? "",
        phone: client?.phone ?? "",
        city: client?.city ?? "",
        email: client?.email ?? "",
        notes: client?.notes ?? "",
      })
    }
  }, [open, client])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (client) {
      update(client.id, form)
    } else {
      add({ ...form, createdAt: new Date().toISOString() })
    }
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button size="sm">
            <Plus className="h-4 w-4" /> Nouveau client
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{client ? "Modifier le client" : "Nouveau client"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Nom</Label>
            <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Téléphone</Label>
              <Input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} required />
            </div>
            <div className="space-y-1.5">
              <Label>Ville</Label>
              <Input value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} required />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
          </div>
          <div className="space-y-1.5">
            <Label>Notes</Label>
            <Textarea value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit">{client ? "Enregistrer" : "Créer le client"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
