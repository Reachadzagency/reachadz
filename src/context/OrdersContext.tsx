import { createContext, useContext, ReactNode, useCallback } from "react"
import { useEntityStore } from "@/hooks/useEntityStore"
import { STORAGE_KEYS } from "@/lib/storage"
import { seedOrders } from "@/lib/seedData"
import { Order, OrderStatus, OrderVideo } from "@/types"
import { useNotifications } from "@/context/NotificationsContext"
import { useAuditLog } from "@/context/AuditLogContext"

interface OrdersContextValue extends ReturnType<typeof useEntityStore<Order>> {
  createOrder: (order: Omit<Order, "id" | "createdAt" | "updatedAt">) => Order
  changeStatus: (id: string, status: OrderStatus) => void
  updateVideo: (orderId: string, videoId: string, patch: Partial<OrderVideo>) => void
  nextOrderNumber: () => string
}

const OrdersContext = createContext<OrdersContextValue | undefined>(undefined)

export function OrdersProvider({ children }: { children: ReactNode }) {
  const store = useEntityStore<Order>(STORAGE_KEYS.orders, seedOrders)
  const { notify } = useNotifications()
  const { log } = useAuditLog()

  const createOrder = useCallback(
    (order: Omit<Order, "id" | "createdAt" | "updatedAt">) => {
      const now = new Date().toISOString()
      const created = store.add({ ...order, createdAt: now, updatedAt: now } as Order)
      notify(
        "order_created",
        "Nouvelle commande",
        `${created.orderNumber} pour ${created.clientName}`,
        `/orders/${created.id}`
      )
      log("Création commande", "order", created.id, created.orderNumber)
      return created
    },
    [store, notify, log]
  )

  const changeStatus = useCallback(
    (id: string, status: OrderStatus) => {
      store.update(id, { status, updatedAt: new Date().toISOString() } as Partial<Order>)
      const order = store.items.find((o) => o.id === id)
      notify(
        "order_status_changed",
        "Statut mis à jour",
        `${order?.orderNumber ?? "Commande"} → ${status}`,
        `/orders/${id}`
      )
      log("Changement de statut", "order", id, status)
    },
    [store, notify, log]
  )

  const updateVideo = useCallback(
    (orderId: string, videoId: string, patch: Partial<OrderVideo>) => {
      const order = store.items.find((o) => o.id === orderId)
      if (!order) return
      const videos = order.videos.map((v) => (v.id === videoId ? { ...v, ...patch } : v))
      store.update(orderId, { videos, updatedAt: new Date().toISOString() } as Partial<Order>)
      if (patch.status === "revision") {
        notify(
          "delivery_submitted",
          "Vidéo envoyée en révision",
          `${order.orderNumber} — vidéo #${videos.find((v) => v.id === videoId)?.index}`,
          `/orders/${orderId}`
        )
      }
      log("Mise à jour vidéo", "order_video", videoId, JSON.stringify(patch))
    },
    [store, notify, log]
  )

  const nextOrderNumber = useCallback(() => {
    const max = store.items.reduce((m, o) => {
      const n = parseInt(o.orderNumber.replace(/\D/g, ""), 10)
      return Number.isFinite(n) ? Math.max(m, n) : m
    }, 0)
    return `CMD-${String(max + 1).padStart(4, "0")}`
  }, [store.items])

  return (
    <OrdersContext.Provider value={{ ...store, createOrder, changeStatus, updateVideo, nextOrderNumber }}>
      {children}
    </OrdersContext.Provider>
  )
}

export function useOrders() {
  const ctx = useContext(OrdersContext)
  if (!ctx) throw new Error("useOrders must be used within OrdersProvider")
  return ctx
}
