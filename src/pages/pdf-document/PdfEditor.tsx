import { useState, useRef } from "react"
import { PDFDocument, rgb, StandardFonts } from "pdf-lib"
import { Download, Type, Trash2, Plus, RotateCcw } from "lucide-react"
import { ToolCard } from "@/components/layout/ToolCard"
import { FileDropzone } from "@/components/shared/FileDropzone"
import { useFileUpload } from "@/hooks/useFileUpload"

interface TextAnnotation {
  id: number
  text: string
  x: number
  y: number
  page: number
  fontSize: number
  color: string
}

let nextId = 1

export default function PdfEditor() {
  const { files, isDragging, dropzoneProps, inputProps, clearFiles } = useFileUpload({ accept: ".pdf" })
  const [pdfBytes, setPdfBytes] = useState<ArrayBuffer | null>(null)
  const [pageCount, setPageCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)
  const [pageUrls, setPageUrls] = useState<string[]>([])
  const [annotations, setAnnotations] = useState<TextAnnotation[]>([])
  const [newText, setNewText] = useState("Text here")
  const [fontSize, setFontSize] = useState(16)
  const [color, setColor] = useState("#000000")
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<"select" | "add">("add")
  const [dragging, setDragging] = useState<number | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  const overlayRef = useRef<HTMLDivElement>(null)

  const file = files[0]

  const handleFileUpload = async (f: File) => {
    setLoading(true)
    try {
      const bytes = await f.arrayBuffer()
      setPdfBytes(bytes.slice(0))

      const pdf = await PDFDocument.load(bytes)
      const count = pdf.getPageCount()
      setPageCount(count)
      setCurrentPage(0)
      setAnnotations([])

      // Create a blob URL for each page as a single-page PDF
      const urls: string[] = []
      for (let i = 0; i < count; i++) {
        const singlePdf = await PDFDocument.create()
        const [page] = await singlePdf.copyPages(pdf, [i])
        singlePdf.addPage(page)
        const singleBytes = await singlePdf.save()
        const blob = new Blob([singleBytes as BlobPart], { type: "application/pdf" })
        urls.push(URL.createObjectURL(blob))
      }
      // Revoke old URLs
      pageUrls.forEach((u) => URL.revokeObjectURL(u))
      setPageUrls(urls)
    } catch (e) {
      console.error("Error loading PDF:", e)
      alert("Error loading PDF: " + (e as Error).message)
    }
    setLoading(false)
  }

  // Trigger load when file changes
  if (file && !pdfBytes && !loading) {
    handleFileUpload(file)
  }

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (mode !== "add" || dragging !== null) return

    const overlay = overlayRef.current
    if (!overlay) return

    const rect = overlay.getBoundingClientRect()
    const xPct = ((e.clientX - rect.left) / rect.width) * 100
    const yPct = ((e.clientY - rect.top) / rect.height) * 100

    if (xPct < 0 || xPct > 100 || yPct < 0 || yPct > 100) return

    setAnnotations((prev) => [
      ...prev,
      { id: nextId++, text: newText, x: xPct, y: yPct, page: currentPage, fontSize, color },
    ])
  }

  const removeAnnotation = (id: number) => {
    setAnnotations((prev) => prev.filter((a) => a.id !== id))
  }

  const handleDragStart = (e: React.MouseEvent, id: number) => {
    e.stopPropagation()
    e.preventDefault()
    if (mode !== "select") return
    const annEl = (e.target as HTMLElement).closest("[data-annotation]") as HTMLElement
    if (!annEl) return
    const rect = annEl.getBoundingClientRect()
    setDragging(id)
    setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  const handleDragMove = (e: React.MouseEvent) => {
    if (dragging === null) return
    const overlay = overlayRef.current
    if (!overlay) return
    const rect = overlay.getBoundingClientRect()
    const xPct = ((e.clientX - rect.left - dragOffset.x) / rect.width) * 100
    const yPct = ((e.clientY - rect.top - dragOffset.y) / rect.height) * 100
    setAnnotations((prev) =>
      prev.map((a) => a.id === dragging ? { ...a, x: Math.max(0, Math.min(100, xPct)), y: Math.max(0, Math.min(100, yPct)) } : a)
    )
  }

  const handleDragEnd = () => setDragging(null)

  const save = async () => {
    if (!pdfBytes) return
    setSaving(true)
    try {
      const pdf = await PDFDocument.load(pdfBytes)
      const font = await pdf.embedFont(StandardFonts.Helvetica)

      for (const ann of annotations) {
        const page = pdf.getPage(ann.page)
        const { width, height } = page.getSize()
        const hex = ann.color.replace("#", "")
        const r = parseInt(hex.substring(0, 2), 16) / 255
        const g = parseInt(hex.substring(2, 4), 16) / 255
        const b = parseInt(hex.substring(4, 6), 16) / 255
        page.drawText(ann.text, {
          x: (ann.x / 100) * width,
          y: height - (ann.y / 100) * height,
          size: ann.fontSize,
          font,
          color: rgb(r, g, b),
        })
      }

      const result = await pdf.save()
      const blob = new Blob([result as BlobPart], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = file?.name?.replace(/\.pdf$/i, "-edited.pdf") || "edited.pdf"
      a.click()
      URL.revokeObjectURL(url)
    } catch (e) {
      alert("Error saving PDF: " + (e as Error).message)
    }
    setSaving(false)
  }

  const reset = () => {
    pageUrls.forEach((u) => URL.revokeObjectURL(u))
    setPdfBytes(null)
    setPageCount(0)
    setCurrentPage(0)
    setPageUrls([])
    setAnnotations([])
    clearFiles()
  }

  const pageAnnotations = annotations.filter((a) => a.page === currentPage)

  return (
    <ToolCard title="PDF Editor" description="Add text, fill forms, and annotate PDFs" categoryId="pdf-document">
      <div className="space-y-4">
        {!file && !pdfBytes && (
          <FileDropzone isDragging={isDragging} dropzoneProps={dropzoneProps} inputProps={inputProps} label="Drop a PDF file here" accept="PDF files" />
        )}

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <span className="ml-3 text-sm text-muted-foreground">Loading PDF...</span>
          </div>
        )}

        {pageCount > 0 && !loading && (
          <>
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-3 p-3 rounded-lg border bg-muted/50">
              <div className="flex items-center gap-1 rounded-md border p-0.5">
                <button onClick={() => setMode("add")} className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${mode === "add" ? "bg-primary text-primary-foreground" : "hover:bg-accent"}`}>
                  <Plus className="h-3.5 w-3.5 inline mr-1" />Add Text
                </button>
                <button onClick={() => setMode("select")} className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${mode === "select" ? "bg-primary text-primary-foreground" : "hover:bg-accent"}`}>
                  Move
                </button>
              </div>
              {mode === "add" && (
                <>
                  <Type className="h-4 w-4 text-muted-foreground" />
                  <input value={newText} onChange={(e) => setNewText(e.target.value)} className="flex-1 min-w-[100px] rounded-md border bg-background px-2 py-1 text-sm" placeholder="Text to add..." />
                  <div className="flex items-center gap-1">
                    <label className="text-xs text-muted-foreground">Size:</label>
                    <input type="number" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-14 rounded-md border bg-background px-2 py-1 text-sm" min={6} max={72} />
                  </div>
                  <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-8 w-8 rounded cursor-pointer border" />
                </>
              )}
            </div>

            {mode === "add" && (
              <p className="text-xs text-muted-foreground bg-primary/5 rounded-md px-3 py-2">
                Click anywhere on the page below to place your text. Switch to "Move" mode to reposition.
              </p>
            )}

            {/* Page navigation */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button onClick={() => setCurrentPage(Math.max(0, currentPage - 1))} disabled={currentPage === 0} className="rounded-md border px-3 py-1.5 text-sm disabled:opacity-50 hover:bg-accent transition-colors">Prev</button>
                <span className="text-sm font-medium">Page {currentPage + 1} of {pageCount}</span>
                <button onClick={() => setCurrentPage(Math.min(pageCount - 1, currentPage + 1))} disabled={currentPage === pageCount - 1} className="rounded-md border px-3 py-1.5 text-sm disabled:opacity-50 hover:bg-accent transition-colors">Next</button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{annotations.length} annotation{annotations.length !== 1 ? "s" : ""}</span>
                <button onClick={reset} className="inline-flex items-center gap-1 rounded-md border px-2.5 py-1.5 text-xs hover:bg-accent transition-colors">
                  <RotateCcw className="h-3 w-3" />New PDF
                </button>
              </div>
            </div>

            {/* PDF view with annotation overlay */}
            <div className="relative rounded-lg border overflow-hidden shadow-inner" style={{ backgroundColor: "#525659" }}>
              {/* PDF rendered via embed */}
              {pageUrls[currentPage] && (
                <embed
                  src={pageUrls[currentPage] + "#toolbar=0&navpanes=0&scrollbar=0"}
                  type="application/pdf"
                  className="w-full"
                  style={{ height: "800px", display: "block" }}
                />
              )}

              {/* Transparent clickable overlay for annotations */}
              <div
                ref={overlayRef}
                className="absolute inset-0"
                onClick={handleOverlayClick}
                onMouseMove={handleDragMove}
                onMouseUp={handleDragEnd}
                onMouseLeave={handleDragEnd}
                style={{ cursor: mode === "add" ? "crosshair" : "default" }}
              >
                {pageAnnotations.map((ann) => (
                  <div
                    key={ann.id}
                    data-annotation
                    className={`absolute group select-none ${mode === "select" ? "cursor-move" : "pointer-events-none"}`}
                    style={{
                      left: `${ann.x}%`,
                      top: `${ann.y}%`,
                      color: ann.color,
                      fontSize: `${ann.fontSize}px`,
                      fontFamily: "Helvetica, Arial, sans-serif",
                      lineHeight: 1,
                      textShadow: "0 0 3px rgba(255,255,255,0.9), 0 0 6px rgba(255,255,255,0.5)",
                      zIndex: 10,
                    }}
                    onMouseDown={(e) => handleDragStart(e, ann.id)}
                  >
                    <span className="whitespace-nowrap">{ann.text}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); removeAnnotation(ann.id) }}
                      className="absolute -top-3 -right-3 hidden group-hover:flex items-center justify-center h-5 w-5 bg-destructive text-white rounded-full shadow pointer-events-auto"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3">
              <button onClick={save} disabled={saving || annotations.length === 0} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50">
                <Download className="h-4 w-4" />{saving ? "Saving..." : "Save Edited PDF"}
              </button>
              {annotations.length > 0 && (
                <button onClick={() => setAnnotations([])} className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-accent transition-colors">Clear All</button>
              )}
            </div>

            {/* Annotation list */}
            {annotations.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Annotations</label>
                <div className="rounded-lg border divide-y max-h-48 overflow-auto">
                  {annotations.map((ann) => (
                    <div key={ann.id} className="flex items-center gap-2 px-3 py-2 text-sm">
                      <div className="w-3 h-3 rounded-full border shrink-0" style={{ backgroundColor: ann.color }} />
                      <span className="font-medium truncate flex-1">"{ann.text}"</span>
                      <span className="text-xs text-muted-foreground shrink-0">Page {ann.page + 1} | {ann.fontSize}px</span>
                      <button onClick={() => removeAnnotation(ann.id)} className="p-0.5 rounded hover:bg-destructive/10 text-destructive shrink-0">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </ToolCard>
  )
}
