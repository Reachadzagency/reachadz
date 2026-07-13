import { useMemo, useState } from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import interactionPlugin from "@fullcalendar/interaction"
import { useNavigate } from "react-router-dom"
import { useOrders } from "@/context/OrdersContext"
import { useProjets } from "@/context/ProjetsContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ORDER_STATUSES, PROJET_STATUSES } from "@/types"

export default function CalendarPage() {
  const { active: orders } = useOrders()
  const { active: projets } = useProjets()
  const navigate = useNavigate()
  const [selected, setSelected] = useState<{ title: string; type: "order" | "projet"; id: string } | null>(null)

  const events = useMemo(() => {
    const orderEvents = orders.map((o) => {
      const meta = ORDER_STATUSES.find((s) => s.value === o.status)
      return {
        id: `order-${o.id}`,
        title: `🎬 ${o.orderNumber} — ${o.clientName}`,
        date: o.maxDeliveryDate.slice(0, 10),
        color: meta?.color,
        extendedProps: { type: "order" as const, refId: o.id },
      }
    })
    const projetEvents = projets.map((p) => {
      const meta = PROJET_STATUSES.find((s) => s.value === p.status)
      return {
        id: `projet-${p.id}`,
        title: `📁 ${p.reference} — ${p.clientName}`,
        date: p.dueDate.slice(0, 10),
        color: meta?.color,
        extendedProps: { type: "projet" as const, refId: p.id },
      }
    })
    return [...orderEvents, ...projetEvents]
  }, [orders, projets])

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Calendrier</h1>
        <p className="text-sm text-muted-foreground">
          Échéances des commandes vidéos et des projets, colorées par statut.
        </p>
      </div>

      <Card>
        <CardContent className="p-4">
          <style>{`
            .fc { font-family: inherit; font-size: 0.85rem; }
            .fc .fc-toolbar-title { font-size: 1.1rem; font-weight: 600; }
            .fc-theme-standard td, .fc-theme-standard th { border-color: hsl(var(--border)); }
            .fc-daygrid-day-number { color: hsl(var(--foreground)); }
            .fc-day-today { background: hsl(var(--primary) / 0.06) !important; }
            .fc-button { background: hsl(var(--primary)) !important; border: none !important; }
            .fc-event { cursor: pointer; border: none; padding: 1px 4px; }
          `}</style>
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            height="auto"
            headerToolbar={{ left: "prev,next today", center: "title", right: "dayGridMonth,dayGridWeek" }}
            events={events}
            eventClick={(info) => {
              const { type, refId } = info.event.extendedProps as { type: "order" | "projet"; refId: string }
              setSelected({ title: info.event.title, type, id: refId })
            }}
          />
        </CardContent>
      </Card>

      {selected && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{selected.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <button
              className="text-sm text-primary hover:underline"
              onClick={() => navigate(selected.type === "order" ? `/orders/${selected.id}` : `/projets/${selected.id}`)}
            >
              Ouvrir {selected.type === "order" ? "la commande" : "le projet"} →
            </button>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        {ORDER_STATUSES.map((s) => (
          <span key={s.value} className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
            {s.label}
          </span>
        ))}
      </div>
    </div>
  )
}
