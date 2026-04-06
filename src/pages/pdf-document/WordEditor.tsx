import { useState, useCallback } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import TextAlign from "@tiptap/extension-text-align"
import { TextStyle } from "@tiptap/extension-text-style"
import Color from "@tiptap/extension-color"
import Highlight from "@tiptap/extension-highlight"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import Placeholder from "@tiptap/extension-placeholder"
import { Table } from "@tiptap/extension-table"
import TableRow from "@tiptap/extension-table-row"
import TableCell from "@tiptap/extension-table-cell"
import TableHeader from "@tiptap/extension-table-header"
import mammoth from "mammoth"
import {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  AlignmentType, Table as DocxTable, TableRow as DocxTableRow,
  TableCell as DocxTableCell, WidthType, BorderStyle,
} from "docx"
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Heading1, Heading2, Heading3,
  Quote, Minus, Undo2, Redo2, Download, Upload, FileText,
  Link as LinkIcon, ImagePlus, Highlighter, Type, Table as TableIcon,
  Palette, FilePlus,
} from "lucide-react"
import { ToolCard } from "@/components/layout/ToolCard"
import { cn } from "@/lib/utils"

function ToolbarButton({
  onClick,
  active = false,
  disabled = false,
  title,
  children,
}: {
  onClick: () => void
  active?: boolean
  disabled?: boolean
  title: string
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        "p-1.5 rounded transition-colors",
        active ? "bg-primary/20 text-primary" : "hover:bg-accent text-foreground",
        disabled && "opacity-30 cursor-not-allowed"
      )}
    >
      {children}
    </button>
  )
}

function ToolbarDivider() {
  return <div className="w-px h-6 bg-border mx-0.5" />
}

