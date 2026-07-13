import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * A plain native <select> styled to match the rest of the shadcn-style
 * inputs. Simpler and more reliable than the full Radix Select for a
 * data-heavy admin tool like this one — every browser/screen reader
 * handles it natively, no extra JS needed.
 */
export interface SelectNativeProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export const SelectNative = React.forwardRef<HTMLSelectElement, SelectNativeProps>(
  ({ className, children, ...props }, ref) => (
    <div className="relative">
      <select
        ref={ref}
        className={cn(
          "flex h-9 w-full appearance-none rounded-md border border-input bg-background px-3 py-1 pr-8 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
    </div>
  )
)
SelectNative.displayName = "SelectNative"
