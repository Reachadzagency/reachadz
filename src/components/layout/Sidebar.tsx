import { NavLink } from "react-router-dom"
import { Video, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/context/AuthContext"
import { useAgencySettings } from "@/context/AgencySettingsContext"
import { NAV_ITEMS } from "@/components/layout/navItems"

interface SidebarProps {
  mobileOpen: boolean
  onClose: () => void
}

export function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const { can } = useAuth()
  const { settings } = useAgencySettings()
  const visibleItems = NAV_ITEMS.filter((item) => can(item.permission))

  let lastGroup: string | undefined = undefined

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 md:hidden" onClick={onClose} />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-card transition-transform md:static md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-14 items-center justify-between border-b px-4">
          <div className="flex items-center gap-2 font-semibold">
            {settings.logoUrl ? (
              <img src={settings.logoUrl} alt={settings.name} className="h-8 w-8 rounded-lg object-cover" />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Video className="h-4 w-4" />
              </div>
            )}
            <span className="truncate">{settings.name}</span>
          </div>
          <button className="md:hidden" onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 py-3">
          {visibleItems.map((item) => {
            const showGroupLabel = item.group && item.group !== lastGroup
            lastGroup = item.group
            return (
              <div key={item.path}>
                {showGroupLabel && (
                  <p className="mb-1 mt-3 px-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    {item.group}
                  </p>
                )}
                <NavLink
                  to={item.path}
                  end={item.path === "/"}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )
                  }
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </NavLink>
              </div>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
