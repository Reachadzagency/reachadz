import { useState } from "react"
import { GraduationCap, Plus, Trash2, PlayCircle } from "lucide-react"
import { useAcademy } from "@/context/AcademyContext"
import { useAuth } from "@/context/AuthContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function AcademyPage() {
  const { active: lessons, add, softDelete } = useAcademy()
  const { can } = useAuth()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ title: "", videoUrl: "", description: "", category: "" })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    add({ ...form, createdAt: new Date().toISOString() })
    setOpen(false)
    setForm({ title: "", videoUrl: "", description: "", category: "" })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Académie</h1>
          <p className="text-sm text-muted-foreground">Formations internes pour l'équipe.</p>
        </div>
        {can("academy.edit") && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4" /> Nouvelle leçon
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nouvelle leçon</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Titre</Label>
                  <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required />
                </div>
                <div className="space-y-1.5">
                  <Label>Lien vidéo (YouTube, Vimeo, Drive...)</Label>
                  <Input
                    type="url"
                    placeholder="https://..."
                    value={form.videoUrl}
                    onChange={(e) => setForm((f) => ({ ...f, videoUrl: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Catégorie</Label>
                  <Input value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <Label>Description</Label>
                  <Textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {lessons.map((lesson) => (
          <Card key={lesson.id}>
            <CardHeader className="flex-row items-start justify-between space-y-0">
              <div>
                {lesson.category && <p className="mb-1 text-xs font-medium text-primary">{lesson.category}</p>}
                <CardTitle className="text-base">{lesson.title}</CardTitle>
              </div>
              {can("academy.edit") && (
                <Button size="icon" variant="ghost" onClick={() => softDelete(lesson.id)}>
                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{lesson.description}</p>
              <a
                href={lesson.videoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
              >
                <PlayCircle className="h-4 w-4" /> Regarder la vidéo
              </a>
            </CardContent>
          </Card>
        ))}
        {lessons.length === 0 && (
          <Card className="border-dashed sm:col-span-2 lg:col-span-3">
            <CardContent className="flex flex-col items-center gap-2 py-16 text-center">
              <GraduationCap className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Aucune leçon pour l'instant.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
