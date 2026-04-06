import { useState, useCallback, useRef } from "react"

interface UseFileUploadOptions {
  accept?: string
  multiple?: boolean
  maxSize?: number
}

export function useFileUpload(options: UseFileUploadOptions = {}) {
  const { accept, multiple = false, maxSize } = options
  const [files, setFiles] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const addFiles = useCallback(
    (newFiles: FileList | File[]) => {
      const arr = Array.from(newFiles).filter((f) => {
        if (maxSize && f.size > maxSize) return false
        return true
      })
      setFiles((prev) => (multiple ? [...prev, ...arr] : arr.slice(0, 1)))
    },
    [multiple, maxSize]
  )

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const clearFiles = useCallback(() => setFiles([]), [])

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const onDragLeave = useCallback(() => setIsDragging(false), [])

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      addFiles(e.dataTransfer.files)
    },
    [addFiles]
  )

  const onClick = useCallback(() => inputRef.current?.click(), [])

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) addFiles(e.target.files)
      e.target.value = ""
    },
    [addFiles]
  )

  return {
    files,
    setFiles,
    isDragging,
    removeFile,
    clearFiles,
    inputProps: { ref: inputRef, type: "file" as const, accept, multiple, onChange: onInputChange, className: "hidden" as const },
    dropzoneProps: { onDragOver, onDragLeave, onDrop, onClick },
  }
}
