import { createContext, useContext, ReactNode } from "react"
import { useEntityStore } from "@/hooks/useEntityStore"
import { STORAGE_KEYS } from "@/lib/storage"
import { AcademyLesson } from "@/types"

type AcademyContextValue = ReturnType<typeof useEntityStore<AcademyLesson>>

const AcademyContext = createContext<AcademyContextValue | undefined>(undefined)

const seedLessons: AcademyLesson[] = [
  {
    id: "lesson-1",
    title: "Bien démarrer avec le CRM",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    description: "Tour d'horizon des bases : commandes, statuts, livraison.",
    category: "Onboarding",
    createdAt: new Date().toISOString(),
  },
]

export function AcademyProvider({ children }: { children: ReactNode }) {
  const store = useEntityStore<AcademyLesson>(STORAGE_KEYS.academyLessons, seedLessons)
  return <AcademyContext.Provider value={store}>{children}</AcademyContext.Provider>
}

export function useAcademy() {
  const ctx = useContext(AcademyContext)
  if (!ctx) throw new Error("useAcademy must be used within AcademyProvider")
  return ctx
}
