import { useState } from "react"
import { statusCodes } from "@/data/http-status-codes"
import { ToolCard } from "@/components/layout/ToolCard"

const categoryColors: Record<string, string> = {
  "1xx Informational": "bg-blue-500/10 text-blue-600",
  "2xx Success": "bg-green-500/10 text-green-600",
  "3xx Redirection": "bg-yellow-500/10 text-yellow-600",
  "4xx Client Error": "bg-orange-500/10 text-orange-600",
  "5xx Server Error": "bg-red-500/10 text-red-600",
}

export default function HttpStatusCodes() {
  const [query, setQuery] = useState("")

  const filtered = query.trim()
    ? statusCodes.filter((s) =>
        s.code.toString().includes(query) ||
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.description.toLowerCase().includes(query.toLowerCase())
      )
    : statusCodes

  return (
    <ToolCard title="HTTP Status Codes" description="Reference for all HTTP status codes" categoryId="network-api">
      <div className="space-y-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by code or name... e.g. 404 or Not Found"
          className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <div className="rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-3 py-2 text-left font-medium w-20">Code</th>
                <th className="px-3 py-2 text-left font-medium">Name</th>
                <th className="px-3 py-2 text-left font-medium hidden sm:table-cell">Description</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.code} className="border-b last:border-0 hover:bg-accent/50 transition-colors">
                  <td className="px-3 py-2">
                    <span className={`inline-flex rounded-md px-2 py-0.5 text-xs font-bold ${categoryColors[s.category] || ""}`}>
                      {s.code}
                    </span>
                  </td>
                  <td className="px-3 py-2 font-medium">{s.name}</td>
                  <td className="px-3 py-2 text-muted-foreground hidden sm:table-cell">{s.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-4">No matching status codes found</p>
        )}
      </div>
    </ToolCard>
  )
}
