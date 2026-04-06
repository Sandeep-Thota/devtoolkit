import { useState, useMemo } from "react"
import { ToolCard } from "@/components/layout/ToolCard"

export default function WordCounter() {
  const [input, setInput] = useState("")

  const stats = useMemo(() => {
    const text = input
    const characters = text.length
    const charactersNoSpaces = text.replace(/\s/g, "").length
    const words = text.trim() ? text.trim().split(/\s+/).length : 0
    const sentences = text.trim() ? text.split(/[.!?]+/).filter((s) => s.trim()).length : 0
    const paragraphs = text.trim() ? text.split(/\n\s*\n/).filter((p) => p.trim()).length : 0
    const readingTime = Math.max(1, Math.ceil(words / 200))
    const speakingTime = Math.max(1, Math.ceil(words / 130))

    // Keyword density
    const wordList = text.toLowerCase().trim().split(/\s+/).filter(Boolean)
    const freq: Record<string, number> = {}
    for (const w of wordList) {
      const clean = w.replace(/[^a-z0-9]/g, "")
      if (clean.length > 2) freq[clean] = (freq[clean] || 0) + 1
    }
    const topWords = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 10)

    return { characters, charactersNoSpaces, words, sentences, paragraphs, readingTime, speakingTime, topWords }
  }, [input])

  return (
    <ToolCard title="Word Counter" description="Count words, characters, sentences, and reading time" categoryId="text-string">
      <div className="space-y-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Start typing or paste text here..."
          className="w-full h-48 rounded-lg border bg-background p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Words", value: stats.words },
            { label: "Characters", value: stats.characters },
            { label: "No Spaces", value: stats.charactersNoSpaces },
            { label: "Sentences", value: stats.sentences },
            { label: "Paragraphs", value: stats.paragraphs },
            { label: "Reading Time", value: `${stats.readingTime} min` },
            { label: "Speaking Time", value: `${stats.speakingTime} min` },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-lg border p-3 text-center">
              <div className="text-2xl font-bold">{value}</div>
              <div className="text-xs text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>
        {stats.topWords.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Top Words</label>
            <div className="rounded-lg border overflow-hidden">
              <table className="w-full text-sm">
                <thead><tr className="border-b bg-muted/50"><th className="px-3 py-2 text-left font-medium">Word</th><th className="px-3 py-2 text-left font-medium">Count</th><th className="px-3 py-2 text-left font-medium">Density</th></tr></thead>
                <tbody>
                  {stats.topWords.map(([word, count]) => (
                    <tr key={word} className="border-b last:border-0">
                      <td className="px-3 py-1.5 font-mono">{word}</td>
                      <td className="px-3 py-1.5">{count}</td>
                      <td className="px-3 py-1.5 text-muted-foreground">{((count / stats.words) * 100).toFixed(1)}%</td>
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
