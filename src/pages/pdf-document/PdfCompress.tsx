import { useState } from "react"
import { PDFDocument } from "pdf-lib"
import { Download } from "lucide-react"
import { ToolCard } from "@/components/layout/ToolCard"
import { FileDropzone } from "@/components/shared/FileDropzone"
import { useFileUpload } from "@/hooks/useFileUpload"

export default function PdfCompress() {
  const { files, isDragging, dropzoneProps, inputProps } = useFileUpload({ accept: ".pdf" })
  const [compressing, setCompressing] = useState(false)
  const [result, setResult] = useState<{ original: number; compressed: number } | null>(null)

  const file = files[0]

  const compress = async () => {
    if (!file) return
    setCompressing(true)
    try {
      const bytes = await file.arrayBuffer()
      const pdf = await PDFDocument.load(bytes)

      // Remove metadata to reduce size
      pdf.setTitle("")
      pdf.setAuthor("")
      pdf.setSubject("")
      pdf.setKeywords([])
      pdf.setProducer("")
      pdf.setCreator("")

      const compressed = await pdf.save({
        useObjectStreams: true,
        addDefaultPage: false,
      })

      setResult({ original: bytes.byteLength, compressed: compressed.byteLength })

      const blob = new Blob([compressed as BlobPart], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "compressed.pdf"
      a.click()
      URL.revokeObjectURL(url)
    } catch (e) {
      alert("Error: " + (e as Error).message)
    }
    setCompressing(false)
  }

  return (
    <ToolCard title="PDF Compress" description="Reduce PDF file size" categoryId="pdf-document">
      <div className="space-y-4">
        <FileDropzone isDragging={isDragging} dropzoneProps={dropzoneProps} inputProps={inputProps} label="Drop a PDF file here" accept="PDF files" />

        {file && (
          <div className="rounded-lg border p-3 text-sm">
            <span className="font-medium">{file.name}</span>
            <span className="text-muted-foreground ml-2">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
          </div>
        )}

        <div className="rounded-lg border bg-muted/50 p-3 text-xs text-muted-foreground">
          Note: Client-side compression removes metadata and uses object streams. For PDFs with large images, the size reduction may be modest. For best results with image-heavy PDFs, consider a server-side tool.
        </div>

        <button
          onClick={compress}
          disabled={!file || compressing}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          <Download className="h-4 w-4" />
          {compressing ? "Compressing..." : "Compress & Download"}
        </button>

        {result && (
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-lg border p-3">
              <div className="text-xl font-bold">{(result.original / 1024 / 1024).toFixed(2)}</div>
              <div className="text-xs text-muted-foreground">Original (MB)</div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-xl font-bold">{(result.compressed / 1024 / 1024).toFixed(2)}</div>
              <div className="text-xs text-muted-foreground">Compressed (MB)</div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-xl font-bold text-green-600">
                {Math.max(0, ((1 - result.compressed / result.original) * 100)).toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground">Reduction</div>
            </div>
          </div>
        )}
      </div>
    </ToolCard>
  )
}
