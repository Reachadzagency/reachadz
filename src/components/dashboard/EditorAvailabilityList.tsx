import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { TeamMember } from "@/types"

interface Row {
  member: TeamMember
  busy: boolean
}

export function EditorAvailabilityList({ rows }: { rows: Row[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Disponibilité des éditeurs</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {rows.length === 0 && (
          <p className="text-sm text-muted-foreground">Aucun éditeur enregistré.</p>
        )}
        {rows.map(({ member, busy }) => (
          <div key={member.id} className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {member.fullName
                    .split(" ")
                    .map((p) => p[0])
                    .join("")
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium leading-none">{member.fullName}</p>
                <p className="text-xs text-muted-foreground">
                  {member.paymentType === "freelancer" ? "Freelance" : "Salarié"}
                </p>
              </div>
            </div>
            <Badge variant={busy ? "destructive" : "success"}>{busy ? "Occupé" : "Libre"}</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
