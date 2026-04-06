import { Link } from "react-router"
import { ChevronRight } from "lucide-react"
import { categoryMap } from "@/data/categories"
import { cn } from "@/lib/utils"

interface ToolCardProps {
  title: string
  description: string
  categoryId: string
  children: React.ReactNode
}

export function ToolCard({ title, description, categoryId, children }: ToolCardProps) {
  const category = categoryMap[categoryId]

  return (
    <div className="flex-1 space-y-6">
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link
            to="/"
            className="hover:text-foreground transition-colors"
          >
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className={cn(category?.color)}>{category?.name}</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground">{title}</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      {children}
    </div>
  )
}
