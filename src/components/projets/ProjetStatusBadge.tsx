import { PROJET_STATUSES, ProjetStatus } from "@/types"

export function ProjetStatusBadge({ status }: { status: ProjetStatus }) {
  const meta = PROJET_STATUSES.find((s) => s.value === status)
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold text-white"
      style={{ backgroundColor: meta?.color ?? "#64748b" }}
    >
      {meta?.label ?? status}
    </span>
  )
}
