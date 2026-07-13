import { createContext, useContext, useCallback, ReactNode } from "react"
import { loadCollection, saveCollection, STORAGE_KEYS } from "@/lib/storage"
import { AuditLogEntry } from "@/types"
import { generateId } from "@/lib/utils"
import { useAuth } from "@/context/AuthContext"
import { useState, useEffect } from "react"

interface AuditLogContextValue {
  entries: AuditLogEntry[]
  log: (action: string, entityType: string, entityId?: string, details?: string) => void
}

const AuditLogContext = createContext<AuditLogContextValue | undefined>(undefined)

export function AuditLogProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useAuth()
  const [entries, setEntries] = useState<AuditLogEntry[]>(() =>
    loadCollection<AuditLogEntry>(STORAGE_KEYS.auditLog, [])
  )

  useEffect(() => {
    saveCollection(STORAGE_KEYS.auditLog, entries)
  }, [entries])

  const log = useCallback(
    (action: string, entityType: string, entityId?: string, details?: string) => {
      const entry: AuditLogEntry = {
        id: generateId("log"),
        userId: currentUser?.id ?? "system",
        userName: currentUser?.fullName ?? "Système",
        action,
        entityType,
        entityId,
        details,
        createdAt: new Date().toISOString(),
      }
      setEntries((prev) => [entry, ...prev].slice(0, 500))
    },
    [currentUser]
  )

  return <AuditLogContext.Provider value={{ entries, log }}>{children}</AuditLogContext.Provider>
}

export function useAuditLog() {
  const ctx = useContext(AuditLogContext)
  if (!ctx) throw new Error("useAuditLog must be used within AuditLogProvider")
  return ctx
}
