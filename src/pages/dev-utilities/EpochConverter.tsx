import { useState, useEffect } from "react"
import { ToolCard } from "@/components/layout/ToolCard"
import { CopyButton } from "@/components/shared/CopyButton"

export default function EpochConverter() {
  const [epoch, setEpoch] = useState("")
  const [dateStr, setDateStr] = useState("")
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [])

  const fromEpoch = () => {
    const ts = Number(epoch)
    if (isNaN(ts)) return
    const date = new Date(ts > 1e12 ? ts : ts * 1000)
    setDateStr(date.toISOString())
  }

  const fromDate = () => {
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return
    setEpoch(Math.floor(date.getTime() / 1000).toString())
  }

  const nowSec = Math.floor(now / 1000)

  return (
    <ToolCard title="Epoch Converter" description="Convert between epoch timestamps and dates" categoryId="dev-utilities">
      <div className="space-y-4">
        <div className="rounded-lg border bg-primary/5 p-4 text-center space-y-1">
          <div className="text-xs text-muted-foreground">Current Epoch</div>
          <div className="font-mono text-2xl font-bold">{nowSec}</div>
          <div className="text-sm text-muted-foreground">{new Date(now).toISOString()}</div>
          <CopyButton text={nowSec.toString()} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Epoch Timestamp</label>
            <div className="flex gap-2">
              <input value={epoch} onChange={(e) => setEpoch(e.target.value)} placeholder="1711900800" className="flex-1 rounded-md border bg-background px-3 py-1.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              <button onClick={fromEpoch} className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">Convert</button>
            </div>
            <p className="text-xs text-muted-foreground">Supports seconds and milliseconds</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Date String</label>
            <div className="flex gap-2">
              <input value={dateStr} onChange={(e) => setDateStr(e.target.value)} placeholder="2024-04-01T00:00:00Z" className="flex-1 rounded-md border bg-background px-3 py-1.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              <button onClick={fromDate} className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">Convert</button>
            </div>
            <p className="text-xs text-muted-foreground">ISO 8601 or any parseable date format</p>
          </div>
        </div>
      </div>
    </ToolCard>
  )
}
