import { Scissors } from "lucide-react"
import { TeamRolePage } from "@/components/team/TeamRolePage"

export default function EditorsPage() {
  return (
    <TeamRolePage
      function_="editor"
      title="Éditeurs"
      description="Charge de travail et disponibilité des monteurs vidéo."
      icon={Scissors}
    />
  )
}
