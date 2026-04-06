import { useState } from "react"
import { ToolCard } from "@/components/layout/ToolCard"
import { CopyButton } from "@/components/shared/CopyButton"

export default function UrlEncodeDecode() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState("")

  const encode = () => { try { setOutput(encodeURIComponent(input)); setError("") } catch (e) { setError((e as Error).message) } }
  const decode = () => { try { setOutput(decodeURIComponent(input)); setError("") } catch (e) { setError((e as Error).message) } }
  const encodeUri = () => { try { setOutput(encodeURI(input)); setError("") } catch (e) { setError((e as Error).message) } }
  const decodeUri = () => { try { setOutput(decodeURI(input)); setError("") } catch (e) { setError((e as Error).message) } }

  return (
    <ToolCard title="URL Encode/Decode" description="Encode and decode URL components" categoryId="text-string">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Input</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter text or encoded URL..." className="w-full h-48 rounded-lg border bg-background p-3 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring" spellCheck={false} />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Output</label>
            {output && <CopyButton text={output} />}
          </div>
          <div className={`w-full h-48 rounded-lg border p-3 font-mono text-sm overflow-auto whitespace-pre-wrap break-all ${error ? "bg-destructive/10 text-destructive" : "bg-muted/50"}`}>
            {error || output || "Output will appear here..."}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        <button onClick={encode} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">Encode Component</button>
        <button onClick={decode} className="rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors">Decode Component</button>
        <button onClick={encodeUri} className="rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors">Encode URI</button>
        <button onClick={decodeUri} className="rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors">Decode URI</button>
        <button onClick={() => { setInput(""); setOutput(""); setError("") }} className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-accent transition-colors">Clear</button>
      </div>
    </ToolCard>
  )
}
