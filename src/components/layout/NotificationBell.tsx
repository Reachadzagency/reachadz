import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useNotifications } from "@/context/NotificationsContext"
import { formatDateTime } from "@/lib/utils"

export function NotificationBell() {
  const { notifications, unreadCount, markAllRead } = useNotifications()

  return (
    <DropdownMenu onOpenChange={(open) => open && markAllRead()}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-1 -top-1 h-4 min-w-4 justify-center rounded-full px-1 text-[10px]"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length === 0 && (
          <div className="px-2 py-4 text-center text-sm text-muted-foreground">
            Aucune notification pour l'instant
          </div>
        )}
        <div className="max-h-80 overflow-y-auto">
          {notifications.map((n) => (
            <DropdownMenuItem key={n.id} className="flex flex-col items-start gap-0.5 whitespace-normal">
              <span className="text-sm font-medium">{n.title}</span>
              <span className="text-xs text-muted-foreground">{n.message}</span>
              <span className="text-[10px] text-muted-foreground">{formatDateTime(n.createdAt)}</span>
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
