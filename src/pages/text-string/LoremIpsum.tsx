import { useState } from "react"
import { ToolCard } from "@/components/layout/ToolCard"
import { CopyButton } from "@/components/shared/CopyButton"

const WORDS = "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum".split(" ")

function generateWords(count: number): string {
  const result: string[] = []
  for (let i = 0; i < count; i++) result.push(WORDS[i % WORDS.length])
  return result.join(" ")
}

function generateSentences(count: number): string {
  const sentences: string[] = []
  for (let i = 0; i < count; i++) {
    const len = 8 + Math.floor(Math.random() * 12)
    const words = generateWords(len)
    sentences.push(words.charAt(0).toUpperCase() + words.slice(1) + ".")
  }
  return sentences.join(" ")
}

function generateParagraphs(count: number): string {
  return Array.from({ length: count }, () => generateSentences(4 + Math.floor(Math.random() * 4))).join("\n\n")
}

export default function LoremIpsum() {
  const [type, setType] = useState<"paragraphs" | "sentences" | "words">("paragraphs")
  const [count, setCount] = useState(3)
  const [output, setOutput] = useState("")

  const generate = () => {
    if (type === "paragraphs") setOutput(generateParagraphs(count))
    else if (type === "sentences") setOutput(generateSentences(count))
    else setOutput(generateWords(count))
  }

  return (
    <ToolCard title="Lorem Ipsum" description="Generate placeholder text" categoryId="text-string">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-sm text-muted-foreground">Type:</label>
            <select value={type} onChange={(e) => setType(e.target.value as typeof type)} className="rounded-md border bg-background px-2 py-1 text-sm">
              <option value="paragraphs">Paragraphs</option>
              <option value="sentences">Sentences</option>
              <option value="words">Words</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-muted-foreground">Count:</label>
            <input type="number" min={1} max={100} value={count} onChange={(e) => setCount(Number(e.target.value))} className="w-20 rounded-md border bg-background px-2 py-1 text-sm" />
          </div>
          <button onClick={generate} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">Generate</button>
        </div>
        {output && (
          <div className="space-y-2">
            <div className="flex justify-end"><CopyButton text={output} /></div>
            <div className="rounded-lg border bg-muted/50 p-4 text-sm whitespace-pre-wrap max-h-96 overflow-auto">{output}</div>
          </div>
        )}
      </div>
    </ToolCard>
  )
}
