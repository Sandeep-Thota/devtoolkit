import { useState, useCallback } from "react"
import { RefreshCw } from "lucide-react"
import { ToolCard } from "@/components/layout/ToolCard"
import { CopyButton } from "@/components/shared/CopyButton"

const charsets = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
}

function generatePassword(length: number, options: Record<string, boolean>): string {
  let chars = ""
  if (options.uppercase) chars += charsets.uppercase
  if (options.lowercase) chars += charsets.lowercase
  if (options.numbers) chars += charsets.numbers
  if (options.symbols) chars += charsets.symbols
  if (!chars) chars = charsets.lowercase
  const arr = new Uint32Array(length)
  crypto.getRandomValues(arr)
  return Array.from(arr, (x) => chars[x % chars.length]).join("")
}

function getStrength(password: string): { label: string; color: string; percent: number } {
  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (password.length >= 16) score++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[^a-zA-Z\d]/.test(password)) score++
  if (score <= 2) return { label: "Weak", color: "bg-red-500", percent: 25 }
  if (score <= 3) return { label: "Fair", color: "bg-yellow-500", percent: 50 }
  if (score <= 4) return { label: "Good", color: "bg-blue-500", percent: 75 }
  return { label: "Strong", color: "bg-green-500", percent: 100 }
}

export default function PasswordGenerator() {
  const [length, setLength] = useState(16)
  const [options, setOptions] = useState({ uppercase: true, lowercase: true, numbers: true, symbols: true })
  const [count, setCount] = useState(1)
  const [passwords, setPasswords] = useState<string[]>([])

  const generate = useCallback(() => {
    setPasswords(Array.from({ length: count }, () => generatePassword(length, options)))
  }, [length, options, count])

  const strength = passwords.length > 0 ? getStrength(passwords[0]) : null

  return (
    <ToolCard title="Password Generator" description="Generate secure random passwords" categoryId="security-auth">
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Length: {length}</label>
            <input type="range" min={4} max={128} value={length} onChange={(e) => setLength(Number(e.target.value))} className="w-full accent-primary" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Count</label>
            <select value={count} onChange={(e) => setCount(Number(e.target.value))} className="w-full rounded-md border bg-background px-2 py-1.5 text-sm">
              {[1, 5, 10, 20].map((n) => (<option key={n} value={n}>{n}</option>))}
            </select>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          {Object.entries(options).map(([key, val]) => (
            <label key={key} className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={val} onChange={(e) => setOptions({ ...options, [key]: e.target.checked })} className="rounded" />
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </label>
          ))}
        </div>
        <button onClick={generate} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          <RefreshCw className="h-4 w-4" /> Generate
        </button>
        {strength && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Strength</span>
              <span className="font-medium">{strength.label}</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div className={`h-full rounded-full transition-all ${strength.color}`} style={{ width: `${strength.percent}%` }} />
            </div>
          </div>
        )}
        {passwords.length > 0 && (
          <div className="space-y-2">
            {passwords.map((pw, i) => (
              <div key={i} className="flex items-center gap-2 rounded-lg border p-2">
                <code className="flex-1 text-sm break-all">{pw}</code>
                <CopyButton text={pw} />
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolCard>
  )
}
