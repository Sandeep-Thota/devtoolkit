import { useState, useMemo } from "react"
import { ToolCard } from "@/components/layout/ToolCard"

export default function RegexTester() {
  const [pattern, setPattern] = useState("")
  const [flags, setFlags] = useState("g")
  const [testString, setTestString] = useState("")

  const toggleFlag = (flag: string) => {
    setFlags((prev) =>
      prev.includes(flag) ? prev.replace(flag, "") : prev + flag
    )
  }

  const { matches, error, highlightedHtml } = useMemo(() => {
    if (!pattern || !testString) return { matches: [], error: "", highlightedHtml: "" }

    try {
      const regex = new RegExp(pattern, flags)
      const allMatches: { match: string; index: number; groups: string[] }[] = []

      if (flags.includes("g")) {
        let m
        while ((m = regex.exec(testString)) !== null) {
          allMatches.push({
            match: m[0],
            index: m.index,
            groups: m.slice(1),
          })
          if (m[0].length === 0) regex.lastIndex++
        }
      } else {
        const m = regex.exec(testString)
        if (m) {
          allMatches.push({
            match: m[0],
            index: m.index,
            groups: m.slice(1),
          })
        }
      }

      // Build highlighted HTML
      let html = ""
      let lastIndex = 0
      const colors = ["bg-yellow-300/50 dark:bg-yellow-500/30", "bg-blue-300/50 dark:bg-blue-500/30", "bg-green-300/50 dark:bg-green-500/30", "bg-pink-300/50 dark:bg-pink-500/30"]

      for (let i = 0; i < allMatches.length; i++) {
        const m = allMatches[i]
        html += escapeHtml(testString.slice(lastIndex, m.index))
        html += `<mark class="${colors[i % colors.length]} rounded px-0.5">${escapeHtml(m.match)}</mark>`
        lastIndex = m.index + m.match.length
      }
      html += escapeHtml(testString.slice(lastIndex))

      return { matches: allMatches, error: "", highlightedHtml: html }
    } catch (e) {
      return { matches: [], error: (e as Error).message, highlightedHtml: "" }
    }
  }, [pattern, flags, testString])

  return (
    <ToolCard
      title="Regex Tester"
      description="Test regular expressions with live matching"
      categoryId="text-string"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Pattern</label>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground font-mono">/</span>
            <input
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="Enter regex pattern..."
              className="flex-1 rounded-lg border bg-background px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              spellCheck={false}
            />
            <span className="text-muted-foreground font-mono">/{flags}</span>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            { flag: "g", label: "Global" },
            { flag: "i", label: "Case Insensitive" },
            { flag: "m", label: "Multiline" },
            { flag: "s", label: "Dotall" },
            { flag: "u", label: "Unicode" },
          ].map(({ flag, label }) => (
            <button
              key={flag}
              onClick={() => toggleFlag(flag)}
              className={`rounded-md border px-3 py-1 text-xs font-medium transition-colors ${
                flags.includes(flag)
                  ? "bg-primary text-primary-foreground border-primary"
                  : "hover:bg-accent"
              }`}
            >
              {flag} - {label}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Test String</label>
          <textarea
            value={testString}
            onChange={(e) => setTestString(e.target.value)}
            placeholder="Enter text to test against..."
            className="w-full h-40 rounded-lg border bg-background p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {highlightedHtml && (
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Matches ({matches.length})
            </label>
            <div
              className="rounded-lg border bg-muted/50 p-3 text-sm whitespace-pre-wrap font-mono"
              dangerouslySetInnerHTML={{ __html: highlightedHtml }}
            />
          </div>
        )}

        {matches.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Match Details</label>
            <div className="rounded-lg border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-3 py-2 text-left font-medium">#</th>
                    <th className="px-3 py-2 text-left font-medium">Match</th>
                    <th className="px-3 py-2 text-left font-medium">Index</th>
                    <th className="px-3 py-2 text-left font-medium">Groups</th>
                  </tr>
                </thead>
                <tbody>
                  {matches.map((m, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="px-3 py-2 text-muted-foreground">{i + 1}</td>
                      <td className="px-3 py-2 font-mono">{m.match}</td>
                      <td className="px-3 py-2 text-muted-foreground">{m.index}</td>
                      <td className="px-3 py-2 font-mono text-muted-foreground">
                        {m.groups.length > 0 ? m.groups.join(", ") : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </ToolCard>
  )
}

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}
