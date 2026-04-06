import { useState } from "react"
import YAML from "yaml"
import { ToolCard } from "@/components/layout/ToolCard"
import { CopyButton } from "@/components/shared/CopyButton"

export default function YamlFormatter() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState("")

  const format = () => {
    try { setOutput(YAML.stringify(YAML.parse(input), { indent: 2 })); setError("") }
    catch (e) { setError((e as Error).message); setOutput("") }
  }
  const toJson = () => {
    try { setOutput(JSON.stringify(YAML.parse(input), null, 2)); setError("") }
    catch (e) { setError((e as Error).message); setOutput("") }
  }
  const fromJson = () => {
    try { setOutput(YAML.stringify(JSON.parse(input), { indent: 2 })); setError("") }
    catch (e) { setError((e as Error).message); setOutput("") }
  }

  return (
    <ToolCard title="YAML Formatter" description="Format YAML and convert to/from JSON" categoryId="data-format">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Input</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Paste YAML or JSON here..." className="w-full h-80 rounded-lg border bg-background p-3 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring" spellCheck={false} />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Output</label>
            {output && <CopyButton text={output} />}
          </div>
          <div className={`w-full h-80 rounded-lg border p-3 font-mono text-sm overflow-auto whitespace-pre-wrap ${error ? "bg-destructive/10 text-destructive" : "bg-muted/50"}`}>
            {error || output || "Output will appear here..."}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        <button onClick={format} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">Format YAML</button>
        <button onClick={toJson} className="rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors">YAML to JSON</button>
        <button onClick={fromJson} className="rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors">JSON to YAML</button>
        <button onClick={() => { setInput(""); setOutput(""); setError("") }} className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-accent transition-colors">Clear</button>
      </div>
    </ToolCard>
  )
}
