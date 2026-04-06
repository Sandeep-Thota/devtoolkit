import { useState } from "react"
import { ToolCard } from "@/components/layout/ToolCard"
import { CopyButton } from "@/components/shared/CopyButton"

const bases = [
  { name: "Binary", base: 2, prefix: "0b" },
  { name: "Octal", base: 8, prefix: "0o" },
  { name: "Decimal", base: 10, prefix: "" },
  { name: "Hexadecimal", base: 16, prefix: "0x" },
]

export default function NumberBaseConverter() {
  const [input, setInput] = useState("")
  const [fromBase, setFromBase] = useState(10)

  const parsed = (() => {
    try {
      const cleaned = input.trim().replace(/^0[bBxXoO]/, "")
      const num = parseInt(cleaned, fromBase)
      if (isNaN(num)) return null
      return num
    } catch {
      return null
    }
  })()

  return (
    <ToolCard title="Number Base Converter" description="Convert numbers between bases (binary, octal, hex)" categoryId="dev-utilities">
      <div className="space-y-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="space-y-1 flex-1 min-w-[200px]">
            <label className="text-sm font-medium">Input</label>
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter a number..." className="w-full rounded-lg border bg-background px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ring" spellCheck={false} />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">From Base</label>
            <select value={fromBase} onChange={(e) => setFromBase(Number(e.target.value))} className="rounded-md border bg-background px-3 py-2 text-sm">
              {bases.map((b) => (<option key={b.base} value={b.base}>{b.name} ({b.base})</option>))}
              <option value={32}>Base 32</option>
              <option value={36}>Base 36</option>
            </select>
          </div>
        </div>
        {parsed !== null && (
          <div className="grid gap-3 sm:grid-cols-2">
            {bases.map(({ name, base, prefix }) => {
              const value = prefix + parsed.toString(base).toUpperCase()
              return (
                <div key={base} className="rounded-lg border p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">{name} (base {base})</span>
                    <CopyButton text={value} />
                  </div>
                  <div className="font-mono text-sm break-all">{value}</div>
                </div>
              )
            })}
          </div>
        )}
        {input.trim() && parsed === null && (
          <p className="text-sm text-destructive">Invalid number for base {fromBase}</p>
        )}
      </div>
    </ToolCard>
  )
}
