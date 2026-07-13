import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Search } from "lucide-react"
import { useProjets } from "@/context/ProjetsContext"
import { useAuth } from "@/context/AuthContext"
import { Input } from "@/components/ui/input"
import { SelectNative } from "@/components/ui/select-native"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { ProjetStatusBadge } from "@/components/projets/ProjetStatusBadge"
import { ProjetFormDialog } from "@/components/projets/ProjetFormDialog"
import { formatDate, formatMAD } from "@/lib/utils"
import { PROJET_TYPES } from "@/types"

export default function ProjetsPage() {
  const { active: projets } = useProjets()
  const { can } = useAuth()
  const navigate = useNavigate()

  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState<"active" | "all">("active")
  const showPrices = can("dashboard.viewFinancials")

  const filtered = useMemo(() => {
    return projets.filter((p) => {
      if (statusFilter === "active" && ["completed", "cancelled"].includes(p.status)) return false
      if (typeFilter !== "all" && p.type !== typeFilter) return false
      if (search) {
        const q = search.toLowerCase()
        const hay = `${p.reference} ${p.clientName}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [projets, statusFilter, typeFilter, search])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Projets</h1>
          <p className="text-sm text-muted-foreground">
            Ads, sites web, community management, design & tout-en-un — {filtered.length} projet(s)
          </p>
        </div>
        {can("projets.create") && <ProjetFormDialog />}
      </div>

      <Card>
        <CardContent className="flex flex-wrap items-end gap-3 p-4">
          <div className="relative min-w-[220px] flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-8"
              placeholder="Rechercher par référence ou client..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="w-44">
            <SelectNative value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="all">Tous les types</option>
              {PROJET_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </SelectNative>
          </div>
          <div className="w-40">
            <SelectNative value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as "active" | "all")}>
              <option value="active">Actifs</option>
              <option value="all">Tous</option>
            </SelectNative>
          </div>
        </CardContent>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Référence</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Type</TableHead>
              {showPrices && <TableHead>Prix</TableHead>}
              <TableHead>Statut</TableHead>
              <TableHead>Échéance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((p) => (
              <TableRow key={p.id} className="cursor-pointer" onClick={() => navigate(`/projets/${p.id}`)}>
                <TableCell className="font-medium">{p.reference}</TableCell>
                <TableCell>{p.clientName}</TableCell>
                <TableCell>{PROJET_TYPES.find((t) => t.value === p.type)?.label}</TableCell>
                {showPrices && <TableCell>{formatMAD(p.price)}</TableCell>}
                <TableCell>
                  <ProjetStatusBadge status={p.status} />
                </TableCell>
                <TableCell>{formatDate(p.dueDate)}</TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                  Aucun projet ne correspond à ces filtres.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
