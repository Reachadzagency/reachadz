import { createContext, useContext, ReactNode, useMemo } from "react"
import { useEntityStore } from "@/hooks/useEntityStore"
import { STORAGE_KEYS } from "@/lib/storage"
import { seedTeamMembers } from "@/lib/seedData"
import { TeamMember } from "@/types"
import { useAuth } from "@/context/AuthContext"

type TeamContextValue = ReturnType<typeof useEntityStore<TeamMember>>

const TeamContext = createContext<TeamContextValue | undefined>(undefined)

export function TeamProvider({ children }: { children: ReactNode }) {
  const store = useEntityStore<TeamMember>(STORAGE_KEYS.teamMembers, seedTeamMembers)
  return <TeamContext.Provider value={store}>{children}</TeamContext.Provider>
}

export function useTeam() {
  const ctx = useContext(TeamContext)
  if (!ctx) throw new Error("useTeam must be used within TeamProvider")
  return ctx
}

/**
 * A logged-in User (account) and a TeamMember (editor/filmmaker/designer/
 * media buyer record used for assignments) are two separate records —
 * assignments on orders/projets always store the TeamMember's id.
 * This hook bridges the two by matching on email, so "my assigned videos"
 * style filters work for whoever is logged in. If an admin creates a login
 * for someone, make sure the email matches their Team member entry.
 */
export function useMyTeamMember(): TeamMember | undefined {
  const { active } = useTeam()
  const { currentUser } = useAuth()
  return useMemo(() => {
    if (!currentUser) return undefined
    return active.find((m) => m.email.trim().toLowerCase() === currentUser.email.trim().toLowerCase())
  }, [active, currentUser])
}
