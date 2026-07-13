import { ORDER_STATUSES, OrderStatus } from "@/types"

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const meta = ORDER_STATUSES.find((s) => s.value === status)
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold text-white"
      style={{ backgroundColor: meta?.color ?? "#64748b" }}
    >
      {meta?.label ?? status}
    </span>
  )
}
