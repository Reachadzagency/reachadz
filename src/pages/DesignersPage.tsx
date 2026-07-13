import { Palette } from "lucide-react"
import { TeamRolePage } from "@/components/team/TeamRolePage"

export default function DesignersPage() {
  return (
    <TeamRolePage
      function_="designer"
      title="Designers"
      description="Équipe design et charge de travail sur les projets."
      icon={Palette}
    />
  )
}
