import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { loadValue, saveValue, STORAGE_KEYS } from "@/lib/storage"
import { AgencySettings } from "@/types"

const DEFAULT_SETTINGS: AgencySettings = { name: "Mon Agence", logoUrl: "" }

interface AgencySettingsContextValue {
  settings: AgencySettings
  updateSettings: (patch: Partial<AgencySettings>) => void
}

const AgencySettingsContext = createContext<AgencySettingsContextValue | undefined>(undefined)

export function AgencySettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AgencySettings>(() =>
    loadValue(STORAGE_KEYS.agencySettings, DEFAULT_SETTINGS)
  )

  useEffect(() => {
    saveValue(STORAGE_KEYS.agencySettings, settings)
  }, [settings])

  return (
    <AgencySettingsContext.Provider
      value={{ settings, updateSettings: (patch) => setSettings((s) => ({ ...s, ...patch })) }}
    >
      {children}
    </AgencySettingsContext.Provider>
  )
}

export function useAgencySettings() {
  const ctx = useContext(AgencySettingsContext)
  if (!ctx) throw new Error("useAgencySettings must be used within AgencySettingsProvider")
  return ctx
}
