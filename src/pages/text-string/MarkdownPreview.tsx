import { useState } from "react"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { ToolCard } from "@/components/layout/ToolCard"

const SAMPLE = `# Markdown Preview

## Features
- **Bold** and *italic* text
- [Links](https://example.com)
- \`inline code\`

### Code Block
\`\`\`javascript
const hello = "world"
console.log(hello)
\`\`\`

### Table
| Name | Age |
|------|-----|
| John | 30  |
| Jane | 25  |

### Task List
- [x] Completed task
- [ ] Pending task
`

export default function MarkdownPreview() {
  const [input, setInput] = useState(SAMPLE)

  return (
    <ToolCard title="Markdown Preview" description="Write and preview Markdown with GFM support" categoryId="text-string">
      <div className="grid gap-4 lg:grid-cols-2 lg:h-[600px]">
        <div className="space-y-2 flex flex-col">
          <label className="text-sm font-medium">Markdown</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Write Markdown here..."
            className="flex-1 w-full rounded-lg border bg-background p-3 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring min-h-[300px]"
            spellCheck={false}
          />
        </div>
        <div className="space-y-2 flex flex-col">
          <label className="text-sm font-medium">Preview</label>
          <div className="flex-1 rounded-lg border bg-card p-4 overflow-auto prose prose-sm dark:prose-invert max-w-none min-h-[300px]">
            <Markdown remarkPlugins={[remarkGfm]}>{input}</Markdown>
          </div>
        </div>
      </div>
    </ToolCard>
  )
}
