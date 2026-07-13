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
import { useAuth } from "@/context/AuthContext"
import { ROLE_LABELS } from "@/lib/permissions"
import { Role, User } from "@/types"

export function UserFormDialog({ user, trigger }: { user?: User; trigger?: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const { addUser, updateUser } = useAuth()
  const [form, setForm] = useState(() => getInitial(user))

  useEffect(() => {
    if (open) setForm(getInitial(user))
  }, [open, user])

  function getInitial(u?: User) {
    return {
      fullName: u?.fullName ?? "",
      email: u?.email ?? "",
      password: u?.password ?? "",
      role: (u?.role ?? "editor") as Role,
      active: u?.active ?? true,
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (user) {
      updateUser(user.id, form)
    } else {
      addUser(form)
    }
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button size="sm">
            <Plus className="h-4 w-4" /> Nouvel utilisateur
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{user ? "Modifier l'utilisateur" : "Nouvel utilisateur"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Nom complet</Label>
            <Input value={form.fullName} onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))} required />
          </div>
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required />
          </div>
          <div className="space-y-1.5">
            <Label>Mot de passe</Label>
            <Input
              type="text"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label>Rôle</Label>
            <SelectNative value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as Role }))}>
              {Object.entries(ROLE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </SelectNative>
          </div>
          <div className="flex items-center gap-2">
            <input
              id="user-active"
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
              className="h-4 w-4"
            />
            <Label htmlFor="user-active" className="!m-0">
              Compte actif
            </Label>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit">{user ? "Enregistrer" : "Créer"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
