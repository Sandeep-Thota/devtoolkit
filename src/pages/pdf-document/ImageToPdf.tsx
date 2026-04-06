import { useState } from "react"
import { PDFDocument } from "pdf-lib"
import { X, Download } from "lucide-react"
import { ToolCard } from "@/components/layout/ToolCard"
import { FileDropzone } from "@/components/shared/FileDropzone"
import { useFileUpload } from "@/hooks/useFileUpload"

export default function ImageToPdf() {
  const { files, setFiles, isDragging, removeFile, dropzoneProps, inputProps } = useFileUpload({
    accept: "image/*",
    multiple: true,
  })
  const [pageSize, setPageSize] = useState<"fit" | "a4" | "letter">("a4")
  const [creating, setCreating] = useState(false)

  const pageSizes: Record<string, [number, number]> = {
    a4: [595.28, 841.89],
    letter: [612, 792],
  }

  const moveFile = (from: number, to: number) => {
    const arr = [...files]
    const [item] = arr.splice(from, 1)
    arr.splice(to, 0, item)
    setFiles(arr)
  }

  const create = async () => {
    if (files.length === 0) return
    setCreating(true)
    try {
      const pdf = await PDFDocument.create()

      for (const file of files) {
        const bytes = await file.arrayBuffer()
        let image
        if (file.type === "image/png") {
          image = await pdf.embedPng(bytes)
        } else {
          image = await pdf.embedJpg(bytes)
        }

        if (pageSize === "fit") {
          const page = pdf.addPage([image.width, image.height])
          page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height })
        } else {
          const [pageW, pageH] = pageSizes[pageSize]
          const page = pdf.addPage([pageW, pageH])
          const margin = 40
          const maxW = pageW - margin * 2
          const maxH = pageH - margin * 2
          const scale = Math.min(maxW / image.width, maxH / image.height, 1)
          const w = image.width * scale
          const h = image.height * scale
          page.drawImage(image, {
            x: (pageW - w) / 2,
            y: (pageH - h) / 2,
            width: w,
            height: h,
          })
        }
      }

      const result = await pdf.save()
      const blob = new Blob([result as BlobPart], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "images.pdf"
      a.click()
      URL.revokeObjectURL(url)
    } catch (e) {
      alert("Error: " + (e as Error).message)
    }
    setCreating(false)
  }

  return (
    <ToolCard title="Image to PDF" description="Convert images to a PDF document" categoryId="pdf-document">
      <div className="space-y-4">
        <FileDropzone isDragging={isDragging} dropzoneProps={dropzoneProps} inputProps={inputProps} label="Drop images here" accept="JPEG, PNG" />

        {files.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Images ({files.length})</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {files.map((file, i) => (
                <div key={i} className="relative group rounded-lg border overflow-hidden">
                  <img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-24 object-cover" />
                  <div className="absolute bottom-0 inset-x-0 bg-black/50 px-1.5 py-0.5 text-[10px] text-white truncate">{file.name}</div>
                  <div className="absolute top-1 right-1 flex gap-0.5 opacity-0 group-hover:opacity-100">
                    {i > 0 && <button onClick={() => moveFile(i, i - 1)} className="bg-black/50 text-white text-[10px] rounded px-1">Left</button>}
                    {i < files.length - 1 && <button onClick={() => moveFile(i, i + 1)} className="bg-black/50 text-white text-[10px] rounded px-1">Right</button>}
                    <button onClick={() => removeFile(i)} className="bg-red-500/80 text-white rounded p-0.5"><X className="h-3 w-3" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-sm text-muted-foreground">Page Size:</label>
            <select value={pageSize} onChange={(e) => setPageSize(e.target.value as typeof pageSize)} className="rounded-md border bg-background px-2 py-1 text-sm">
              <option value="a4">A4</option>
              <option value="letter">Letter</option>
              <option value="fit">Fit to Image</option>
            </select>
          </div>
          <button
            onClick={create}
            disabled={files.length === 0 || creating}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            {creating ? "Creating..." : "Create PDF"}
          </button>
        </div>
      </div>
    </ToolCard>
  )
}
