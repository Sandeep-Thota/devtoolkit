import { useState } from "react"
import { ToolCard } from "@/components/layout/ToolCard"
import { CopyButton } from "@/components/shared/CopyButton"

function formatXml(xml: string, indent = "  "): string {
  let formatted = ""
  let pad = 0
  const nodes = xml.replace(/(>)(<)(\/*)/g, "$1\n$2$3").split("\n")
  for (const node of nodes) {
    let padding = ""
    if (node.match(/<\/\w/)) pad--
    padding = indent.repeat(Math.max(0, pad))
    if (node.match(/<\w[^>]*[^/]>.*$/)) pad++
    formatted += padding + node.trim() + "\n"
  }
  return formatted.trim()
}

function minifyXml(xml: string): string {
  return xml.replace(/>\s+</g, "><").replace(/\s+/g, " ").trim()
}

export default function XmlFormatter() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")

  return (
    <ToolCard title="XML Formatter" description="Format and minify XML documents" categoryId="data-format">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Input</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Paste XML here..." className="w-full h-80 rounded-lg border bg-background p-3 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring" spellCheck={false} />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Output</label>
            {output && <CopyButton text={output} />}
          </div>
          <pre className="w-full h-80 rounded-lg border bg-muted/50 p-3 font-mono text-sm overflow-auto whitespace-pre-wrap">{output || "Output will appear here..."}</pre>
        </div>
      </div>
      <div className="flex gap-3">
        <button onClick={() => setOutput(formatXml(input))} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">Format</button>
        <button onClick={() => setOutput(minifyXml(input))} className="rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors">Minify</button>
        <button onClick={() => { setInput(""); setOutput("") }} className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-accent transition-colors">Clear</button>
      </div>
    </ToolCard>
  )
}