export default function WordEditor() {
  const [fileName, setFileName] = useState("Untitled Document")
  const [importing, setImporting] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Link.configure({ openOnClick: false }),
      Image,
      Placeholder.configure({ placeholder: "Start typing your document here..." }),
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
    ],
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none min-h-[600px] px-12 py-8",
        style: "color: #1a1a1a;",
      },
    },
    content: "",
  })

  // Import .docx file
  const handleImport = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !editor) return
    setImporting(true)
    try {
      const bytes = await file.arrayBuffer()
      const result = await mammoth.convertToHtml({ arrayBuffer: bytes })
      editor.commands.setContent(result.value)
      setFileName(file.name.replace(/\.docx?$/i, ""))
    } catch (err) {
      alert("Error importing: " + (err as Error).message)
    }
    setImporting(false)
    e.target.value = ""
  }, [editor])

  // Export as .docx
  const handleExport = useCallback(async () => {
    if (!editor) return

    const html = editor.getHTML()

    // Parse HTML into docx paragraphs
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, "text/html")
    const children = convertNodesToParagraphs(doc.body)

    const docxDoc = new Document({
      sections: [{ children }],
    })

    const blob = await Packer.toBlob(docxDoc)
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${fileName || "document"}.docx`
    a.click()
    URL.revokeObjectURL(url)
  }, [editor, fileName])

  // Add link
  const addLink = useCallback(() => {
    if (!editor) return
    const url = prompt("Enter URL:")
    if (url) {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
    }
  }, [editor])

  // Add image
  const addImage = useCallback(() => {
    if (!editor) return
    const url = prompt("Enter image URL:")
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }, [editor])

  // Insert table
  const insertTable = useCallback(() => {
    if (!editor) return
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
  }, [editor])

  // New document
  const newDocument = useCallback(() => {
    if (!editor) return
    if (editor.getHTML() !== "<p></p>" && !confirm("Create a new document? Unsaved changes will be lost.")) return
    editor.commands.clearContent()
    setFileName("Untitled Document")
  }, [editor])

  if (!editor) return null

  return (
    <ToolCard title="Word Editor" description="Create, edit, and save Word documents — no Microsoft Word needed" categoryId="pdf-document">
      <div className="space-y-3">
        {/* File bar */}
        <div className="flex items-center gap-3 p-2 rounded-lg border bg-muted/50">
          <FileText className="h-4 w-4 text-blue-500 shrink-0" />
          <input
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="flex-1 bg-transparent text-sm font-medium focus:outline-none"
            placeholder="Document name"
          />
          <button onClick={newDocument} className="inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs hover:bg-accent transition-colors" title="New document">
            <FilePlus className="h-3.5 w-3.5" />New
          </button>
          <label className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs hover:bg-accent transition-colors cursor-pointer ${importing ? "opacity-50" : ""}`} title="Import .docx file">
            <Upload className="h-3.5 w-3.5" />{importing ? "Importing..." : "Import .docx"}
            <input type="file" accept=".docx,.doc" onChange={handleImport} className="hidden" disabled={importing} />
          </label>
          <button onClick={handleExport} className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors" title="Save as .docx">
            <Download className="h-3.5 w-3.5" />Save .docx
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-0.5 p-1.5 rounded-lg border bg-muted/30">
          {/* Undo/Redo */}
          <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo">
            <Undo2 className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo">
            <Redo2 className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarDivider />

          {/* Headings */}
          <ToolbarButton onClick={() => editor.chain().focus().setParagraph().run()} active={editor.isActive("paragraph") && !editor.isActive("heading")} title="Normal text">
            <Type className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive("heading", { level: 1 })} title="Heading 1">
            <Heading1 className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} title="Heading 2">
            <Heading2 className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} title="Heading 3">
            <Heading3 className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarDivider />

          {/* Text formatting */}
          <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Bold">
            <Bold className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Italic">
            <Italic className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title="Underline">
            <UnderlineIcon className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} title="Strikethrough">
            <Strikethrough className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleHighlight().run()} active={editor.isActive("highlight")} title="Highlight">
            <Highlighter className="h-4 w-4" />
          </ToolbarButton>

          {/* Text color */}
          <div className="relative">
            <input
              type="color"
              onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              title="Text color"
            />
            <div className="p-1.5 rounded hover:bg-accent transition-colors">
              <Palette className="h-4 w-4" />
            </div>
          </div>

          <ToolbarDivider />

          {/* Alignment */}
          <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })} title="Align left">
            <AlignLeft className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })} title="Align center">
            <AlignCenter className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("right").run()} active={editor.isActive({ textAlign: "right" })} title="Align right">
            <AlignRight className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("justify").run()} active={editor.isActive({ textAlign: "justify" })} title="Justify">
            <AlignJustify className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarDivider />

          {/* Lists */}
          <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Bullet list">
            <List className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Numbered list">
            <ListOrdered className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarDivider />

          {/* Block elements */}
          <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Block quote">
            <Quote className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal rule">
            <Minus className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarDivider />

          {/* Insert */}
          <ToolbarButton onClick={addLink} active={editor.isActive("link")} title="Insert link">
            <LinkIcon className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={addImage} title="Insert image">
            <ImagePlus className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={insertTable} title="Insert table">
            <TableIcon className="h-4 w-4" />
          </ToolbarButton>
        </div>

        {/* Editor area - styled like a white document page (always white like Google Docs) */}
        <div className="rounded-lg border shadow-sm overflow-hidden" style={{ backgroundColor: "#ffffff" }}>
          <EditorContent editor={editor} />
        </div>

        {/* Word count footer */}
        <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
          <span>
            {editor.storage.characterCount?.words?.() ?? countWords(editor.getText())} words
            {" | "}
            {editor.getText().length} characters
          </span>
          <span>All editing happens locally in your browser</span>
        </div>
      </div>

      {/* Editor styles */}
      <style>{`
        .ProseMirror {
          min-height: 600px;
          outline: none;
          color: #1a1a1a !important;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #999;
          pointer-events: none;
          height: 0;
        }
        .ProseMirror table {
          border-collapse: collapse;
          margin: 1rem 0;
          overflow: hidden;
          width: 100%;
        }
        .ProseMirror table td,
        .ProseMirror table th {
          border: 1px solid #ddd;
          padding: 6px 10px;
          vertical-align: top;
          min-width: 80px;
        }
        .ProseMirror table th {
          background: #f4f4f5;
          font-weight: 600;
        }
        .ProseMirror img {
          max-width: 100%;
          height: auto;
          border-radius: 4px;
        }
        .ProseMirror blockquote {
          border-left: 3px solid #6d28d9;
          padding-left: 1rem;
          color: #666;
        }
        .ProseMirror mark {
          background-color: #fef08a;
          padding: 0 2px;
          border-radius: 2px;
        }
        .ProseMirror a {
          color: #6d28d9;
          text-decoration: underline;
          cursor: pointer;
        }
      `}</style>
    </ToolCard>
  )
}

function countWords(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0
}

