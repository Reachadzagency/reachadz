import { createContext, useContext, ReactNode } from "react"
import { useEntityStore } from "@/hooks/useEntityStore"
import { STORAGE_KEYS } from "@/lib/storage"
import { Expense, Income } from "@/types"

interface FinanceContextValue {
  expenses: ReturnType<typeof useEntityStore<Expense>>
  incomes: ReturnType<typeof useEntityStore<Income>>
}

const FinanceContext = createContext<FinanceContextValue | undefined>(undefined)

export function FinanceProvider({ children }: { children: ReactNode }) {
  const expenses = useEntityStore<Expense>(STORAGE_KEYS.expenses, [])
  const incomes = useEntityStore<Income>(STORAGE_KEYS.incomes, [])
  return <FinanceContext.Provider value={{ expenses, incomes }}>{children}</FinanceContext.Provider>
}

export function useFinance() {
  const ctx = useContext(FinanceContext)
  if (!ctx) throw new Error("useFinance must be used within FinanceProvider")
  return ctx
}
