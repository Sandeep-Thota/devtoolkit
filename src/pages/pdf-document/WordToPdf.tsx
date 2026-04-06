import { useState, useRef, useCallback } from "react"
import mammoth from "mammoth"
import html2canvas from "html2canvas"
import { jsPDF } from "jspdf"
import { Download, Eye, EyeOff } from "lucide-react"
import { ToolCard } from "@/components/layout/ToolCard"
import { FileDropzone } from "@/components/shared/FileDropzone"
import { useFileUpload } from "@/hooks/useFileUpload"

export default function WordToPdf() {
  const { files, isDragging, dropzoneProps, inputProps } = useFileUpload({
    accept: ".docx,.doc",
  })
  const [converting, setConverting] = useState(false)
  const [htmlContent, setHtmlContent] = useState("")
  const [showPreview, setShowPreview] = useState(true)
  const [progress, setProgress] = useState("")
  const renderRef = useRef<HTMLDivElement>(null)

  const file = files[0]

  // Step 1: Parse DOCX to HTML
  const parseDocx = useCallback(async () => {
    if (!file) return
    const bytes = await file.arrayBuffer()
    const result = await mammoth.convertToHtml({ arrayBuffer: bytes })
    setHtmlContent(result.value)
  }, [file])

  // Auto-parse when file is selected
  if (file && !htmlContent && !converting) {
    parseDocx()
  }

  const convert = async () => {
    if (!htmlContent || !renderRef.current) return
    setConverting(true)

    try {
      setProgress("Rendering document...")

      // Create an offscreen container with A4-like dimensions for rendering
      const container = document.createElement("div")
      container.style.cssText = `
        position: fixed; top: -9999px; left: -9999px;
        width: 595px;
        background: white; color: black;
        font-family: 'Times New Roman', Georgia, serif;
        font-size: 11pt; line-height: 1.6;
        padding: 50px 55px;
        box-sizing: border-box;
      `

      // Add styles that match a Word-like look
      const styleEl = document.createElement("style")
      styleEl.textContent = `
        .word-render h1 { font-size: 18pt; font-weight: bold; margin: 16pt 0 8pt 0; line-height: 1.3; }
        .word-render h2 { font-size: 15pt; font-weight: bold; margin: 14pt 0 6pt 0; line-height: 1.3; }
        .word-render h3 { font-size: 13pt; font-weight: bold; margin: 12pt 0 4pt 0; line-height: 1.3; }
        .word-render h4 { font-size: 12pt; font-weight: bold; font-style: italic; margin: 10pt 0 4pt 0; line-height: 1.3; }
        .word-render p { margin: 0 0 6pt 0; text-align: justify; }
        .word-render strong, .word-render b { font-weight: bold; }
        .word-render em, .word-render i { font-style: italic; }
        .word-render ul, .word-render ol { margin: 6pt 0; padding-left: 24pt; }
        .word-render li { margin: 3pt 0; }
        .word-render table { border-collapse: collapse; width: 100%; margin: 8pt 0; font-size: 9pt; }
        .word-render table td, .word-render table th { border: 1px solid #333; padding: 4pt 6pt; vertical-align: top; }
        .word-render table th { background: #f0f0f0; font-weight: bold; }
        .word-render img { max-width: 100%; height: auto; margin: 8pt 0; }
        .word-render sup { font-size: 0.7em; vertical-align: super; }
        .word-render sub { font-size: 0.7em; vertical-align: sub; }
        .word-render a { color: #0563C1; text-decoration: underline; }
        .word-render blockquote { border-left: 3px solid #ccc; padding-left: 12pt; margin: 6pt 0; color: #555; }
      `
      container.appendChild(styleEl)

      const contentDiv = document.createElement("div")
      contentDiv.className = "word-render"
      contentDiv.innerHTML = htmlContent
      container.appendChild(contentDiv)
      document.body.appendChild(container)

      // Wait for images to load
      const images = container.querySelectorAll("img")
      if (images.length > 0) {
        setProgress(`Loading ${images.length} image(s)...`)
        await Promise.all(
          Array.from(images).map(
            (img) =>
              new Promise<void>((resolve) => {
                if (img.complete) resolve()
                else {
                  img.onload = () => resolve()
                  img.onerror = () => resolve()
                }
              })
          )
        )
      }

      // A4 dimensions in points
      const pageWidthPt = 595.28
      const pageHeightPt = 841.89
      const marginPt = 50
      const contentWidthPt = pageWidthPt - marginPt * 2
      const contentHeightPt = pageHeightPt - marginPt * 2

      // Render to canvas using html2canvas
      setProgress("Generating PDF pages...")
      const totalHeight = container.scrollHeight
      const scale = 2 // Higher quality
      const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" })

      // Calculate how many pages we need
      const renderWidth = 595 - 110 // matches padding
      const pixelsPerPage = (contentHeightPt / contentWidthPt) * renderWidth
      const totalPages = Math.ceil(totalHeight / pixelsPerPage)

      for (let page = 0; page < totalPages; page++) {
        setProgress(`Rendering page ${page + 1} of ${totalPages}...`)

        if (page > 0) pdf.addPage()

        const yOffset = page * pixelsPerPage

        const canvas = await html2canvas(container, {
          scale,
          useCORS: true,
          backgroundColor: "#ffffff",
          width: 595,
          height: Math.min(pixelsPerPage, totalHeight - yOffset),
          y: yOffset,
          windowWidth: 595,
          scrollY: -yOffset,
        })

        const imgData = canvas.toDataURL("image/jpeg", 0.95)
        const imgWidth = contentWidthPt
        const imgHeight = (canvas.height / canvas.width) * imgWidth

        pdf.addImage(imgData, "JPEG", marginPt, marginPt, imgWidth, Math.min(imgHeight, contentHeightPt))
      }

      // Clean up
      document.body.removeChild(container)

      setProgress("Saving PDF...")
      pdf.save(file?.name?.replace(/\.docx?$/i, ".pdf") || "document.pdf")
      setProgress("Done!")
    } catch (e) {
      console.error("Conversion error:", e)
      alert("Error converting: " + (e as Error).message)
      setProgress("")
    }
    setConverting(false)
  }

  return (
    <ToolCard title="Word to PDF" description="Convert Word documents to PDF format" categoryId="pdf-document">
      <div className="space-y-4">
        <FileDropzone isDragging={isDragging} dropzoneProps={dropzoneProps} inputProps={inputProps} label="Drop a Word document here" accept=".docx files" />

        {file && (
          <div className="rounded-lg border p-3 text-sm flex items-center justify-between">
            <div>
              <span className="font-medium">{file.name}</span>
              <span className="text-muted-foreground ml-2">({(file.size / 1024).toFixed(0)} KB)</span>
            </div>
            {htmlContent && (
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPreview ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                {showPreview ? "Hide" : "Show"} Preview
              </button>
            )}
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            onClick={convert}
            disabled={!htmlContent || converting}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            {converting ? "Converting..." : "Convert to PDF"}
          </button>
          {progress && <span className="text-sm text-muted-foreground">{progress}</span>}
        </div>

        {/* Hidden render container for PDF generation */}
        <div ref={renderRef} style={{ position: "fixed", top: "-9999px", left: "-9999px" }} />

        {/* Visible preview */}
        {htmlContent && showPreview && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Document Preview</label>
            <div
              className="rounded-lg border bg-white text-black p-8 max-h-[600px] overflow-auto"
              style={{
                fontFamily: "'Times New Roman', Georgia, serif",
                fontSize: "11pt",
                lineHeight: 1.6,
              }}
            >
              <style>{`
                .doc-preview h1 { font-size: 18pt; font-weight: bold; margin: 16pt 0 8pt 0; line-height: 1.3; }
                .doc-preview h2 { font-size: 15pt; font-weight: bold; margin: 14pt 0 6pt 0; line-height: 1.3; }
                .doc-preview h3 { font-size: 13pt; font-weight: bold; margin: 12pt 0 4pt 0; line-height: 1.3; }
                .doc-preview h4 { font-size: 12pt; font-weight: bold; font-style: italic; margin: 10pt 0 4pt 0; }
                .doc-preview p { margin: 0 0 6pt 0; text-align: justify; }
                .doc-preview strong, .doc-preview b { font-weight: bold; }
                .doc-preview em, .doc-preview i { font-style: italic; }
                .doc-preview ul, .doc-preview ol { margin: 6pt 0; padding-left: 24pt; }
                .doc-preview li { margin: 3pt 0; }
                .doc-preview table { border-collapse: collapse; width: 100%; margin: 8pt 0; font-size: 9pt; }
                .doc-preview table td, .doc-preview table th { border: 1px solid #333; padding: 4pt 6pt; }
                .doc-preview table th { background: #f0f0f0; font-weight: bold; }
                .doc-preview img { max-width: 100%; height: auto; margin: 8pt 0; }
                .doc-preview a { color: #0563C1; text-decoration: underline; }
              `}</style>
              <div className="doc-preview" dangerouslySetInnerHTML={{ __html: htmlContent }} />
            </div>
          </div>
        )}
      </div>
    </ToolCard>
  )
}
