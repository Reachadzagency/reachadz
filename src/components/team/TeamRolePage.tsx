import { useMemo } from "react"
import { Trash2, LucideIcon } from "lucide-react"
import { useTeam } from "@/context/TeamContext"
import { useOrders } from "@/context/OrdersContext"
import { useProjets } from "@/context/ProjetsContext"
import { useAuth } from "@/context/AuthContext"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { TeamMemberFormDialog } from "@/components/team/TeamMemberFormDialog"
import { TeamFunction } from "@/types"
import { formatMAD } from "@/lib/utils"

interface TeamRolePageProps {
  function_: TeamFunction
  title: string
  description: string
  icon: LucideIcon
}

export function TeamRolePage({ function_, title, description, icon: Icon }: TeamRolePageProps) {
  const { active: team, softDelete } = useTeam()
  const { active: orders } = useOrders()
  const { active: projets } = useProjets()
  const { can } = useAuth()

  const members = team.filter((t) => t.function === function_)

  const workload = useMemo(() => {
    const map = new Map<string, { count: number; busy: boolean }>()
    for (const m of members) {
      if (function_ === "editor" || function_ === "filmmaker") {
        const assignedVideos = orders.flatMap((o) =>
          o.videos.filter((v) => v.editorId === m.id || (function_ === "filmmaker" && o.filmmakerId === m.id))
        )
        const activeVideos = assignedVideos.filter((v) => !["completed", "delivered", "cancelled"].includes(v.status))
        map.set(m.id, { count: assignedVideos.length, busy: activeVideos.length > 0 })
      } else {
        const key = function_ === "designer" ? "designerId" : "mediaBuyerId"
        const assigned = projets.filter((p) => (p as any)[key] === m.id)
        const activeOnes = assigned.filter((p) => !["completed", "cancelled"].includes(p.status))
        map.set(m.id, { count: assigned.length, busy: activeOnes.length > 0 })
      }
    }
    return map
  }, [members, orders, projets, function_])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {can("team.edit") && <TeamMemberFormDialog function_={function_} />}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((member) => {
          const w = workload.get(member.id) ?? { count: 0, busy: false }
          return (
            <Card key={member.id}>
              <CardContent className="space-y-3 p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback>
                        {member.fullName.split(" ").map((p) => p[0]).join("").slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium leading-none">{member.fullName}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{member.email}</p>
                    </div>
                  </div>
                  <Badge variant={w.busy ? "destructive" : "success"}>{w.busy ? "Occupé" : "Libre"}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {member.paymentType === "freelancer"
                      ? `Freelance — ${formatMAD(member.rate)}/vidéo`
                      : member.paymentType === "salary"
                        ? `Salarié — ${formatMAD(member.monthlySalary ?? 0)}/mois`
                        : "Manager"}
                  </span>
                  <span className="font-medium">{w.count} assigné(s)</span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  {can("team.edit") && (
                    <TeamMemberFormDialog function_={function_} member={member} trigger={<Button size="sm" variant="outline">Modifier</Button>} />
                  )}
                  {can("team.edit") && (
                    <Button size="sm" variant="ghost" onClick={() => softDelete(member.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
        {members.length === 0 && (
          <Card className="border-dashed sm:col-span-2 lg:col-span-3">
            <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
              <Icon className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Aucun membre dans cette catégorie pour l'instant.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
