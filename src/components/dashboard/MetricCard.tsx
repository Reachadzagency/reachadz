import { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface MetricCardProps {
  label: string
  value: string
  icon: LucideIcon
  tone?: "default" | "success" | "destructive"
  hint?: string
}

export function MetricCard({ label, value, icon: Icon, tone = "default", hint }: MetricCardProps) {
  return (
    <Card>
      <CardContent className="flex items-start justify-between p-5">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p
            className={cn(
              "mt-1 text-2xl font-semibold tracking-tight",
              tone === "success" && "text-success",
              tone === "destructive" && "text-destructive"
            )}
          >
            {value}
          </p>
          {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
        </div>
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-lg",
            tone === "success" && "bg-success/10 text-success",
            tone === "destructive" && "bg-destructive/10 text-destructive",
            tone === "default" && "bg-primary/10 text-primary"
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  )
}
