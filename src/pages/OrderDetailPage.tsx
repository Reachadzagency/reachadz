import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Send, CheckCircle2 } from "lucide-react"
import { useOrders } from "@/context/OrdersContext"
import { useTeam } from "@/context/TeamContext"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { SelectNative } from "@/components/ui/select-native"
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge"
import { OrderFormDialog } from "@/components/orders/OrderFormDialog"
import { formatDate, formatMAD } from "@/lib/utils"
import { ORDER_STATUSES } from "@/types"

export default function OrderDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { items: orders, updateVideo, update } = useOrders()
  const { active: team } = useTeam()
  const { currentUser, can } = useAuth()

  const order = orders.find((o) => o.id === id)
  const showPrices = can("dashboard.viewFinancials")
  const isEditor = currentUser?.role === "editor"
  const editors = team.filter((t) => t.function === "editor")

  if (!order) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/orders")}>
          <ArrowLeft className="h-4 w-4" /> Retour
        </Button>
        <p className="text-muted-foreground">Commande introuvable (peut-être supprimée).</p>
      </div>
    )
  }

  const editorName = (edId?: string) => team.find((t) => t.id === edId)?.fullName ?? "—"

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate("/orders")}>
          <ArrowLeft className="h-4 w-4" /> Retour aux commandes
        </Button>
        {can("orders.edit") && <OrderFormDialog order={order} trigger={<Button variant="outline">Modifier</Button>} />}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-xl">{order.orderNumber}</CardTitle>
              <p className="text-sm text-muted-foreground">{order.clientName} — {order.city}</p>
            </div>
            <OrderStatusBadge status={order.status} />
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
            <div>
              <p className="text-muted-foreground">Téléphone</p>
              <p className="font-medium">{order.phone}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Projet</p>
              <p className="font-medium">{order.projetLabel || "—"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Échéance</p>
              <p className="font-medium">{formatDate(order.maxDeliveryDate)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Cadreur</p>
              <p className="font-medium">{editorName(order.filmmakerId)}</p>
            </div>
            {showPrices && (
              <div>
                <p className="text-muted-foreground">Prix / vidéo</p>
                <p className="font-medium">{formatMAD(order.pricePerVideo)}</p>
              </div>
            )}
            {showPrices && (
              <div>
                <p className="text-muted-foreground">Total commande</p>
                <p className="font-medium">{formatMAD(order.pricePerVideo * order.numberOfVideos)}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Script à valider</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="whitespace-pre-wrap text-sm text-muted-foreground">
              {order.scriptToValidate || "Aucun script renseigné."}
            </p>
            {can("orders.edit") && !order.scriptValidated && (
              <Button size="sm" variant="success" onClick={() => update(order.id, { scriptValidated: true })}>
                <CheckCircle2 className="h-4 w-4" /> Valider le script
              </Button>
            )}
            {order.scriptValidated && (
              <p className="flex items-center gap-1.5 text-xs text-success">
                <CheckCircle2 className="h-3.5 w-3.5" /> Script validé
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Vidéos ({order.videos.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {order.videos.map((video) => {
            const isMine = video.editorId === currentUser?.id
            const canSendReview = isEditor && isMine && ["in_script", "in_filming", "in_editing"].includes(video.status)
            return (
              <div key={video.id} className="grid grid-cols-1 gap-3 rounded-lg border p-3 sm:grid-cols-12 sm:items-center">
                <div className="sm:col-span-1 font-medium">#{video.index}</div>

                <div className="sm:col-span-3">
                  {isEditor ? (
                    <OrderStatusBadge status={video.status} />
                  ) : (
                    <SelectNative
                      value={video.status}
                      onChange={(e) => updateVideo(order.id, video.id, { status: e.target.value as typeof video.status })}
                    >
                      {ORDER_STATUSES.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </SelectNative>
                  )}
                </div>

                <div className="sm:col-span-3">
                  {isEditor ? (
                    <span className="text-sm text-muted-foreground">{editorName(video.editorId)}</span>
                  ) : (
                    <SelectNative
                      value={video.editorId ?? ""}
                      onChange={(e) => updateVideo(order.id, video.id, { editorId: e.target.value || undefined })}
                    >
                      <option value="">— Aucun éditeur —</option>
                      {editors.map((ed) => (
                        <option key={ed.id} value={ed.id}>
                          {ed.fullName}
                        </option>
                      ))}
                    </SelectNative>
                  )}
                </div>

                <div className="sm:col-span-4">
                  <Input
                    placeholder="Lien de livraison (Drive, WeTransfer...)"
                    defaultValue={video.deliveryLink ?? ""}
                    onBlur={(e) => updateVideo(order.id, video.id, { deliveryLink: e.target.value })}
                  />
                </div>

                <div className="sm:col-span-1 flex justify-end">
                  {canSendReview && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => updateVideo(order.id, video.id, { status: "revision" })}
                    >
                      <Send className="h-3.5 w-3.5" /> En révision
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
