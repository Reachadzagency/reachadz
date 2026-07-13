import {
  LayoutDashboard,
  Clapperboard,
  Briefcase,
  Users,
  CalendarDays,
  Scissors,
  Camera,
  Palette,
  Megaphone,
  Wallet,
  TrendingUp,
  BarChart3,
  KeyRound,
  History,
  Trash2,
  GraduationCap,
  Settings,
  type LucideIcon,
} from "lucide-react"
import { PermissionKey } from "@/types"

export interface NavItem {
  label: string
  path: string
  icon: LucideIcon
  permission: PermissionKey
  group?: string
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Tableau de bord", path: "/", icon: LayoutDashboard, permission: "dashboard.view" },
  { label: "Commandes vidéos", path: "/orders", icon: Clapperboard, permission: "orders.view" },
  { label: "Projets", path: "/projets", icon: Briefcase, permission: "projets.view" },
  { label: "Clients", path: "/clients", icon: Users, permission: "clients.view" },
  { label: "Calendrier", path: "/calendar", icon: CalendarDays, permission: "calendar.view" },
  { label: "Éditeurs", path: "/team/editors", icon: Scissors, permission: "team.view", group: "Équipe" },
  { label: "Cadreurs", path: "/team/filmmakers", icon: Camera, permission: "team.view", group: "Équipe" },
  { label: "Designers", path: "/team/designers", icon: Palette, permission: "team.view", group: "Équipe" },
  { label: "Media Buyers", path: "/team/media-buyers", icon: Megaphone, permission: "team.view", group: "Équipe" },
  { label: "Dépenses", path: "/expenses", icon: Wallet, permission: "expenses.view" },
  { label: "Revenus", path: "/incomes", icon: TrendingUp, permission: "incomes.view" },
  { label: "Analytique", path: "/analytics", icon: BarChart3, permission: "analytics.view" },
  { label: "Accès outils", path: "/tool-access", icon: KeyRound, permission: "toolAccess.view" },
  { label: "Journal d'audit", path: "/audit-log", icon: History, permission: "auditLog.view" },
  { label: "Corbeille", path: "/trash", icon: Trash2, permission: "trash.view" },
  { label: "Académie", path: "/academy", icon: GraduationCap, permission: "academy.view" },
  { label: "Paramètres", path: "/settings", icon: Settings, permission: "settings.view" },
]
