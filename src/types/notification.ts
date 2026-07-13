export type NotificationType =
  | "order_created"
  | "order_status_changed"
  | "delivery_submitted"
  | "projet_created"
  | "projet_status_changed"
  | "general"

export interface AppNotification {
  id: string
  type: NotificationType
  title: string
  message: string
  read: boolean
  createdAt: string
  targetUserIds?: string[]
  link?: string
}

export interface AuditLogEntry {
  id: string
  userId: string
  userName: string
  action: string
  entityType: string
  entityId?: string
  details?: string
  createdAt: string
}
