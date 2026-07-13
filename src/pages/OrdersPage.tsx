import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Search } from "lucide-react"
import { useOrders } from "@/context/OrdersContext"
import { useTeam } from "@/context/TeamContext"
import { useAuth } from "@/context/AuthContext"
import { Input } from "@/components/ui/input"
import { SelectNative } from "@/components/ui/select-native"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge"
import { OrderFormDialog } from "@/components/orders/OrderFormDialog"
import { formatDate, formatMAD } from "@/lib/utils"
import { ORDER_STATUSES } from "@/types"

export default function OrdersPage() {
  const { active: orders } = useOrders()
  const { active: team } = useTeam()
  const { currentUser, can } = useAuth()
  const navigate = useNavigate()

  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<"active" | "all">("active")
  const [editorFilter, setEditorFilter] = useState("all")
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")

  const isEditor = currentUser?.role === "editor"
  const showPrices = can("dashboard.viewFinancials")
  const editors = team.filter((t) => t.function === "editor")

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      if (isEditor) {
        const assigned = o.videos.some((v) => v.editorId === currentUser?.id) || o.editorId === currentUser?.id
        if (!assigned) return false
      }
      if (statusFilter === "active" && ["completed", "cancelled"].includes(o.status)) return false
      if (editorFilter !== "all") {
        const hasEditor = o.videos.some((v) => v.editorId === editorFilter) || o.editorId === editorFilter
        if (!hasEditor) return false
      }
      if (fromDate && new Date(o.maxDeliveryDate) < new Date(fromDate)) return false
      if (toDate && new Date(o.maxDeliveryDate) > new Date(toDate)) return false
      if (search) {
        const q = search.toLowerCase()
        const hay = `${o.orderNumber} ${o.clientName} ${o.projetLabel ?? ""} ${o.city}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [orders, isEditor, currentUser, statusFilter, editorFilter, fromDate, toDate, search])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Commandes vidéos</h1>
          <p className="text-sm text-muted-foreground">{filtered.length} commande(s)</p>
        </div>
        {can("orders.create") && <OrderFormDialog />}
      </div>

      <Card>
        <CardContent className="flex flex-wrap items-end gap-3 p-4">
          <div className="relative min-w-[220px] flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-8"
              placeholder="Rechercher par n°, client, ville, projet..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="w-40">
            <SelectNative value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as "active" | "all")}>
              <option value="active">Actives</option>
              <option value="all">Toutes</option>
            </SelectNative>
          </div>
          {!isEditor && (
            <div className="w-48">
              <SelectNative value={editorFilter} onChange={(e) => setEditorFilter(e.target.value)}>
                <option value="all">Tous les éditeurs</option>
                {editors.map((ed) => (
                  <option key={ed.id} value={ed.id}>
                    {ed.fullName}
                  </option>
                ))}
              </SelectNative>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="w-36" />
            <span className="text-sm text-muted-foreground">à</span>
            <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="w-36" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>N°</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Projet</TableHead>
              <TableHead>Vidéos</TableHead>
              {showPrices && <TableHead>Prix total</TableHead>}
              <TableHead>Statut</TableHead>
              <TableHead>Échéance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((o) => (
              <TableRow key={o.id} className="cursor-pointer" onClick={() => navigate(`/orders/${o.id}`)}>
                <TableCell className="font-medium">{o.orderNumber}</TableCell>
                <TableCell>{o.clientName}</TableCell>
                <TableCell className="max-w-[200px] truncate">{o.projetLabel}</TableCell>
                <TableCell>{o.numberOfVideos}</TableCell>
                {showPrices && <TableCell>{formatMAD(o.pricePerVideo * o.numberOfVideos)}</TableCell>}
                <TableCell>
                  <OrderStatusBadge status={o.status} />
                </TableCell>
                <TableCell>{formatDate(o.maxDeliveryDate)}</TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                  Aucune commande ne correspond à ces filtres.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
      <p className="text-xs text-muted-foreground">
        {ORDER_STATUSES.length} statuts possibles : {ORDER_STATUSES.map((s) => s.label).join(" · ")}
      </p>
    </div>
  )
}
