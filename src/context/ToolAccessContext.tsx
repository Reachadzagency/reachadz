import { createContext, useContext, ReactNode } from "react"
import { useEntityStore } from "@/hooks/useEntityStore"
import { STORAGE_KEYS } from "@/lib/storage"
import { ToolAccessEntry } from "@/types"

type ToolAccessContextValue = ReturnType<typeof useEntityStore<ToolAccessEntry>>

const ToolAccessContext = createContext<ToolAccessContextValue | undefined>(undefined)

export function ToolAccessProvider({ children }: { children: ReactNode }) {
  const store = useEntityStore<ToolAccessEntry>(STORAGE_KEYS.toolAccess, [])
  return <ToolAccessContext.Provider value={store}>{children}</ToolAccessContext.Provider>
}

export function useToolAccess() {
  const ctx = useContext(ToolAccessContext)
  if (!ctx) throw new Error("useToolAccess must be used within ToolAccessProvider")
  return ctx
}
