import { useState } from "react"
import { ToolCard } from "@/components/layout/ToolCard"
import { CopyButton } from "@/components/shared/CopyButton"

export default function CorsHelper() {
  const [origin, setOrigin] = useState("*")
  const [methods, setMethods] = useState("GET, POST, PUT, DELETE, OPTIONS")
  const [headers, setHeaders] = useState("Content-Type, Authorization")
  const [credentials, setCredentials] = useState(false)
  const [maxAge, setMaxAge] = useState(86400)

  const corsHeaders = `Access-Control-Allow-Origin: ${origin}
Access-Control-Allow-Methods: ${methods}
Access-Control-Allow-Headers: ${headers}${credentials ? "\nAccess-Control-Allow-Credentials: true" : ""}
Access-Control-Max-Age: ${maxAge}`

  const expressCode = `app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "${origin}");
  res.header("Access-Control-Allow-Methods", "${methods}");
  res.header("Access-Control-Allow-Headers", "${headers}");${credentials ? '\n  res.header("Access-Control-Allow-Credentials", "true");' : ""}
  res.header("Access-Control-Max-Age", "${maxAge}");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});`

  const nginxCode = `location / {
    add_header Access-Control-Allow-Origin "${origin}";
    add_header Access-Control-Allow-Methods "${methods}";
    add_header Access-Control-Allow-Headers "${headers}";${credentials ? '\n    add_header Access-Control-Allow-Credentials "true";' : ""}
    add_header Access-Control-Max-Age ${maxAge};
    if ($request_method = OPTIONS) { return 204; }
}`

  return (
    <ToolCard title="CORS Helper" description="Generate CORS headers for your server" categoryId="network-api">
      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-sm font-medium">Origin</label>
            <input value={origin} onChange={(e) => setOrigin(e.target.value)} className="w-full rounded-md border bg-background px-3 py-1.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Methods</label>
            <input value={methods} onChange={(e) => setMethods(e.target.value)} className="w-full rounded-md border bg-background px-3 py-1.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Headers</label>
            <input value={headers} onChange={(e) => setHeaders(e.target.value)} className="w-full rounded-md border bg-background px-3 py-1.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Max Age (seconds)</label>
            <input type="number" value={maxAge} onChange={(e) => setMaxAge(Number(e.target.value))} className="w-full rounded-md border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={credentials} onChange={(e) => setCredentials(e.target.checked)} className="rounded" />
          Allow Credentials
        </label>
        {[
          { label: "Headers", code: corsHeaders },
          { label: "Express.js", code: expressCode },
          { label: "Nginx", code: nginxCode },
        ].map(({ label, code }) => (
          <div key={label} className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">{label}</label>
              <CopyButton text={code} />
            </div>
            <pre className="rounded-lg border bg-muted/50 p-3 font-mono text-xs overflow-auto">{code}</pre>
          </div>
        ))}
      </div>
    </ToolCard>
  )
}
