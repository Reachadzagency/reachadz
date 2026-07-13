import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Search } from "lucide-react"
import { useClients } from "@/context/ClientsContext"
import { useOrders } from "@/context/OrdersContext"
import { useProjets } from "@/context/ProjetsContext"
import { useAuth } from "@/context/AuthContext"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { ClientFormDialog } from "@/components/clients/ClientFormDialog"
import { orderValue } from "@/lib/calculations"
import { formatMAD } from "@/lib/utils"

export default function ClientsPage() {
  const { active: clients } = useClients()
  const { active: orders } = useOrders()
  const { active: projets } = useProjets()
  const { can } = useAuth()
  const navigate = useNavigate()
  const [search, setSearch] = useState("")
  const showPrices = can("dashboard.viewFinancials")

  const rows = useMemo(() => {
    return clients
      .filter((c) => {
        if (!search) return true
        const q = search.toLowerCase()
        return `${c.name} ${c.city} ${c.phone}`.toLowerCase().includes(q)
      })
      .map((c) => {
        const clientOrders = orders.filter((o) => o.clientId === c.id)
        const clientProjets = projets.filter((p) => p.clientId === c.id)
        const revenue =
          clientOrders.reduce((s, o) => s + orderValue(o), 0) + clientProjets.reduce((s, p) => s + p.price, 0)
        return { client: c, count: clientOrders.length + clientProjets.length, revenue }
      })
  }, [clients, orders, projets, search])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Clients</h1>
          <p className="text-sm text-muted-foreground">{rows.length} client(s)</p>
        </div>
        {can("clients.edit") && <ClientFormDialog />}
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input className="pl-8" placeholder="Rechercher un client..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Ville</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Commandes / Projets</TableHead>
              {showPrices && <TableHead>Revenu total</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map(({ client, count, revenue }) => (
              <TableRow key={client.id} className="cursor-pointer" onClick={() => navigate(`/clients/${client.id}`)}>
                <TableCell className="font-medium">{client.name}</TableCell>
                <TableCell>{client.city}</TableCell>
                <TableCell>{client.phone}</TableCell>
                <TableCell>{count}</TableCell>
                {showPrices && <TableCell>{formatMAD(revenue)}</TableCell>}
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                  Aucun client trouvé.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
