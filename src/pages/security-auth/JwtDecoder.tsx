import { useState } from "react"
import { ToolCard } from "@/components/layout/ToolCard"
import { CopyButton } from "@/components/shared/CopyButton"

function decodeBase64Url(str: string): string {
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/")
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4)
  return atob(padded)
}

function decodeJwt(token: string) {
  const parts = token.trim().split(".")
  if (parts.length !== 3) throw new Error("Invalid JWT: must have 3 parts separated by dots")

  const header = JSON.parse(decodeBase64Url(parts[0]))
  const payload = JSON.parse(decodeBase64Url(parts[1]))

  return { header, payload, signature: parts[2] }
}

export default function JwtDecoder() {
  const [input, setInput] = useState("")
  const [result, setResult] = useState<{
    header: Record<string, unknown>
    payload: Record<string, unknown>
    signature: string
  } | null>(null)
  const [error, setError] = useState("")

  const decode = (value: string) => {
    setInput(value)
    if (!value.trim()) {
      setResult(null)
      setError("")
      return
    }
    try {
      const decoded = decodeJwt(value)
      setResult(decoded)
      setError("")
    } catch (e) {
      setError((e as Error).message)
      setResult(null)
    }
  }

  const isExpired = result?.payload?.exp
    ? (result.payload.exp as number) * 1000 < Date.now()
    : null

  return (
    <ToolCard
      title="JWT Decoder"
      description="Decode and inspect JSON Web Tokens"
      categoryId="security-auth"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Token</label>
          <textarea
            value={input}
            onChange={(e) => decode(e.target.value)}
            placeholder="Paste your JWT here... e.g. eyJhbGciOiJIUzI1NiJ9..."
            className="w-full h-32 rounded-lg border bg-background p-3 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
            spellCheck={false}
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        {result && (
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-blue-500">Header</label>
                <CopyButton text={JSON.stringify(result.header, null, 2)} />
              </div>
              <pre className="rounded-lg border bg-muted/50 p-3 font-mono text-sm overflow-auto">
                {JSON.stringify(result.header, null, 2)}
              </pre>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-purple-500">Payload</label>
                  {isExpired !== null && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        isExpired
                          ? "bg-destructive/10 text-destructive"
                          : "bg-green-500/10 text-green-600"
                      }`}
                    >
                      {isExpired ? "Expired" : "Valid"}
                    </span>
                  )}
                </div>
                <CopyButton text={JSON.stringify(result.payload, null, 2)} />
              </div>
              <pre className="rounded-lg border bg-muted/50 p-3 font-mono text-sm overflow-auto">
                {JSON.stringify(result.payload, null, 2)}
              </pre>
            </div>

            <div className="space-y-2 lg:col-span-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-orange-500">Signature</label>
                <CopyButton text={result.signature} />
              </div>
              <div className="rounded-lg border bg-muted/50 p-3 font-mono text-xs break-all">
                {result.signature}
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolCard>
  )
}
