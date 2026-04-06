import { useState } from "react"
import { ToolCard } from "@/components/layout/ToolCard"
import { CopyButton } from "@/components/shared/CopyButton"

function formatHtml(html: string, indent = "  "): string {
  let result = ""
  let pad = 0
  html = html.replace(/>\s+</g, "><")
  const tokens = html.replace(/(>)(<)/g, "$1\n$2").split("\n")
  for (const token of tokens) {
    if (token.match(/^<\/\w/)) pad--
    result += indent.repeat(Math.max(0, pad)) + token.trim() + "\n"
    if (token.match(/^<\w[^>]*[^/]>$/) && !token.match(/^<(br|hr|img|input|meta|link)/i)) pad++
  }
  return result.trim()
}

function minifyHtml(html: string): string {
  return html.replace(/\n/g, "").replace(/\s{2,}/g, " ").replace(/>\s+</g, "><").trim()
}

export default function HtmlFormatter() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")

  return (
    <ToolCard title="HTML Formatter" description="Format and minify HTML code" categoryId="data-format">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Input</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Paste HTML here..." className="w-full h-80 rounded-lg border bg-background p-3 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring" spellCheck={false} />
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
        <button onClick={() => setOutput(formatHtml(input))} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">Format</button>
        <button onClick={() => setOutput(minifyHtml(input))} className="rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors">Minify</button>
        <button onClick={() => { setInput(""); setOutput("") }} className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-accent transition-colors">Clear</button>
      </div>
    </ToolCard>
  )
}
