import { useState, useMemo } from "react"
import { ToolCard } from "@/components/layout/ToolCard"
import { CopyButton } from "@/components/shared/CopyButton"

function hexToRgb(hex: string): [number, number, number] | null {
  const match = hex.replace("#", "").match(/^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i)
  if (!match) return null
  return [parseInt(match[1], 16), parseInt(match[2], 16), parseInt(match[3], 16)]
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  const l = (max + min) / 2
  if (max === min) return [0, 0, Math.round(l * 100)]
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h = 0
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
  else if (max === g) h = ((b - r) / d + 2) / 6
  else h = ((r - g) / d + 4) / 6
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)]
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  h /= 360; s /= 100; l /= 100
  if (s === 0) { const v = Math.round(l * 255); return [v, v, v] }
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1 / 6) return p + (q - p) * 6 * t
    if (t < 1 / 2) return q
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
    return p
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s
  const p = 2 * l - q
  return [
    Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
    Math.round(hue2rgb(p, q, h) * 255),
    Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
  ]
}

function parseColor(input: string): [number, number, number] | null {
  const trimmed = input.trim()

  // HEX
  const hex = trimmed.match(/^#?([a-f\d]{6}|[a-f\d]{3})$/i)
  if (hex) {
    let h = hex[1]
    if (h.length === 3) h = h.split("").map((c) => c + c).join("")
    return hexToRgb("#" + h)
  }

  // RGB
  const rgb = trimmed.match(/^rgb\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i)
  if (rgb) return [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])]

  // HSL
  const hsl = trimmed.match(/^hsl\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})%?\s*,\s*(\d{1,3})%?\s*\)$/i)
  if (hsl) return hslToRgb(Number(hsl[1]), Number(hsl[2]), Number(hsl[3]))

  return null
}

export default function ColorConverter() {
  const [input, setInput] = useState("#6d28d9")

  const color = useMemo(() => {
    const rgb = parseColor(input)
    if (!rgb) return null
    const [r, g, b] = rgb
    const hex = rgbToHex(r, g, b)
    const [h, s, l] = rgbToHsl(r, g, b)
    return { r, g, b, hex, h, s, l }
  }, [input])

  const formats = color
    ? [
        { label: "HEX", value: color.hex },
        { label: "RGB", value: `rgb(${color.r}, ${color.g}, ${color.b})` },
        { label: "HSL", value: `hsl(${color.h}, ${color.s}%, ${color.l}%)` },
      ]
    : []

  return (
    <ToolCard
      title="Color Converter"
      description="Convert between HEX, RGB, and HSL colors"
      categoryId="dev-utilities"
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-end gap-4">
          <div className="space-y-2 flex-1 min-w-[200px]">
            <label className="text-sm font-medium">Color Input</label>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="#6d28d9 or rgb(109,40,217) or hsl(263,69%,50%)"
              className="w-full rounded-lg border bg-background px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              spellCheck={false}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Picker</label>
            <input
              type="color"
              value={color?.hex || "#6d28d9"}
              onChange={(e) => setInput(e.target.value)}
              className="h-10 w-16 rounded-lg border cursor-pointer"
            />
          </div>
        </div>

        {!color && input.trim() && (
          <p className="text-sm text-destructive">
            Unrecognized format. Try: #hex, rgb(r,g,b), or hsl(h,s%,l%)
          </p>
        )}

        {color && (
          <div className="space-y-4">
            <div
              className="h-32 rounded-xl border shadow-inner"
              style={{ backgroundColor: color.hex }}
            />

            <div className="grid gap-3 sm:grid-cols-3">
              {formats.map(({ label, value }) => (
                <div key={label} className="rounded-lg border p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">
                      {label}
                    </span>
                    <CopyButton text={value} />
                  </div>
                  <div className="font-mono text-sm">{value}</div>
                </div>
              ))}
            </div>

            <div className="rounded-lg border p-3 space-y-2">
              <span className="text-xs font-medium text-muted-foreground">
                CSS Variables
              </span>
              <pre className="font-mono text-xs text-muted-foreground">
{`--color: ${color.hex};
--color-rgb: ${color.r} ${color.g} ${color.b};
--color-hsl: ${color.h} ${color.s}% ${color.l}%;`}
              </pre>
            </div>
          </div>
        )}
      </div>
    </ToolCard>
  )
}
