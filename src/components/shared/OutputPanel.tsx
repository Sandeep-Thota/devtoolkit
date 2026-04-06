import { CopyButton } from "./CopyButton"
import { cn } from "@/lib/utils"

interface OutputPanelProps {
  value: string
  label?: string
  className?: string
  mono?: boolean
}

export function OutputPanel({ value, label, className, mono = true }: OutputPanelProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">{label}</label>
          {value && <CopyButton text={value} />}
        </div>
      )}
      <div
        className={cn(
          "min-h-[120px] w-full rounded-lg border bg-muted/50 p-3 text-sm whitespace-pre-wrap break-all",
          mono && "font-mono text-xs",
          !value && "text-muted-foreground"
        )}
      >
        {value || "Output will appear here..."}
      </div>
    </div>
  )
}
