import { useMemo, useState } from "react"
import {
  Wallet,
  Clapperboard,
  TrendingUp,
  Landmark,
  Ban,
  SlidersHorizontal,
} from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { useOrders } from "@/context/OrdersContext"
import { useProjets } from "@/context/ProjetsContext"
import { useTeam } from "@/context/TeamContext"
import { useFinance } from "@/context/FinanceContext"
import { MetricCard } from "@/components/dashboard/MetricCard"
import { RevenueChart } from "@/components/dashboard/RevenueChart"
import { StatusDonutChart } from "@/components/dashboard/StatusDonutChart"
import { EditorAvailabilityList } from "@/components/dashboard/EditorAvailabilityList"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatMAD } from "@/lib/utils"
import { loadValue, saveValue } from "@/lib/storage"
import {
  getActiveVsCompleted,
  getCancelledValue,
  getMonthlyOrdersCount,
  getMonthlyVideosSold,
  getNetRevenue,
  getRevenueSeries,
  getStatusDistribution,
  isEditorBusy,
} from "@/lib/calculations"

const WIDGETS = [
  { id: "metrics", label: "Cartes de métriques" },
  { id: "activeCompleted", label: "Actives vs terminées" },
  { id: "revenueChart", label: "Graphique de revenu" },
  { id: "statusDonut", label: "Répartition des statuts" },
  { id: "editorAvailability", label: "Disponibilité des éditeurs" },
] as const

type WidgetId = (typeof WIDGETS)[number]["id"]

export default function DashboardPage() {
  const { currentUser, can } = useAuth()
  const { active: activeOrders } = useOrders()
  const { active: activeProjets } = useProjets()
  const { active: activeTeam } = useTeam()
  const { expenses } = useFinance()

  const [visibleWidgets, setVisibleWidgets] = useState<WidgetId[]>(() =>
    loadValue<WidgetId[]>("dashboardLayout", WIDGETS.map((w) => w.id))
  )

  function toggleWidget(id: WidgetId) {
    setVisibleWidgets((prev) => {
      const next = prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id]
      saveValue("dashboardLayout", next)
      return next
    })
  }
  const show = (id: WidgetId) => visibleWidgets.includes(id)

  const showFinancials = can("dashboard.viewFinancials")

  const monthlyOrders = useMemo(() => getMonthlyOrdersCount(activeOrders), [activeOrders])
  const monthlyVideos = useMemo(() => getMonthlyVideosSold(activeOrders), [activeOrders])
  const cancelledValue = useMemo(() => getCancelledValue(activeOrders), [activeOrders])
  const { active, completed } = useMemo(() => getActiveVsCompleted(activeOrders), [activeOrders])
  const netRevenue = useMemo(
    () => getNetRevenue(activeOrders, activeProjets, activeTeam, expenses.active),
    [activeOrders, activeProjets, activeTeam, expenses.active]
  )
  const revenueSeries = useMemo(() => getRevenueSeries(activeOrders), [activeOrders])
  const statusCounts = useMemo(() => getStatusDistribution(activeOrders), [activeOrders])
  const editorRows = useMemo(
    () =>
      activeTeam
        .filter((t) => t.function === "editor" || t.function === "filmmaker")
        .map((member) => ({ member, busy: isEditorBusy(member.id, activeOrders) })),
    [activeTeam, activeOrders]
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Bonjour, {currentUser?.fullName.split(" ")[0]} 👋
          </h1>
          <p className="text-sm text-muted-foreground">Voici un aperçu de votre agence aujourd'hui.</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <SlidersHorizontal className="h-4 w-4" /> Personnaliser
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>Widgets affichés</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {WIDGETS.map((w) => (
              <DropdownMenuItem
                key={w.id}
                onSelect={(e) => {
                  e.preventDefault()
                  toggleWidget(w.id)
                }}
              >
                <input type="checkbox" checked={show(w.id)} readOnly className="h-3.5 w-3.5" />
                {w.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {show("metrics") && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="Projets ce mois" value={String(monthlyOrders + activeProjets.length)} icon={Clapperboard} />
          <MetricCard label="Vidéos vendues ce mois" value={String(monthlyVideos)} icon={TrendingUp} />
          {showFinancials && (
            <MetricCard
              label="Revenu net (après frais)"
              value={formatMAD(netRevenue)}
              icon={Wallet}
              tone={netRevenue >= 0 ? "success" : "destructive"}
            />
          )}
          {showFinancials && (
            <MetricCard label="Net à retirer" value={formatMAD(netRevenue)} icon={Landmark} tone="success" />
          )}
        </div>
      )}

      {show("activeCompleted") && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Vidéos actives</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold">{active}</CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Vidéos terminées</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold text-success">{completed}</CardContent>
          </Card>
          {showFinancials && (
            <Card>
              <CardHeader className="pb-2 flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm text-muted-foreground">Valeur annulée</CardTitle>
                <Ban className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent className="text-2xl font-semibold text-destructive">
                {formatMAD(cancelledValue)}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {(show("revenueChart") || show("statusDonut")) && showFinancials && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {show("revenueChart") && <RevenueChart data={revenueSeries} />}
          {show("statusDonut") && <StatusDonutChart counts={statusCounts} />}
        </div>
      )}

      {show("editorAvailability") && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <EditorAvailabilityList rows={editorRows} />
        </div>
      )}
    </div>
  )
}