// Convert HTML DOM nodes to docx paragraphs
function convertNodesToParagraphs(parent: Node): (Paragraph | DocxTable)[] {
  const result: (Paragraph | DocxTable)[] = []

  for (let i = 0; i < parent.childNodes.length; i++) {
    const node = parent.childNodes[i]

    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim()
      if (text) {
        result.push(new Paragraph({ children: [new TextRun(text)] }))
      }
      continue
    }

    if (node.nodeType !== Node.ELEMENT_NODE) continue
    const el = node as HTMLElement
    const tag = el.tagName.toLowerCase()

    // Headings
    if (tag === "h1" || tag === "h2" || tag === "h3") {
      const level = tag === "h1" ? HeadingLevel.HEADING_1 : tag === "h2" ? HeadingLevel.HEADING_2 : HeadingLevel.HEADING_3
      const align = getAlignment(el)
      result.push(new Paragraph({
        heading: level,
        alignment: align,
        children: extractTextRuns(el),
      }))
    }
    // Paragraphs
    else if (tag === "p") {
      const align = getAlignment(el)
      result.push(new Paragraph({
        alignment: align,
        children: extractTextRuns(el),
      }))
    }
    // Lists
    else if (tag === "ul" || tag === "ol") {
      const items = el.querySelectorAll("li")
      items.forEach((li, idx) => {
        result.push(new Paragraph({
          children: [new TextRun(`${tag === "ol" ? `${idx + 1}. ` : "• "}${li.textContent || ""}`)],
        }))
      })
    }
    // Blockquote
    else if (tag === "blockquote") {
      const inner = convertNodesToParagraphs(el)
      for (const p of inner) {
        if (p instanceof Paragraph) {
          result.push(new Paragraph({
            indent: { left: 720 },
            children: extractTextRuns(el),
          }))
          break
        }
      }
    }
    // Tables
    else if (tag === "table") {
      const rows: DocxTableRow[] = []
      el.querySelectorAll("tr").forEach((tr) => {
        const cells: DocxTableCell[] = []
        tr.querySelectorAll("td, th").forEach((td) => {
          cells.push(new DocxTableCell({
            children: [new Paragraph({ children: [new TextRun(td.textContent || "")] })],
            width: { size: 2000, type: WidthType.DXA },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1 },
              bottom: { style: BorderStyle.SINGLE, size: 1 },
              left: { style: BorderStyle.SINGLE, size: 1 },
              right: { style: BorderStyle.SINGLE, size: 1 },
            },
          }))
        })
        if (cells.length > 0) {
          rows.push(new DocxTableRow({ children: cells }))
        }
      })
      if (rows.length > 0) {
        result.push(new DocxTable({ rows, width: { size: 9000, type: WidthType.DXA } }))
      }
    }
    // Horizontal rule
    else if (tag === "hr") {
      result.push(new Paragraph({
        children: [new TextRun({ text: "─".repeat(50), color: "999999" })],
      }))
    }
    // Fallback: recurse
    else {
      result.push(...convertNodesToParagraphs(el))
    }
  }

  if (result.length === 0) {
    result.push(new Paragraph({ children: [] }))
  }

  return result
}

function extractTextRuns(el: HTMLElement): TextRun[] {
  const runs: TextRun[] = []

  function walk(node: Node, styles: { bold?: boolean; italic?: boolean; underline?: boolean; strike?: boolean; color?: string }) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || ""
      if (text) {
        runs.push(new TextRun({
          text,
          bold: styles.bold,
          italics: styles.italic,
          underline: styles.underline ? {} : undefined,
          strike: styles.strike,
          color: styles.color?.replace("#", ""),
        }))
      }
      return
    }

    if (node.nodeType !== Node.ELEMENT_NODE) return
    const child = node as HTMLElement
    const tag = child.tagName.toLowerCase()

    const newStyles = { ...styles }
    if (tag === "strong" || tag === "b") newStyles.bold = true
    if (tag === "em" || tag === "i") newStyles.italic = true
    if (tag === "u") newStyles.underline = true
    if (tag === "s" || tag === "del") newStyles.strike = true
    if (child.style.color) newStyles.color = child.style.color

    for (let i = 0; i < child.childNodes.length; i++) {
      walk(child.childNodes[i], newStyles)
    }
  }

  for (let i = 0; i < el.childNodes.length; i++) {
    walk(el.childNodes[i], {})
  }

  return runs.length > 0 ? runs : [new TextRun("")]
}

function getAlignment(el: HTMLElement): typeof AlignmentType[keyof typeof AlignmentType] | undefined {
  const align = el.style.textAlign || el.getAttribute("align")
  if (align === "center") return AlignmentType.CENTER
  if (align === "right") return AlignmentType.RIGHT
  if (align === "justify") return AlignmentType.JUSTIFIED
  return undefined
}
