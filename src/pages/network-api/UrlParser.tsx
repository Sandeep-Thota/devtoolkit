import { useState, useMemo } from "react"
import { ToolCard } from "@/components/layout/ToolCard"
import { CopyButton } from "@/components/shared/CopyButton"

export default function UrlParser() {
  const [input, setInput] = useState("")

  const parsed = useMemo(() => {
    if (!input.trim()) return null
    try {
      const url = new URL(input)
      const params = Array.from(url.searchParams.entries())
      return {
        href: url.href,
        protocol: url.protocol,
        host: url.host,
        hostname: url.hostname,
        port: url.port || "(default)",
        pathname: url.pathname,
        search: url.search,
        hash: url.hash,
        origin: url.origin,
        username: url.username,
        password: url.password,
        params,
      }
    } catch {
      return "invalid"
    }
  }, [input])

  return (
    <ToolCard
      title="URL Parser"
      description="Parse and inspect URL components"
      categoryId="network-api"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">URL</label>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="https://example.com:8080/path?key=value#section"
            className="w-full rounded-lg border bg-background px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            spellCheck={false}
          />
          {parsed === "invalid" && (
            <p className="text-sm text-destructive">Invalid URL</p>
          )}
        </div>

        {parsed && parsed !== "invalid" && (
          <div className="space-y-4">
            <div className="rounded-lg border overflow-hidden">
              <table className="w-full text-sm">
                <tbody>
                  {[
                    { label: "Origin", value: parsed.origin },
                    { label: "Protocol", value: parsed.protocol },
                    { label: "Host", value: parsed.host },
                    { label: "Hostname", value: parsed.hostname },
                    { label: "Port", value: parsed.port },
                    { label: "Pathname", value: parsed.pathname },
                    { label: "Search", value: parsed.search || "(none)" },
                    { label: "Hash", value: parsed.hash || "(none)" },
                    ...(parsed.username
                      ? [{ label: "Username", value: parsed.username }]
                      : []),
                    ...(parsed.password
                      ? [{ label: "Password", value: parsed.password }]
                      : []),
                  ].map(({ label, value }) => (
                    <tr key={label} className="border-b last:border-0">
                      <td className="px-3 py-2 font-medium text-muted-foreground w-28">
                        {label}
                      </td>
                      <td className="px-3 py-2 font-mono break-all">{value}</td>
                      <td className="px-3 py-2 w-16">
                        <CopyButton text={value} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {parsed.params.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Query Parameters</label>
                <div className="rounded-lg border overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="px-3 py-2 text-left font-medium">Key</th>
                        <th className="px-3 py-2 text-left font-medium">Value</th>
                        <th className="px-3 py-2 w-16" />
                      </tr>
                    </thead>
                    <tbody>
                      {parsed.params.map(([key, value], i) => (
                        <tr key={i} className="border-b last:border-0">
                          <td className="px-3 py-2 font-mono text-primary">
                            {key}
                          </td>
                          <td className="px-3 py-2 font-mono break-all">{value}</td>
                          <td className="px-3 py-2">
                            <CopyButton text={value} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolCard>
  )
}
