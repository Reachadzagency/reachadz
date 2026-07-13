import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import { useToolAccess } from "@/context/ToolAccessContext"
import { useTeam } from "@/context/TeamContext"
import { useAuth } from "@/context/AuthContext"
import { Card } from "@/components/ui/card"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SelectNative } from "@/components/ui/select-native"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { formatDate } from "@/lib/utils"

export default function ToolAccessPage() {
  const { active: entries, add, softDelete } = useToolAccess()
  const { active: team } = useTeam()
  const { can } = useAuth()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ toolName: "", memberId: "", note: "" })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const member = team.find((t) => t.id === form.memberId)
    add({
      toolName: form.toolName,
      memberId: form.memberId,
      memberName: member?.fullName ?? "",
      note: form.note,
      createdAt: new Date().toISOString(),
    })
    setOpen(false)
    setForm({ toolName: "", memberId: "", note: "" })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Accès outils</h1>
          <p className="text-sm text-muted-foreground">Qui a accès à quels outils / comptes de l'agence.</p>
        </div>
        {can("toolAccess.edit") && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4" /> Ajouter un accès
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nouvel accès outil</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Outil / Compte</Label>
                  <Input
                    placeholder="Ex: Canva, Meta Business, Google Drive..."
                    value={form.toolName}
                    onChange={(e) => setForm((f) => ({ ...f, toolName: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Membre de l'équipe</Label>
                  <SelectNative value={form.memberId} onChange={(e) => setForm((f) => ({ ...f, memberId: e.target.value }))} required>
                    <option value="" disabled>
                      Sélectionner un membre
                    </option>
                    {team.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.fullName}
                      </option>
                    ))}
                  </SelectNative>
                </div>
                <div className="space-y-1.5">
                  <Label>Note</Label>
                  <Input value={form.note} onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))} />
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
        )}
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Outil</TableHead>
              <TableHead>Membre</TableHead>
              <TableHead>Note</TableHead>
              <TableHead>Depuis</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((e) => (
              <TableRow key={e.id}>
                <TableCell className="font-medium">{e.toolName}</TableCell>
                <TableCell>{e.memberName}</TableCell>
                <TableCell className="text-muted-foreground">{e.note}</TableCell>
                <TableCell>{formatDate(e.createdAt)}</TableCell>
                <TableCell>
                  {can("toolAccess.edit") && (
                    <Button size="icon" variant="ghost" onClick={() => softDelete(e.id)}>
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {entries.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                  Aucun accès enregistré.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
