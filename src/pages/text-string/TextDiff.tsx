import { useState, useMemo } from "react"
import { diffLines, diffWords } from "diff"
import { ToolCard } from "@/components/layout/ToolCard"

export default function TextDiff() {
  const [original, setOriginal] = useState("")
  const [modified, setModified] = useState("")
  const [mode, setMode] = useState<"lines" | "words">("lines")

  const changes = useMemo(() => {
    if (!original && !modified) return []
    return mode === "lines" ? diffLines(original, modified) : diffWords(original, modified)
  }, [original, modified, mode])

  const stats = useMemo(() => {
    let added = 0, removed = 0
    changes.forEach((c) => { if (c.added) added += c.count || 0; if (c.removed) removed += c.count || 0 })
    return { added, removed }
  }, [changes])

  return (
    <ToolCard title="Text Diff" description="Compare two texts and highlight differences" categoryId="text-string">
      <div className="space-y-4">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Original</label>
            <textarea value={original} onChange={(e) => setOriginal(e.target.value)} placeholder="Paste original text..." className="w-full h-48 rounded-lg border bg-background p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Modified</label>
            <textarea value={modified} onChange={(e) => setModified(e.target.value)} placeholder="Paste modified text..." className="w-full h-48 rounded-lg border bg-background p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-sm text-muted-foreground">Mode:</label>
            <select value={mode} onChange={(e) => setMode(e.target.value as "lines" | "words")} className="rounded-md border bg-background px-2 py-1 text-sm">
              <option value="lines">Lines</option>
              <option value="words">Words</option>
            </select>
          </div>
          {changes.length > 0 && (
            <div className="flex gap-3 text-xs">
              <span className="text-green-600">+{stats.added} added</span>
              <span className="text-red-600">-{stats.removed} removed</span>
            </div>
          )}
        </div>
        {changes.length > 0 && (
          <div className="rounded-lg border bg-muted/50 p-3 font-mono text-sm overflow-auto max-h-96 whitespace-pre-wrap">
            {changes.map((part, i) => (
              <span key={i} className={part.added ? "bg-green-500/20 text-green-700 dark:text-green-400" : part.removed ? "bg-red-500/20 text-red-700 dark:text-red-400 line-through" : ""}>
                {part.value}
              </span>
            ))}
          </div>
        )}
      </div>
    </ToolCard>
  )
}
