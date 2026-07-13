import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { useClients } from "@/context/ClientsContext"
import { useOrders } from "@/context/OrdersContext"
import { useProjets } from "@/context/ProjetsContext"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ClientFormDialog } from "@/components/clients/ClientFormDialog"
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge"
import { ProjetStatusBadge } from "@/components/projets/ProjetStatusBadge"
import { formatDate, formatMAD } from "@/lib/utils"
import { orderValue } from "@/lib/calculations"

export default function ClientDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { items: clients } = useClients()
  const { active: orders } = useOrders()
  const { active: projets } = useProjets()
  const { can } = useAuth()

  const client = clients.find((c) => c.id === id)
  const showPrices = can("dashboard.viewFinancials")

  if (!client) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/clients")}>
          <ArrowLeft className="h-4 w-4" /> Retour
        </Button>
        <p className="text-muted-foreground">Client introuvable.</p>
      </div>
    )
  }

  const clientOrders = orders.filter((o) => o.clientId === client.id)
  const clientProjets = projets.filter((p) => p.clientId === client.id)
  const totalRevenue =
    clientOrders.reduce((s, o) => s + orderValue(o), 0) + clientProjets.reduce((s, p) => s + p.price, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate("/clients")}>
          <ArrowLeft className="h-4 w-4" /> Retour aux clients
        </Button>
        {can("clients.edit") && <ClientFormDialog client={client} trigger={<Button variant="outline">Modifier</Button>} />}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{client.name}</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
          <div>
            <p className="text-muted-foreground">Ville</p>
            <p className="font-medium">{client.city}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Téléphone</p>
            <p className="font-medium">{client.phone}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Email</p>
            <p className="font-medium">{client.email || "—"}</p>
          </div>
          {showPrices && (
            <div>
              <p className="text-muted-foreground">Revenu total</p>
              <p className="font-medium text-success">{formatMAD(totalRevenue)}</p>
            </div>
          )}
          {client.notes && (
            <div className="sm:col-span-4">
              <p className="text-muted-foreground">Notes</p>
              <p className="font-medium">{client.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Commandes vidéos ({clientOrders.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {clientOrders.map((o) => (
            <div
              key={o.id}
              className="flex cursor-pointer items-center justify-between rounded-md border p-2.5 text-sm hover:bg-muted/50"
              onClick={() => navigate(`/orders/${o.id}`)}
            >
              <span className="font-medium">{o.orderNumber}</span>
              <span className="text-muted-foreground">{formatDate(o.maxDeliveryDate)}</span>
              <OrderStatusBadge status={o.status} />
            </div>
          ))}
          {clientOrders.length === 0 && <p className="text-sm text-muted-foreground">Aucune commande.</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Projets ({clientProjets.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {clientProjets.map((p) => (
            <div
              key={p.id}
              className="flex cursor-pointer items-center justify-between rounded-md border p-2.5 text-sm hover:bg-muted/50"
              onClick={() => navigate(`/projets/${p.id}`)}
            >
              <span className="font-medium">{p.reference}</span>
              <span className="text-muted-foreground">{formatDate(p.dueDate)}</span>
              <ProjetStatusBadge status={p.status} />
            </div>
          ))}
          {clientProjets.length === 0 && <p className="text-sm text-muted-foreground">Aucun projet.</p>}
        </CardContent>
      </Card>
    </div>
  )
}
