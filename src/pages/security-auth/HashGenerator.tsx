import { useState } from "react"
import CryptoJS from "crypto-js"
import { ToolCard } from "@/components/layout/ToolCard"
import { CopyButton } from "@/components/shared/CopyButton"

const algorithms = ["MD5", "SHA-1", "SHA-256", "SHA-512"] as const

function computeHash(text: string, algo: string): string {
  switch (algo) {
    case "MD5": return CryptoJS.MD5(text).toString()
    case "SHA-1": return CryptoJS.SHA1(text).toString()
    case "SHA-256": return CryptoJS.SHA256(text).toString()
    case "SHA-512": return CryptoJS.SHA512(text).toString()
    default: return ""
  }
}

export default function HashGenerator() {
  const [input, setInput] = useState("")

  const hashes = input.trim()
    ? algorithms.map((algo) => ({ algo, hash: computeHash(input, algo) }))
    : []

  return (
    <ToolCard title="Hash Generator" description="Generate MD5, SHA-1, SHA-256, SHA-512 hashes" categoryId="security-auth">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Input Text</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter text to hash..." className="w-full h-32 rounded-lg border bg-background p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        {hashes.length > 0 && (
          <div className="space-y-3">
            {hashes.map(({ algo, hash }) => (
              <div key={algo} className="rounded-lg border p-3 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">{algo}</span>
                  <CopyButton text={hash} />
                </div>
                <div className="font-mono text-xs break-all">{hash}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolCard>
  )
}
