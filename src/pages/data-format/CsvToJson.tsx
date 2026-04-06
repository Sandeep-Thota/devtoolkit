import { useState } from "react"
import { ToolCard } from "@/components/layout/ToolCard"
import { CopyButton } from "@/components/shared/CopyButton"

function parseCsv(csv: string, delimiter: string, hasHeader: boolean): string {
  const lines = csv.trim().split("\n").map((l) => l.split(delimiter).map((c) => c.trim().replace(/^"|"$/g, "")))
  if (lines.length === 0) return "[]"
  if (hasHeader && lines.length > 1) {
    const headers = lines[0]
    const rows = lines.slice(1).map((row) => {
      const obj: Record<string, string> = {}
      headers.forEach((h, i) => { obj[h] = row[i] || "" })
      return obj
    })
    return JSON.stringify(rows, null, 2)
  }
  return JSON.stringify(lines, null, 2)
}

export default function CsvToJson() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [delimiter, setDelimiter] = useState(",")
  const [hasHeader, setHasHeader] = useState(true)

  const convert = () => {
    try { setOutput(parseCsv(input, delimiter, hasHeader)) }
    catch (e) { setOutput("Error: " + (e as Error).message) }
  }

  return (
    <ToolCard title="CSV to JSON" description="Convert CSV data to JSON format" categoryId="data-format">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">CSV Input</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="name,age,city&#10;John,30,NYC&#10;Jane,25,LA" className="w-full h-80 rounded-lg border bg-background p-3 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring" spellCheck={false} />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">JSON Output</label>
            {output && <CopyButton text={output} />}
          </div>
          <pre className="w-full h-80 rounded-lg border bg-muted/50 p-3 font-mono text-sm overflow-auto whitespace-pre-wrap">{output || "Output will appear here..."}</pre>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground">Delimiter:</label>
          <select value={delimiter} onChange={(e) => setDelimiter(e.target.value)} className="rounded-md border bg-background px-2 py-1 text-sm">
            <option value=",">Comma (,)</option>
            <option value="&#9;">Tab</option>
            <option value=";">Semicolon (;)</option>
            <option value="|">Pipe (|)</option>
          </select>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={hasHeader} onChange={(e) => setHasHeader(e.target.checked)} className="rounded" />
          First row is header
        </label>
        <button onClick={convert} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">Convert</button>
        <button onClick={() => { setInput(""); setOutput("") }} className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-accent transition-colors">Clear</button>
      </div>
    </ToolCard>
  )
}
