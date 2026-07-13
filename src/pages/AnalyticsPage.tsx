import { useMemo } from "react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"
import { useOrders } from "@/context/OrdersContext"
import { useProjets } from "@/context/ProjetsContext"
import { useTeam } from "@/context/TeamContext"
import { useClients } from "@/context/ClientsContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { formatMAD } from "@/lib/utils"
import { orderValue } from "@/lib/calculations"

export default function AnalyticsPage() {
  const { active: orders } = useOrders()
  const { active: projets } = useProjets()
  const { active: team } = useTeam()
  const { active: clients } = useClients()

  const monthlyRevenue = useMemo(() => {
    const months: Record<string, number> = {}
    for (const o of orders) {
      if (o.status === "cancelled") continue
      const key = o.createdAt.slice(0, 7)
      months[key] = (months[key] ?? 0) + orderValue(o)
    }
    for (const p of projets) {
      if (p.status === "cancelled") continue
      const key = p.createdAt.slice(0, 7)
      months[key] = (months[key] ?? 0) + p.price
    }
    return Object.entries(months)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, revenue]) => ({ month, revenue }))
  }, [orders, projets])

  const editorPerformance = useMemo(() => {
    return team
      .filter((t) => t.function === "editor" || t.function === "filmmaker")
      .map((member) => {
        const completedVideos = orders.flatMap((o) => o.videos).filter((v) => v.editorId === member.id && v.status === "completed")
        return { name: member.fullName, videos: completedVideos.length }
      })
      .sort((a, b) => b.videos - a.videos)
  }, [team, orders])

  const clientAnalytics = useMemo(() => {
    return clients
      .map((c) => {
        const clientOrders = orders.filter((o) => o.clientId === c.id)
        const clientProjets = projets.filter((p) => p.clientId === c.id)
        const revenue = clientOrders.reduce((s, o) => s + orderValue(o), 0) + clientProjets.reduce((s, p) => s + p.price, 0)
        return { name: c.name, count: clientOrders.length + clientProjets.length, revenue }
      })
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10)
  }, [clients, orders, projets])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Analytique</h1>
        <p className="text-sm text-muted-foreground">Tendances de revenu, performance des éditeurs, top clients.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Revenu mensuel</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={70} tickFormatter={(v) => `${v} MAD`} />
              <Tooltip formatter={(v: number) => formatMAD(v)} />
              <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Performance éditeurs (vidéos terminées)</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={editorPerformance} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-border" />
                <XAxis type="number" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={100} />
                <Tooltip />
                <Bar dataKey="videos" fill="hsl(var(--success))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top clients</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Commandes/Projets</TableHead>
                  <TableHead>Revenu</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientAnalytics.map((c) => (
                  <TableRow key={c.name}>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell>{c.count}</TableCell>
                    <TableCell>{formatMAD(c.revenue)}</TableCell>
                  </TableRow>
                ))}
                {clientAnalytics.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="py-8 text-center text-muted-foreground">
                      Pas encore de données.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
