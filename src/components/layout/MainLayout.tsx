import { useState } from "react"
import { Outlet } from "react-router"
import { Sidebar } from "./Sidebar"
import { Header } from "./Header"
import { useFavorites } from "@/hooks/useFavorites"

export function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { favorites } = useFavorites()

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        favorites={favorites}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
