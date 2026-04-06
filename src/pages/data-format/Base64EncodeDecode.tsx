import { useState } from "react"
import { ToolCard } from "@/components/layout/ToolCard"
import { CopyButton } from "@/components/shared/CopyButton"

export default function Base64EncodeDecode() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState("")

  const encode = () => {
    try { setOutput(btoa(unescape(encodeURIComponent(input)))); setError("") }
    catch (e) { setError((e as Error).message); setOutput("") }
  }
  const decode = () => {
    try { setOutput(decodeURIComponent(escape(atob(input)))); setError("") }
    catch (e) { setError((e as Error).message); setOutput("") }
  }

  return (
    <ToolCard title="Base64 Encode/Decode" description="Encode and decode Base64 strings" categoryId="data-format">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Input</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter text or Base64 string..." className="w-full h-60 rounded-lg border bg-background p-3 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring" spellCheck={false} />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Output</label>
            {output && <CopyButton text={output} />}
          </div>
          <div className={`w-full h-60 rounded-lg border p-3 font-mono text-sm overflow-auto whitespace-pre-wrap break-all ${error ? "bg-destructive/10 text-destructive" : "bg-muted/50"}`}>
            {error || output || "Output will appear here..."}
          </div>
        </div>
      </div>
      <div className="flex gap-3">
        <button onClick={encode} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">Encode</button>
        <button onClick={decode} className="rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors">Decode</button>
        <button onClick={() => { setInput(""); setOutput(""); setError("") }} className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-accent transition-colors">Clear</button>
      </div>
    </ToolCard>
  )
}
