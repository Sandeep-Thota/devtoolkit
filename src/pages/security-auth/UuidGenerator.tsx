import { useState, useCallback } from "react"
import { v4 as uuidv4 } from "uuid"
import { RefreshCw } from "lucide-react"
import { ToolCard } from "@/components/layout/ToolCard"
import { CopyButton } from "@/components/shared/CopyButton"
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard"

export default function UuidGenerator() {
  const [uuids, setUuids] = useState<string[]>([])
  const [count, setCount] = useState(1)
  const [uppercase, setUppercase] = useState(false)
  const { copy, copied } = useCopyToClipboard()

  const generate = useCallback(() => {
    const generated = Array.from({ length: count }, () => {
      const id = uuidv4()
      return uppercase ? id.toUpperCase() : id
    })
    setUuids(generated)
  }, [count, uppercase])

  return (
    <ToolCard title="UUID Generator" description="Generate UUID v4 identifiers" categoryId="security-auth">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-sm text-muted-foreground">Count:</label>
            <select value={count} onChange={(e) => setCount(Number(e.target.value))} className="rounded-md border bg-background px-2 py-1 text-sm">
              {[1, 5, 10, 25, 50].map((n) => (<option key={n} value={n}>{n}</option>))}
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={uppercase} onChange={(e) => setUppercase(e.target.checked)} className="rounded" />
            Uppercase
          </label>
          <button onClick={generate} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
            <RefreshCw className="h-4 w-4" /> Generate
          </button>
          {uuids.length > 1 && (
            <button onClick={() => copy(uuids.join("\n"))} className="rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors">
              {copied ? "Copied All!" : "Copy All"}
            </button>
          )}
        </div>
        {uuids.length > 0 && (
          <div className="space-y-2">
            {uuids.map((id, i) => (
              <div key={i} className="flex items-center gap-2 rounded-lg border p-2">
                <code className="flex-1 text-sm">{id}</code>
                <CopyButton text={id} />
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolCard>
  )
}
