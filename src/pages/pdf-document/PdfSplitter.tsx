import { useState } from "react"
import { PDFDocument } from "pdf-lib"
import JSZip from "jszip"
import { Download } from "lucide-react"
import { ToolCard } from "@/components/layout/ToolCard"
import { FileDropzone } from "@/components/shared/FileDropzone"
import { useFileUpload } from "@/hooks/useFileUpload"

function parseRanges(input: string, maxPages: number): number[][] {
  const ranges: number[][] = []
  for (const part of input.split(",")) {
    const trimmed = part.trim()
    if (trimmed.includes("-")) {
      const [start, end] = trimmed.split("-").map(Number)
      if (start >= 1 && end <= maxPages && start <= end) {
        ranges.push(Array.from({ length: end - start + 1 }, (_, i) => start + i - 1))
      }
    } else {
      const page = Number(trimmed)
      if (page >= 1 && page <= maxPages) ranges.push([page - 1])
    }
  }
  return ranges
}

export default function PdfSplitter() {
  const { files, isDragging, dropzoneProps, inputProps } = useFileUpload({ accept: ".pdf" })
  const [pageCount, setPageCount] = useState(0)
  const [rangeInput, setRangeInput] = useState("")
  const [splitting, setSplitting] = useState(false)

  const file = files[0]

  const loadPageCount = async (f: File) => {
    const bytes = await f.arrayBuffer()
    const pdf = await PDFDocument.load(bytes)
    setPageCount(pdf.getPageCount())
    setRangeInput(`1-${pdf.getPageCount()}`)
  }

  if (file && pageCount === 0) loadPageCount(file)

  const split = async () => {
    if (!file || !rangeInput.trim()) return
    setSplitting(true)
    try {
      const bytes = await file.arrayBuffer()
      const ranges = parseRanges(rangeInput, pageCount)

      if (ranges.length === 1) {
        const newPdf = await PDFDocument.create()
        const src = await PDFDocument.load(bytes)
        const pages = await newPdf.copyPages(src, ranges[0])
        pages.forEach((p) => newPdf.addPage(p))
        const result = await newPdf.save()
        downloadBlob(new Blob([result as BlobPart], { type: "application/pdf" }), "split.pdf")
      } else {
        const zip = new JSZip()
        const src = await PDFDocument.load(bytes)
        for (let i = 0; i < ranges.length; i++) {
          const newPdf = await PDFDocument.create()
          const pages = await newPdf.copyPages(src, ranges[i])
          pages.forEach((p) => newPdf.addPage(p))
          const result = await newPdf.save()
          zip.file(`part-${i + 1}.pdf`, result)
        }
        const zipBlob = await zip.generateAsync({ type: "blob" })
        downloadBlob(zipBlob, "split-pdfs.zip")
      }
    } catch (e) {
      alert("Error: " + (e as Error).message)
    }
    setSplitting(false)
  }

  return (
    <ToolCard title="PDF Splitter" description="Split PDF into individual pages or ranges" categoryId="pdf-document">
      <div className="space-y-4">
        <FileDropzone isDragging={isDragging} dropzoneProps={dropzoneProps} inputProps={inputProps} label="Drop a PDF file here" accept="PDF files" />

        {file && (
          <>
            <div className="rounded-lg border p-3 text-sm">
              <span className="font-medium">{file.name}</span>
              <span className="text-muted-foreground ml-2">({pageCount} pages)</span>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Page Ranges</label>
              <input
                value={rangeInput}
                onChange={(e) => setRangeInput(e.target.value)}
                placeholder="e.g. 1-3, 5, 7-10"
                className="w-full rounded-lg border bg-background px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <p className="text-xs text-muted-foreground">Comma-separated ranges. Multiple ranges will be downloaded as a ZIP.</p>
            </div>
            <button
              onClick={split}
              disabled={splitting}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              {splitting ? "Splitting..." : "Split & Download"}
            </button>
          </>
        )}
      </div>
    </ToolCard>
  )
}

function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = name
  a.click()
  URL.revokeObjectURL(url)
}
