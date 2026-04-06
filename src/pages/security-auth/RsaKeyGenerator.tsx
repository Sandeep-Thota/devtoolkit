import { useState } from "react"
import { ToolCard } from "@/components/layout/ToolCard"
import { CopyButton } from "@/components/shared/CopyButton"

function arrayBufferToPem(buffer: ArrayBuffer, type: string): string {
  const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)))
  const lines = base64.match(/.{1,64}/g)?.join("\n") || ""
  return `-----BEGIN ${type}-----\n${lines}\n-----END ${type}-----`
}

export default function RsaKeyGenerator() {
  const [keySize, setKeySize] = useState(2048)
  const [publicKey, setPublicKey] = useState("")
  const [privateKey, setPrivateKey] = useState("")
  const [loading, setLoading] = useState(false)

  const generate = async () => {
    setLoading(true)
    try {
      const keyPair = await crypto.subtle.generateKey(
        { name: "RSASSA-PKCS1-v1_5", modulusLength: keySize, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" },
        true,
        ["sign", "verify"]
      )
      const pubBuf = await crypto.subtle.exportKey("spki", keyPair.publicKey)
      const prvBuf = await crypto.subtle.exportKey("pkcs8", keyPair.privateKey)
      setPublicKey(arrayBufferToPem(pubBuf, "PUBLIC KEY"))
      setPrivateKey(arrayBufferToPem(prvBuf, "PRIVATE KEY"))
    } catch (e) {
      setPublicKey("Error: " + (e as Error).message)
      setPrivateKey("")
    }
    setLoading(false)
  }

  return (
    <ToolCard title="RSA Key Generator" description="Generate RSA public/private key pairs" categoryId="security-auth">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-sm text-muted-foreground">Key Size:</label>
            <select value={keySize} onChange={(e) => setKeySize(Number(e.target.value))} className="rounded-md border bg-background px-2 py-1 text-sm">
              <option value={1024}>1024 bits</option>
              <option value={2048}>2048 bits</option>
              <option value={4096}>4096 bits</option>
            </select>
          </div>
          <button onClick={generate} disabled={loading} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50">
            {loading ? "Generating..." : "Generate Key Pair"}
          </button>
        </div>
        {publicKey && (
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-green-500">Public Key</label>
                <CopyButton text={publicKey} />
              </div>
              <pre className="rounded-lg border bg-muted/50 p-3 font-mono text-xs overflow-auto h-64 whitespace-pre-wrap break-all">{publicKey}</pre>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-red-500">Private Key</label>
                <CopyButton text={privateKey} />
              </div>
              <pre className="rounded-lg border bg-muted/50 p-3 font-mono text-xs overflow-auto h-64 whitespace-pre-wrap break-all">{privateKey}</pre>
            </div>
          </div>
        )}
      </div>
    </ToolCard>
  )
}
