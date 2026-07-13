export type ProjetType = "ads" | "website" | "community_management" | "design" | "all_in_one"

export type ProjetStatus =
  | "new"
  | "in_progress"
  | "in_review"
  | "delivered"
  | "completed"
  | "cancelled"

export const PROJET_STATUSES: { value: ProjetStatus; label: string; color: string }[] = [
  { value: "new", label: "Nouveau", color: "#64748b" },
  { value: "in_progress", label: "En cours", color: "#3b82f6" },
  { value: "in_review", label: "En révision", color: "#eab308" },
  { value: "delivered", label: "Livré", color: "#22c55e" },
  { value: "completed", label: "Terminé", color: "#16a34a" },
  { value: "cancelled", label: "Annulé", color: "#ef4444" },
]

export const PROJET_TYPES: { value: ProjetType; label: string }[] = [
  { value: "ads", label: "Publicités (Ads)" },
  { value: "website", label: "Création de site web" },
  { value: "community_management", label: "Community management" },
  { value: "design", label: "Design" },
  { value: "all_in_one", label: "Tout inclus" },
]

export interface Projet {
  id: string
  reference: string
  clientId: string
  clientName: string
  type: ProjetType
  status: ProjetStatus
  managerId?: string
  designerId?: string
  mediaBuyerId?: string
  price: number
  startDate: string
  dueDate: string
  description?: string
  createdAt: string
  updatedAt: string
  createdBy: string
  deletedAt?: string | null
}
