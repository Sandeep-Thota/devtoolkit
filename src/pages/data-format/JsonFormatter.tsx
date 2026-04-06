import { useState } from "react"
import { ToolCard } from "@/components/layout/ToolCard"
import { CopyButton } from "@/components/shared/CopyButton"

export default function JsonFormatter() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState("")
  const [indent, setIndent] = useState(2)

  const format = () => {
    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed, null, indent))
      setError("")
    } catch (e) {
      setError((e as Error).message)
      setOutput("")
    }
  }

  const minify = () => {
    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed))
      setError("")
    } catch (e) {
      setError((e as Error).message)
      setOutput("")
    }
  }

  const validate = () => {
    try {
      JSON.parse(input)
      setError("")
      setOutput("Valid JSON!")
    } catch (e) {
      setError((e as Error).message)
      setOutput("")
    }
  }

  return (
    <ToolCard
      title="JSON Formatter"
      description="Format, validate, and minify JSON data"
      categoryId="data-format"
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Input</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Paste your JSON here... e.g. {"name": "John"}'
            className="w-full h-80 rounded-lg border bg-background p-3 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
            spellCheck={false}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Output</label>
            {output && !error && <CopyButton text={output} />}
          </div>
          <div
            className={`w-full h-80 rounded-lg border p-3 font-mono text-sm overflow-auto whitespace-pre-wrap ${
              error ? "bg-destructive/10 text-destructive" : "bg-muted/50"
            }`}
          >
            {error || output || "Output will appear here..."}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground">Indent:</label>
          <select
            value={indent}
            onChange={(e) => setIndent(Number(e.target.value))}
            className="rounded-md border bg-background px-2 py-1 text-sm"
          >
            <option value={2}>2 spaces</option>
            <option value={4}>4 spaces</option>
            <option value={1}>Tab</option>
          </select>
        </div>
        <button
          onClick={format}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Format
        </button>
        <button
          onClick={minify}
          className="rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors"
        >
          Minify
        </button>
        <button
          onClick={validate}
          className="rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors"
        >
          Validate
        </button>
        <button
          onClick={() => {
            setInput("")
            setOutput("")
            setError("")
          }}
          className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
        >
          Clear
        </button>
      </div>
    </ToolCard>
  )
}
