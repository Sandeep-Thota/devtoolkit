import { useState } from "react"
import { Link, useLocation } from "react-router"
import { ChevronDown, Star, Wrench } from "lucide-react"
import { categories } from "@/data/categories"
import { toolsByCategory } from "@/data/tools"
import { cn } from "@/lib/utils"

interface SidebarProps {
  favorites: string[]
  open: boolean
  onClose: () => void
}

export function Sidebar({ favorites, open, onClose }: SidebarProps) {
  const location = useLocation()
  const [expandedCategories, setExpandedCategories] = useState<string[]>(
    categories.map((c) => c.id)
  )

  const toggleCategory = (id: string) => {
    setExpandedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    )
  }

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="p-4 border-b">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg" onClick={onClose}>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Wrench className="h-4 w-4" />
          </div>
          <span>DevToolkit</span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto p-2 space-y-1">
        {favorites.length > 0 && (
          <div className="mb-2">
            <button
              onClick={() => toggleCategory("favorites")}
              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              <span>Favorites</span>
              <ChevronDown
                className={cn(
                  "ml-auto h-4 w-4 transition-transform",
                  !expandedCategories.includes("favorites") && "-rotate-90"
                )}
              />
            </button>
          </div>
        )}

        {categories.map((category) => {
          const catTools = toolsByCategory(category.id)
          const isExpanded = expandedCategories.includes(category.id)
          const Icon = category.icon

          return (
            <div key={category.id}>
              <button
                onClick={() => toggleCategory(category.id)}
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <Icon className={cn("h-4 w-4", category.color)} />
                <span>{category.name}</span>
                <ChevronDown
                  className={cn(
                    "ml-auto h-4 w-4 transition-transform",
                    !isExpanded && "-rotate-90"
                  )}
                />
              </button>

              {isExpanded && (
                <div className="ml-4 space-y-0.5 mt-0.5">
                  {catTools.map((tool) => {
                    const isActive = location.pathname === tool.path
                    return (
                      <Link
                        key={tool.id}
                        to={tool.path}
                        onClick={onClose}
                        className={cn(
                          "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                          isActive
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                        )}
                      >
                        <tool.icon className="h-3.5 w-3.5" />
                        <span className="truncate">{tool.name}</span>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>
    </div>
  )

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar text-sidebar-foreground border-r transform transition-transform lg:hidden",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:border-r bg-sidebar text-sidebar-foreground">
        {sidebarContent}
      </aside>
    </>
  )
}
