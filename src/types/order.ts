export type OrderStatus =
  | "new_order"
  | "in_script"
  | "in_filming"
  | "in_editing"
  | "revision"
  | "delivery"
  | "delivered"
  | "completed"
  | "cancelled"

export const ORDER_STATUSES: { value: OrderStatus; label: string; color: string }[] = [
  { value: "new_order", label: "Nouvelle commande", color: "#64748b" },
  { value: "in_script", label: "Script en cours", color: "#a855f7" },
  { value: "in_filming", label: "Tournage", color: "#f59e0b" },
  { value: "in_editing", label: "Montage", color: "#3b82f6" },
  { value: "revision", label: "Révision", color: "#eab308" },
  { value: "delivery", label: "Livraison", color: "#06b6d4" },
  { value: "delivered", label: "Livré", color: "#22c55e" },
  { value: "completed", label: "Terminé", color: "#16a34a" },
  { value: "cancelled", label: "Annulé", color: "#ef4444" },
]

export interface OrderVideo {
  id: string
  index: number
  status: OrderStatus
  editorId?: string
  deliveryLink?: string
  notes?: string
}

export interface Order {
  id: string
  orderNumber: string
  clientId: string
  clientName: string
  phone: string
  city: string
  projetLabel?: string
  numberOfVideos: number
  pricePerVideo: number
  scriptToValidate?: string
  scriptValidated: boolean
  filmmakerId?: string
  editorId?: string
  status: OrderStatus
  maxDeliveryDate: string
  videos: OrderVideo[]
  createdAt: string
  updatedAt: string
  createdBy: string
  deletedAt?: string | null
}
