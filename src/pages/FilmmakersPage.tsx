import { Camera } from "lucide-react"
import { TeamRolePage } from "@/components/team/TeamRolePage"

export default function FilmmakersPage() {
  return (
    <TeamRolePage
      function_="filmmaker"
      title="Cadreurs"
      description="Équipe de tournage et disponibilité."
      icon={Camera}
    />
  )
}
