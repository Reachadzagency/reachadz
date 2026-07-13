import { Menu, LogOut, User as UserIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/context/AuthContext"
import { ROLE_LABELS } from "@/lib/permissions"
import { ThemeToggle } from "@/components/layout/ThemeToggle"
import { NotificationBell } from "@/components/layout/NotificationBell"

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { currentUser, logout } = useAuth()

  const initials = currentUser?.fullName
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-card/80 px-4 backdrop-blur">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
          <Menu className="h-5 w-5" />
        </Button>
        <p className="text-sm text-muted-foreground">
          Bienvenue, <span className="font-medium text-foreground">{currentUser?.fullName}</span>
        </p>
      </div>
      <div className="flex items-center gap-1">
        <ThemeToggle />
        <NotificationBell />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="ml-1 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="flex flex-col">
              <span>{currentUser?.fullName}</span>
              <span className="text-xs font-normal text-muted-foreground">
                {currentUser && ROLE_LABELS[currentUser.role]}
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled>
              <UserIcon className="h-4 w-4" /> Mon profil
            </DropdownMenuItem>
            <DropdownMenuItem onClick={logout}>
              <LogOut className="h-4 w-4" /> Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
