import { createContext, useContext, ReactNode } from "react"
import { useEntityStore } from "@/hooks/useEntityStore"
import { STORAGE_KEYS } from "@/lib/storage"
import { seedClients } from "@/lib/seedData"
import { Client } from "@/types"

type ClientsContextValue = ReturnType<typeof useEntityStore<Client>>

const ClientsContext = createContext<ClientsContextValue | undefined>(undefined)

export function ClientsProvider({ children }: { children: ReactNode }) {
  const store = useEntityStore<Client>(STORAGE_KEYS.clients, seedClients)
  return <ClientsContext.Provider value={store}>{children}</ClientsContext.Provider>
}

export function useClients() {
  const ctx = useContext(ClientsContext)
  if (!ctx) throw new Error("useClients must be used within ClientsProvider")
  return ctx
}
