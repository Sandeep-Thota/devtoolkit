import { useState, useRef } from "react"
import mammoth from "mammoth"
import { jsPDF } from "jspdf"
import { Download } from "lucide-react"
import { ToolCard } from "@/components/layout/ToolCard"
import { FileDropzone } from "@/components/shared/FileDropzone"
import { useFileUpload } from "@/hooks/useFileUpload"

export default function WordToPdf() {
  const { files, isDragging, dropzoneProps, inputProps } = useFileUpload({
    accept: ".docx,.doc",
  })
  const [converting, setConverting] = useState(false)
  const [htmlPreview, setHtmlPreview] = useState("")
  const previewRef = useRef<HTMLDivElement>(null)

  const file = files[0]

  const convert = async () => {
    if (!file) return
    setConverting(true)
    try {
      const bytes = await file.arrayBuffer()
      const result = await mammoth.convertToHtml({ arrayBuffer: bytes })
      setHtmlPreview(result.value)

      // Create PDF from the HTML content using jsPDF
      const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" })

      // Parse HTML and extract text content
      const tempDiv = document.createElement("div")
      tempDiv.innerHTML = result.value
      const textContent = tempDiv.innerText || tempDiv.textContent || ""

      // Simple text-to-PDF approach
      const lines = doc.splitTextToSize(textContent, 500)
      let y = 40
      const lineHeight = 14
      const pageHeight = doc.internal.pageSize.getHeight()

      for (const line of lines) {
        if (y + lineHeight > pageHeight - 40) {
          doc.addPage()
          y = 40
        }
        doc.text(line, 50, y)
        y += lineHeight
      }

      doc.save(file.name.replace(/\.docx?$/i, ".pdf"))
    } catch (e) {
      alert("Error: " + (e as Error).message)
    }
    setConverting(false)
  }

  return (
    <ToolCard title="Word to PDF" description="Convert Word documents to PDF format" categoryId="pdf-document">
      <div className="space-y-4">
        <FileDropzone isDragging={isDragging} dropzoneProps={dropzoneProps} inputProps={inputProps} label="Drop a Word document here" accept=".docx files" />

        {file && (
          <div className="rounded-lg border p-3 text-sm">
            <span className="font-medium">{file.name}</span>
            <span className="text-muted-foreground ml-2">({(file.size / 1024).toFixed(0)} KB)</span>
          </div>
        )}

        <button
          onClick={convert}
          disabled={!file || converting}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          <Download className="h-4 w-4" />
          {converting ? "Converting..." : "Convert to PDF"}
        </button>

        {htmlPreview && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Document Preview</label>
            <div
              ref={previewRef}
              className="rounded-lg border bg-white text-black p-6 max-h-96 overflow-auto prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: htmlPreview }}
            />
          </div>
        )}
      </div>
    </ToolCard>
  )
}
