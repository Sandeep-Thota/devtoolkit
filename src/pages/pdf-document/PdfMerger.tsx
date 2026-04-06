import { useState } from "react"
import { PDFDocument } from "pdf-lib"
import { X, GripVertical, Download } from "lucide-react"
import { ToolCard } from "@/components/layout/ToolCard"
import { FileDropzone } from "@/components/shared/FileDropzone"
import { useFileUpload } from "@/hooks/useFileUpload"

export default function PdfMerger() {
  const { files, setFiles, isDragging, removeFile, dropzoneProps, inputProps } = useFileUpload({
    accept: ".pdf",
    multiple: true,
  })
  const [merging, setMerging] = useState(false)

  const merge = async () => {
    if (files.length < 2) return
    setMerging(true)
    try {
      const merged = await PDFDocument.create()
      for (const file of files) {
        const bytes = await file.arrayBuffer()
        const pdf = await PDFDocument.load(bytes)
        const pages = await merged.copyPages(pdf, pdf.getPageIndices())
        pages.forEach((page) => merged.addPage(page))
      }
      const result = await merged.save()
      const blob = new Blob([result as BlobPart], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "merged.pdf"
      a.click()
      URL.revokeObjectURL(url)
    } catch (e) {
      alert("Error merging PDFs: " + (e as Error).message)
    }
    setMerging(false)
  }

  const moveFile = (from: number, to: number) => {
    const arr = [...files]
    const [item] = arr.splice(from, 1)
    arr.splice(to, 0, item)
    setFiles(arr)
  }

  return (
    <ToolCard title="PDF Merger" description="Combine multiple PDF files into one" categoryId="pdf-document">
      <div className="space-y-4">
        <FileDropzone
          isDragging={isDragging}
          dropzoneProps={dropzoneProps}
          inputProps={inputProps}
          label="Drop PDF files here or click to upload"
          accept="PDF files"
        />

        {files.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Files ({files.length})</label>
            <div className="space-y-1">
              {files.map((file, i) => (
                <div key={i} className="flex items-center gap-2 rounded-lg border p-2">
                  <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                  <span className="flex-1 text-sm truncate">{file.name}</span>
                  <span className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(0)} KB</span>
                  {i > 0 && (
                    <button onClick={() => moveFile(i, i - 1)} className="text-xs text-muted-foreground hover:text-foreground">Up</button>
                  )}
                  {i < files.length - 1 && (
                    <button onClick={() => moveFile(i, i + 1)} className="text-xs text-muted-foreground hover:text-foreground">Down</button>
                  )}
                  <button onClick={() => removeFile(i)} className="p-1 rounded hover:bg-destructive/10 text-destructive">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={merge}
          disabled={files.length < 2 || merging}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          <Download className="h-4 w-4" />
          {merging ? "Merging..." : "Merge & Download"}
        </button>
      </div>
    </ToolCard>
  )
}
