import { useLocation, Link } from "react-router"
import { Construction, ArrowLeft } from "lucide-react"

export default function ComingSoon() {
  const location = useLocation()
  const toolName = location.pathname
    .split("/")
    .pop()
    ?.split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
      <Construction className="h-12 w-12 text-muted-foreground" />
      <h1 className="text-2xl font-bold">{toolName || "Tool"}</h1>
      <p className="text-muted-foreground max-w-md">
        This tool is coming soon. We're working hard to bring you the best experience.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>
    </div>
  )
}
