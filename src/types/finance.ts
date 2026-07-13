export type ExpenseCategory =
  | "salaries"
  | "freelancers"
  | "ads_spend"
  | "tools_subscriptions"
  | "office"
  | "other"

export interface Expense {
  id: string
  category: ExpenseCategory
  amount: number
  date: string
  notes?: string
  createdAt: string
  createdBy: string
  deletedAt?: string | null
}

export interface Income {
  id: string
  amount: number
  date: string
  orderId?: string
  projetId?: string
  clientName: string
  notes?: string
  createdAt: string
  createdBy: string
  deletedAt?: string | null
}
