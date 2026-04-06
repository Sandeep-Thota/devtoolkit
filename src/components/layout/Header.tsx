import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router"
import { Menu, Moon, Sun, Search, X } from "lucide-react"
import { useTheme } from "@/hooks/useTheme"
import { tools } from "@/data/tools"
import { categoryMap } from "@/data/categories"
import { cn } from "@/lib/utils"

interface HeaderProps {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const { toggleTheme, resolvedTheme } = useTheme()
  const navigate = useNavigate()
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const filtered = query.trim()
    ? tools.filter(
        (t) =>
          t.name.toLowerCase().includes(query.toLowerCase()) ||
          t.keywords.some((k) => k.includes(query.toLowerCase()))
      )
    : []

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setSearchOpen(true)
      }
      if (e.key === "Escape") {
        setSearchOpen(false)
        setQuery("")
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [])

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus()
  }, [searchOpen])

  return (
    <>
      <header className="flex h-14 items-center gap-3 border-b px-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-1.5 rounded-md hover:bg-accent transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>

        <button
          onClick={() => setSearchOpen(true)}
          className="flex flex-1 items-center gap-2 rounded-lg border bg-muted/50 px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted transition-colors max-w-md"
        >
          <Search className="h-4 w-4" />
          <span>Search tools...</span>
          <kbd className="ml-auto hidden sm:inline-flex items-center gap-0.5 rounded border bg-background px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
            <span className="text-xs">&#8984;</span>K
          </kbd>
        </button>

        <div className="ml-auto flex items-center gap-1">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md hover:bg-accent transition-colors"
            title={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
          >
            {resolvedTheme === "dark" ? (
              <Sun className="h-4.5 w-4.5" />
            ) : (
              <Moon className="h-4.5 w-4.5" />
            )}
          </button>
        </div>
      </header>

      {/* Search Modal */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] bg-black/50"
          onClick={() => {
            setSearchOpen(false)
            setQuery("")
          }}
        >
          <div
            className="w-full max-w-lg rounded-xl border bg-popover shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 border-b px-3">
              <Search className="h-4 w-4 text-muted-foreground shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tools..."
                className="flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && filtered.length > 0) {
                    navigate(filtered[0].path)
                    setSearchOpen(false)
                    setQuery("")
                  }
                }}
              />
              <button
                onClick={() => {
                  setSearchOpen(false)
                  setQuery("")
                }}
                className="p-1 rounded hover:bg-accent"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {query.trim() && (
              <div className="max-h-72 overflow-y-auto p-1">
                {filtered.length === 0 ? (
                  <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                    No tools found
                  </div>
                ) : (
                  filtered.map((tool) => {
                    const cat = categoryMap[tool.categoryId]
                    return (
                      <button
                        key={tool.id}
                        onClick={() => {
                          navigate(tool.path)
                          setSearchOpen(false)
                          setQuery("")
                        }}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm hover:bg-accent transition-colors"
                      >
                        <tool.icon className={cn("h-4 w-4 shrink-0", cat?.color)} />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{tool.name}</div>
                          <div className="text-xs text-muted-foreground truncate">
                            {tool.description}
                          </div>
                        </div>
                        <span className="text-[10px] rounded-full bg-secondary px-2 py-0.5 text-muted-foreground shrink-0">
                          {cat?.name}
                        </span>
                      </button>
                    )
                  })
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
