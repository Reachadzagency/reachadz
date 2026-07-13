import { createContext, useContext, ReactNode, useCallback } from "react"
import { useEntityStore } from "@/hooks/useEntityStore"
import { STORAGE_KEYS } from "@/lib/storage"
import { seedProjets } from "@/lib/seedData"
import { Projet, ProjetStatus } from "@/types"
import { useNotifications } from "@/context/NotificationsContext"
import { useAuditLog } from "@/context/AuditLogContext"

interface ProjetsContextValue extends ReturnType<typeof useEntityStore<Projet>> {
  createProjet: (projet: Omit<Projet, "id" | "createdAt" | "updatedAt">) => Projet
  changeStatus: (id: string, status: ProjetStatus) => void
  nextReference: () => string
}

const ProjetsContext = createContext<ProjetsContextValue | undefined>(undefined)

export function ProjetsProvider({ children }: { children: ReactNode }) {
  const store = useEntityStore<Projet>(STORAGE_KEYS.projets, seedProjets)
  const { notify } = useNotifications()
  const { log } = useAuditLog()

  const createProjet = useCallback(
    (projet: Omit<Projet, "id" | "createdAt" | "updatedAt">) => {
      const now = new Date().toISOString()
      const created = store.add({ ...projet, createdAt: now, updatedAt: now } as Projet)
      notify(
        "projet_created",
        "Nouveau projet",
        `${created.reference} pour ${created.clientName}`,
        `/projets/${created.id}`
      )
      log("Création projet", "projet", created.id, created.reference)
      return created
    },
    [store, notify, log]
  )

  const changeStatus = useCallback(
    (id: string, status: ProjetStatus) => {
      store.update(id, { status, updatedAt: new Date().toISOString() } as Partial<Projet>)
      const projet = store.items.find((p) => p.id === id)
      notify(
        "projet_status_changed",
        "Statut mis à jour",
        `${projet?.reference ?? "Projet"} → ${status}`,
        `/projets/${id}`
      )
      log("Changement de statut", "projet", id, status)
    },
    [store, notify, log]
  )

  const nextReference = useCallback(() => {
    const max = store.items.reduce((m, p) => {
      const n = parseInt(p.reference.replace(/\D/g, ""), 10)
      return Number.isFinite(n) ? Math.max(m, n) : m
    }, 0)
    return `PRJ-${String(max + 1).padStart(4, "0")}`
  }, [store.items])

  return (
    <ProjetsContext.Provider value={{ ...store, createProjet, changeStatus, nextReference }}>
      {children}
    </ProjetsContext.Provider>
  )
}

export function useProjets() {
  const ctx = useContext(ProjetsContext)
  if (!ctx) throw new Error("useProjets must be used within ProjetsProvider")
  return ctx
}
