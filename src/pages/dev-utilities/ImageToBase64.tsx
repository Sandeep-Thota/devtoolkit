import { useState, useRef } from "react"
import { Upload } from "lucide-react"
import { ToolCard } from "@/components/layout/ToolCard"
import { CopyButton } from "@/components/shared/CopyButton"

export default function ImageToBase64() {
  const [dataUrl, setDataUrl] = useState("")
  const [fileName, setFileName] = useState("")
  const [fileSize, setFileSize] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    setFileName(file.name)
    setFileSize(file.size)
    const reader = new FileReader()
    reader.onload = () => setDataUrl(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const base64Only = dataUrl.split(",")[1] || ""
  const imgTag = dataUrl ? `<img src="${dataUrl}" alt="${fileName}" />` : ""
  const cssUrl = dataUrl ? `background-image: url('${dataUrl}');` : ""

  return (
    <ToolCard title="Image to Base64" description="Convert images to Base64 data URIs" categoryId="dev-utilities">
      <div className="space-y-4">
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-8 cursor-pointer hover:border-primary/50 hover:bg-accent/50 transition-colors"
        >
          <Upload className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Click or drag an image here</p>
          <p className="text-xs text-muted-foreground">JPEG, PNG, SVG, WebP, GIF</p>
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
        </div>

        {dataUrl && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <img src={dataUrl} alt="Preview" className="h-24 w-24 rounded-lg object-contain border" />
              <div className="text-sm">
                <div className="font-medium">{fileName}</div>
                <div className="text-muted-foreground">{(fileSize / 1024).toFixed(1)} KB</div>
                <div className="text-muted-foreground">Base64: {(base64Only.length / 1024).toFixed(1)} KB</div>
              </div>
            </div>
            {[
              { label: "Data URI", value: dataUrl },
              { label: "Base64 String", value: base64Only },
              { label: "HTML <img> Tag", value: imgTag },
              { label: "CSS Background", value: cssUrl },
            ].map(({ label, value }) => (
              <div key={label} className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">{label}</label>
                  <CopyButton text={value} />
                </div>
                <div className="rounded-lg border bg-muted/50 p-2 font-mono text-xs max-h-24 overflow-auto break-all">{value}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolCard>
  )
}
