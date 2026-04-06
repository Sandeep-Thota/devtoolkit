import { useState, useEffect, useCallback } from "react"

type Theme = "light" | "dark" | "system"

function getSystemTheme(): "light" | "dark" {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

function applyTheme(theme: Theme) {
  const resolved = theme === "system" ? getSystemTheme() : theme
  document.documentElement.classList.toggle("dark", resolved === "dark")
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = localStorage.getItem("devtoolkit-theme") as Theme | null
    return stored || "system"
  })

  const setTheme = useCallback((t: Theme) => {
    localStorage.setItem("devtoolkit-theme", t)
    setThemeState(t)
    applyTheme(t)
  }, [])

  useEffect(() => {
    applyTheme(theme)
    const mq = window.matchMedia("(prefers-color-scheme: dark)")
    const handler = () => {
      if (theme === "system") applyTheme("system")
    }
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [theme])

  const toggleTheme = useCallback(() => {
    const resolved = theme === "system" ? getSystemTheme() : theme
    setTheme(resolved === "dark" ? "light" : "dark")
  }, [theme, setTheme])

  const resolvedTheme = theme === "system" ? getSystemTheme() : theme

  return { theme, setTheme, toggleTheme, resolvedTheme }
}
