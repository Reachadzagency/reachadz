import { Megaphone } from "lucide-react"
import { TeamRolePage } from "@/components/team/TeamRolePage"

export default function MediaBuyersPage() {
  return (
    <TeamRolePage
      function_="media_buyer"
      title="Media Buyers"
      description="Équipe achats média et charge de travail."
      icon={Megaphone}
    />
  )
}
