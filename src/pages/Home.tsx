import { Link } from "react-router"
import { Star } from "lucide-react"
import { categories, categoryMap } from "@/data/categories"
import { tools, toolsByCategory } from "@/data/tools"
import { useFavorites } from "@/hooks/useFavorites"
import { cn } from "@/lib/utils"

export default function Home() {
  const { favorites, toggleFavorite, isFavorite } = useFavorites()
  const favoriteTools = tools.filter((t) => favorites.includes(t.id))

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Developer Toolkit
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          35+ free developer tools that run entirely in your browser. No data leaves your machine.
        </p>
      </div>

      {favoriteTools.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            Favorites
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {favoriteTools.map((tool) => {
              const cat = categoryMap[tool.categoryId]
              return (
                <ToolGridCard
                  key={tool.id}
                  tool={tool}
                  category={cat}
                  isFav={true}
                  onToggleFav={() => toggleFavorite(tool.id)}
                />
              )
            })}
          </div>
        </section>
      )}

      {categories.map((category) => {
        const catTools = toolsByCategory(category.id)
        const Icon = category.icon
        return (
          <section key={category.id}>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Icon className={cn("h-4 w-4", category.color)} />
              {category.name}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {catTools.map((tool) => (
                <ToolGridCard
                  key={tool.id}
                  tool={tool}
                  category={category}
                  isFav={isFavorite(tool.id)}
                  onToggleFav={() => toggleFavorite(tool.id)}
                />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}

function ToolGridCard({
  tool,
  category,
  isFav,
  onToggleFav,
}: {
  tool: (typeof tools)[0]
  category: { name: string; color: string }
  isFav: boolean
  onToggleFav: () => void
}) {
  return (
    <div className="group relative rounded-xl border bg-card p-4 hover:shadow-md hover:border-primary/30 transition-all">
      <Link to={tool.path} className="absolute inset-0 z-10" />
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={cn("rounded-lg bg-primary/10 p-2", category.color)}>
            <tool.icon className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-medium text-sm">{tool.name}</h3>
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
              {tool.description}
            </p>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onToggleFav()
          }}
          className="relative z-20 p-1 rounded hover:bg-accent transition-colors opacity-0 group-hover:opacity-100"
          style={isFav ? { opacity: 1 } : undefined}
        >
          <Star
            className={cn(
              "h-3.5 w-3.5",
              isFav ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"
            )}
          />
        </button>
      </div>
    </div>
  )
}
