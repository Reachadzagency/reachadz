import { createContext, useContext, ReactNode } from "react"
import { useEntityStore } from "@/hooks/useEntityStore"
import { STORAGE_KEYS } from "@/lib/storage"
import { seedTeamMembers } from "@/lib/seedData"
import { TeamMember } from "@/types"

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
