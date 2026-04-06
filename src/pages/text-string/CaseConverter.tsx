import { useState } from "react"
import { ToolCard } from "@/components/layout/ToolCard"
import { CopyButton } from "@/components/shared/CopyButton"

function toWords(str: string): string[] {
  return str.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[_\-]+/g, " ").trim().split(/\s+/)
}

const converters: { label: string; fn: (s: string) => string }[] = [
  { label: "UPPERCASE", fn: (s) => s.toUpperCase() },
  { label: "lowercase", fn: (s) => s.toLowerCase() },
  { label: "Title Case", fn: (s) => toWords(s).map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ") },
  { label: "Sentence case", fn: (s) => { const l = s.toLowerCase(); return l.charAt(0).toUpperCase() + l.slice(1) } },
  { label: "camelCase", fn: (s) => { const w = toWords(s); return w[0].toLowerCase() + w.slice(1).map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join("") } },
  { label: "PascalCase", fn: (s) => toWords(s).map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join("") },
  { label: "snake_case", fn: (s) => toWords(s).map((w) => w.toLowerCase()).join("_") },
  { label: "kebab-case", fn: (s) => toWords(s).map((w) => w.toLowerCase()).join("-") },
  { label: "CONSTANT_CASE", fn: (s) => toWords(s).map((w) => w.toUpperCase()).join("_") },
]

export default function CaseConverter() {
  const [input, setInput] = useState("")

  return (
    <ToolCard title="Case Converter" description="Convert text between cases" categoryId="text-string">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Input</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter text to convert..." className="w-full h-24 rounded-lg border bg-background p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        {input.trim() && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {converters.map(({ label, fn }) => {
              const result = fn(input)
              return (
                <div key={label} className="rounded-lg border p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">{label}</span>
                    <CopyButton text={result} />
                  </div>
                  <div className="font-mono text-sm break-all">{result}</div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </ToolCard>
  )
}
