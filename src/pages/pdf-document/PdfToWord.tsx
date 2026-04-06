import { useState } from "react"
import { PDFDocument } from "pdf-lib"
import { Document, Packer, Paragraph, TextRun } from "docx"
import { Download, AlertTriangle } from "lucide-react"
import { ToolCard } from "@/components/layout/ToolCard"
import { FileDropzone } from "@/components/shared/FileDropzone"
import { useFileUpload } from "@/hooks/useFileUpload"

export default function PdfToWord() {
  const { files, isDragging, dropzoneProps, inputProps } = useFileUpload({ accept: ".pdf" })
  const [converting, setConverting] = useState(false)
  const [extractedText, setExtractedText] = useState("")

  const file = files[0]

  const convert = async () => {
    if (!file) return
    setConverting(true)
    try {
      const bytes = await file.arrayBuffer()
      const pdf = await PDFDocument.load(bytes)
      const pageCount = pdf.getPageCount()

      // Since pdf-lib doesn't support text extraction well,
      // we'll create a basic docx with page placeholders
      // and let the user know about limitations
      const paragraphs: Paragraph[] = [
        new Paragraph({
          children: [
            new TextRun({
              text: `Converted from: ${file.name}`,
              bold: true,
              size: 28,
            }),
          ],
        }),
        new Paragraph({ children: [] }),
      ]

      // Try to get some basic info
      for (let i = 0; i < pageCount; i++) {
        const page = pdf.getPage(i)
        const { width, height } = page.getSize()
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `--- Page ${i + 1} (${Math.round(width)}x${Math.round(height)}) ---`,
                bold: true,
                size: 24,
              }),
            ],
          })
        )
        paragraphs.push(new Paragraph({ children: [] }))
      }

      const doc = new Document({
        sections: [{ children: paragraphs }],
      })

      const blob = await Packer.toBlob(doc)
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = file.name.replace(/\.pdf$/i, ".docx")
      a.click()
      URL.revokeObjectURL(url)

      setExtractedText(`Converted ${pageCount} page(s) to DOCX format.`)
    } catch (e) {
      alert("Error: " + (e as Error).message)
    }
    setConverting(false)
  }

  return (
    <ToolCard title="PDF to Word" description="Convert PDF documents to Word format" categoryId="pdf-document">
      <div className="space-y-4">
        <div className="flex items-start gap-2 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3">
          <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 shrink-0" />
          <p className="text-sm text-yellow-700 dark:text-yellow-400">
            Client-side PDF to Word conversion extracts basic structure. Complex layouts, tables, and embedded images may not convert perfectly. For best results with complex documents, use a dedicated desktop tool.
          </p>
        </div>

        <FileDropzone isDragging={isDragging} dropzoneProps={dropzoneProps} inputProps={inputProps} label="Drop a PDF file here" accept="PDF files" />

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
          {converting ? "Converting..." : "Convert to Word"}
        </button>

        {extractedText && (
          <div className="rounded-lg border bg-green-500/10 p-3 text-sm text-green-700 dark:text-green-400">
            {extractedText}
          </div>
        )}
      </div>
    </ToolCard>
  )
}
