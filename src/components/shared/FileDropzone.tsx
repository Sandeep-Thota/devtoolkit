import { Upload } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileDropzoneProps {
  isDragging: boolean
  dropzoneProps: Record<string, unknown>
  inputProps: Record<string, unknown>
  label?: string
  accept?: string
  children?: React.ReactNode
}

export function FileDropzone({
  isDragging,
  dropzoneProps,
  inputProps,
  label = "Click or drag files here",
  accept,
  children,
}: FileDropzoneProps) {
  return (
    <div
      {...(dropzoneProps as React.HTMLAttributes<HTMLDivElement>)}
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-8 cursor-pointer transition-colors",
        isDragging ? "border-primary bg-primary/5" : "hover:border-primary/50 hover:bg-accent/50"
      )}
    >
      <input {...(inputProps as React.InputHTMLAttributes<HTMLInputElement>)} />
      <Upload className="h-8 w-8 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">{label}</p>
      {accept && <p className="text-xs text-muted-foreground">{accept}</p>}
      {children}
    </div>
  )
}
