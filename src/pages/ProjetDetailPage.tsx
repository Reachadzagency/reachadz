import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { useProjets } from "@/context/ProjetsContext"
import { useTeam } from "@/context/TeamContext"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SelectNative } from "@/components/ui/select-native"
import { ProjetStatusBadge } from "@/components/projets/ProjetStatusBadge"
import { ProjetFormDialog } from "@/components/projets/ProjetFormDialog"
import { formatDate, formatMAD } from "@/lib/utils"
import { PROJET_STATUSES, PROJET_TYPES } from "@/types"

export default function ProjetDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { items: projets, changeStatus } = useProjets()
  const { active: team } = useTeam()
  const { can } = useAuth()

  const projet = projets.find((p) => p.id === id)
  const showPrices = can("dashboard.viewFinancials")

  if (!projet) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/projets")}>
          <ArrowLeft className="h-4 w-4" /> Retour
        </Button>
        <p className="text-muted-foreground">Projet introuvable (peut-être supprimé).</p>
      </div>
    )
  }

  const memberName = (id?: string) => team.find((t) => t.id === id)?.fullName ?? "—"

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate("/projets")}>
          <ArrowLeft className="h-4 w-4" /> Retour aux projets
        </Button>
        {can("projets.edit") && <ProjetFormDialog projet={projet} trigger={<Button variant="outline">Modifier</Button>} />}
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-xl">{projet.reference}</CardTitle>
            <p className="text-sm text-muted-foreground">{projet.clientName}</p>
          </div>
          <ProjetStatusBadge status={projet.status} />
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
          <div>
            <p className="text-muted-foreground">Type</p>
            <p className="font-medium">{PROJET_TYPES.find((t) => t.value === projet.type)?.label}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Début</p>
            <p className="font-medium">{formatDate(projet.startDate)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Échéance</p>
            <p className="font-medium">{formatDate(projet.dueDate)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Manager</p>
            <p className="font-medium">{memberName(projet.managerId)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Designer</p>
            <p className="font-medium">{memberName(projet.designerId)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Media Buyer</p>
            <p className="font-medium">{memberName(projet.mediaBuyerId)}</p>
          </div>
          {showPrices && (
            <div>
              <p className="text-muted-foreground">Prix</p>
              <p className="font-medium">{formatMAD(projet.price)}</p>
            </div>
          )}
          {projet.description && (
            <div className="sm:col-span-3">
              <p className="text-muted-foreground">Description</p>
              <p className="whitespace-pre-wrap font-medium">{projet.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {can("projets.edit") && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Changer le statut</CardTitle>
          </CardHeader>
          <CardContent>
            <SelectNative
              className="max-w-xs"
              value={projet.status}
              onChange={(e) => changeStatus(projet.id, e.target.value as typeof projet.status)}
            >
              {PROJET_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </SelectNative>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
