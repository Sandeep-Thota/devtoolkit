import { useState, useMemo } from "react"
import { CronExpressionParser } from "cron-parser"
import { ToolCard } from "@/components/layout/ToolCard"

const presets = [
  { label: "Every minute", value: "* * * * *" },
  { label: "Every hour", value: "0 * * * *" },
  { label: "Every day at midnight", value: "0 0 * * *" },
  { label: "Every Monday 9am", value: "0 9 * * 1" },
  { label: "Every weekday 9am", value: "0 9 * * 1-5" },
  { label: "Every 5 minutes", value: "*/5 * * * *" },
  { label: "Every month 1st", value: "0 0 1 * *" },
]

function describeField(value: string, type: string): string {
  if (value === "*") return `every ${type}`
  if (value.startsWith("*/")) return `every ${value.slice(2)} ${type}s`
  return value
}

export default function CronParser() {
  const [input, setInput] = useState("0 9 * * 1-5")

  const result = useMemo(() => {
    if (!input.trim()) return null
    try {
      const interval = CronExpressionParser.parse(input.trim())
      const nextRuns: string[] = []
      for (let i = 0; i < 10; i++) {
        nextRuns.push(interval.next().toDate().toLocaleString())
      }
      const parts = input.trim().split(/\s+/)
      const fields = ["minute", "hour", "day of month", "month", "day of week"]
      const description = parts.map((p, i) => describeField(p, fields[i] || "")).join(", ")
      return { nextRuns, parts, fields, description, error: "" }
    } catch (e) {
      return { nextRuns: [], parts: [], fields: [], description: "", error: (e as Error).message }
    }
  }, [input])

  return (
    <ToolCard title="Cron Parser" description="Parse cron expressions and see next run times" categoryId="network-api">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Cron Expression</label>
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="* * * * *" className="w-full rounded-lg border bg-background px-3 py-2 font-mono text-lg text-center tracking-wider focus:outline-none focus:ring-2 focus:ring-ring" spellCheck={false} />
          {result?.error && <p className="text-sm text-destructive">{result.error}</p>}
        </div>
        <div className="flex flex-wrap gap-2">
          {presets.map((p) => (
            <button key={p.value} onClick={() => setInput(p.value)} className={`rounded-md border px-3 py-1 text-xs transition-colors ${input === p.value ? "bg-primary text-primary-foreground border-primary" : "hover:bg-accent"}`}>
              {p.label}
            </button>
          ))}
        </div>
        {result && !result.error && (
          <>
            <div className="grid grid-cols-5 gap-2 text-center">
              {result.fields.map((field, i) => (
                <div key={field} className="rounded-lg border p-2">
                  <div className="font-mono text-lg font-bold">{result.parts[i]}</div>
                  <div className="text-[10px] text-muted-foreground capitalize">{field}</div>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Next 10 Runs</label>
              <div className="rounded-lg border divide-y">
                {result.nextRuns.map((run, i) => (
                  <div key={i} className="px-3 py-1.5 text-sm font-mono flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-6">{i + 1}.</span>
                    {run}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </ToolCard>
  )
}
