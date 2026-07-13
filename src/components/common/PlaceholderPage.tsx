import { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

/**
 * Temporary stand-in so every nav link works and doesn't crash while we
 * build each module page by page. Each one gets replaced by its real page
 * (see the task list) — this is not meant to stay in the final app.
 */
export function PlaceholderPage({
  title,
  description,
  icon: Icon,
}: {
  title: string
  description: string
  icon: LucideIcon
}) {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon className="h-6 w-6" />
          </div>
          <p className="max-w-sm text-sm text-muted-foreground">
            Ce module arrive bientôt — on le construit à l'étape suivante.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
