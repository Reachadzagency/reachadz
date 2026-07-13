import { Order, OrderStatus, Projet, TeamMember, Expense } from "@/types"

/**
 * Revenue / payout math for the Dashboard & Analytics pages.
 *
 * Assumptions (auto-calculated mode, as requested) — tell us if any of
 * these should change and we'll adjust in one place:
 *  - Order value = pricePerVideo × numberOfVideos.
 *  - Freelance editors/filmmakers are paid their flat `rate` per VIDEO
 *    they are assigned on (from Team > rate field), regardless of order price.
 *  - Salaried team members' monthlySalary is counted as a fee once per month.
 *  - Net Revenue = order/projet revenue this month − freelancer payouts
 *    this month − monthly salaries − manual Expenses entries this month.
 *  - Net to Withdraw = Net Revenue (no separate reserve logic yet — add
 *    rules here if you want a % held back automatically).
 */

const ACTIVE_STATUSES: OrderStatus[] = [
  "new_order",
  "in_script",
  "in_filming",
  "in_editing",
  "revision",
  "delivery",
]
const DONE_STATUSES: OrderStatus[] = ["delivered", "completed"]

export function isSameMonth(dateIso: string, ref: Date = new Date()): boolean {
  const d = new Date(dateIso)
  return d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth()
}

export function orderValue(order: Order): number {
  return order.pricePerVideo * order.numberOfVideos
}

export function getMonthlyOrdersCount(orders: Order[]): number {
  return orders.filter((o) => !o.deletedAt && isSameMonth(o.createdAt)).length
}

export function getMonthlyVideosSold(orders: Order[]): number {
  return orders
    .filter((o) => !o.deletedAt && isSameMonth(o.createdAt) && o.status !== "cancelled")
    .reduce((sum, o) => sum + o.numberOfVideos, 0)
}

export function getCancelledValue(orders: Order[]): number {
  return orders
    .filter((o) => !o.deletedAt && o.status === "cancelled")
    .reduce((sum, o) => sum + orderValue(o), 0)
}

export function getActiveVsCompleted(orders: Order[]) {
  const active = orders.filter((o) => !o.deletedAt && ACTIVE_STATUSES.includes(o.status)).length
  const completed = orders.filter((o) => !o.deletedAt && DONE_STATUSES.includes(o.status)).length
  return { active, completed }
}

export function getFreelancerPayouts(orders: Order[], team: TeamMember[]): number {
  const rateByEditor = new Map(team.map((t) => [t.id, t]))
  let total = 0
  for (const order of orders) {
    if (order.deletedAt || !isSameMonth(order.createdAt)) continue
    for (const video of order.videos) {
      if (!video.editorId) continue
      const member = rateByEditor.get(video.editorId)
      if (member && member.paymentType === "freelancer") {
        total += member.rate
      }
    }
  }
  return total
}

export function getMonthlySalariesTotal(team: TeamMember[]): number {
  return team
    .filter((t) => !t.deletedAt && t.paymentType !== "freelancer" && t.active)
    .reduce((sum, t) => sum + (t.monthlySalary ?? 0), 0)
}

export function getMonthlyExpensesTotal(expenses: Expense[]): number {
  return expenses.filter((e) => !e.deletedAt && isSameMonth(e.date)).reduce((s, e) => s + e.amount, 0)
}

export function getMonthlyOrderRevenue(orders: Order[]): number {
  return orders
    .filter((o) => !o.deletedAt && isSameMonth(o.createdAt) && o.status !== "cancelled")
    .reduce((sum, o) => sum + orderValue(o), 0)
}

export function getMonthlyProjetRevenue(projets: Projet[]): number {
  return projets
    .filter((p) => !p.deletedAt && isSameMonth(p.createdAt) && p.status !== "cancelled")
    .reduce((sum, p) => sum + p.price, 0)
}

export function getNetRevenue(
  orders: Order[],
  projets: Projet[],
  team: TeamMember[],
  expenses: Expense[]
): number {
  const revenue = getMonthlyOrderRevenue(orders) + getMonthlyProjetRevenue(projets)
  const payouts = getFreelancerPayouts(orders, team)
  const salaries = getMonthlySalariesTotal(team)
  const expensesTotal = getMonthlyExpensesTotal(expenses)
  return revenue - payouts - salaries - expensesTotal
}

export function getStatusDistribution(orders: Order[]) {
  const counts: Record<string, number> = {}
  for (const o of orders) {
    if (o.deletedAt) continue
    counts[o.status] = (counts[o.status] ?? 0) + 1
  }
  return counts
}

export function getRevenueSeries(orders: Order[], days = 14) {
  const series: { date: string; revenue: number }[] = []
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const dayKey = d.toISOString().slice(0, 10)
    const revenue = orders
      .filter((o) => !o.deletedAt && o.createdAt.slice(0, 10) === dayKey && o.status !== "cancelled")
      .reduce((sum, o) => sum + orderValue(o), 0)
    series.push({ date: dayKey, revenue })
  }
  return series
}

export function isEditorBusy(memberId: string, orders: Order[]): boolean {
  return orders.some(
    (o) =>
      !o.deletedAt &&
      o.videos.some(
        (v) => v.editorId === memberId && !["completed", "delivered", "cancelled"].includes(v.status)
      )
  )
}
