import { createContext, useContext, useRef, useState, ReactNode, useCallback } from "react"
import { AppNotification, NotificationType } from "@/types"
import { generateId } from "@/lib/utils"

interface NotificationsContextValue {
  notifications: AppNotification[]
  unreadCount: number
  notify: (type: NotificationType, title: string, message: string, link?: string) => void
  markAllRead: () => void
  markRead: (id: string) => void
  clearAll: () => void
}

const NotificationsContext = createContext<NotificationsContextValue | undefined>(undefined)

/**
 * MVP note: notifications live only in memory for the current browser
 * session (not localStorage) since they represent "live activity right
 * now." Once we add a real backend, this becomes a subscription to
 * server-pushed events instead and will persist across reloads/devices.
 */
export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const playSound = useCallback(() => {
    try {
      if (!audioRef.current) {
        // Short pleasant "ping" generated as a data URI so no asset file is needed.
        audioRef.current = new Audio(
          "data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA="
        )
      }
      audioRef.current.currentTime = 0
      void audioRef.current.play()
    } catch {
      // ignore autoplay restrictions
    }
  }, [])

  const notify = useCallback(
    (type: NotificationType, title: string, message: string, link?: string) => {
      const entry: AppNotification = {
        id: generateId("notif"),
        type,
        title,
        message,
        link,
        read: false,
        createdAt: new Date().toISOString(),
      }
      setNotifications((prev) => [entry, ...prev].slice(0, 50))
      playSound()
    },
    [playSound]
  )

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }, [])

  const markRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }, [])

  const clearAll = useCallback(() => setNotifications([]), [])

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <NotificationsContext.Provider
      value={{ notifications, unreadCount, notify, markAllRead, markRead, clearAll }}
    >
      {children}
    </NotificationsContext.Provider>
  )
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext)
  if (!ctx) throw new Error("useNotifications must be used within NotificationsProvider")
  return ctx
}
