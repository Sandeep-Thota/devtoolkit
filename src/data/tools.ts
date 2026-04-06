import {
  Braces, Code, FileJson, FileSpreadsheet, Binary, FileCode,
  KeyRound, Hash, Lock, Fingerprint, Key,
  Regex, GitCompare, TextCursorInput, CaseSensitive, Link, Eye, LetterText,
  Globe, Server, Shield, Clock,
  Palette, Timer, Calculator, Image,
  FileText, FilePlus, Scissors, FileDown, ImagePlus, FileOutput, FileInput, FileEdit,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

export interface Tool {
  id: string
  name: string
  description: string
  categoryId: string
  path: string
  icon: LucideIcon
  keywords: string[]
}

export const tools: Tool[] = [
  // Data Format
  { id: "json-formatter", name: "JSON Formatter", description: "Format, validate, and minify JSON data", categoryId: "data-format", path: "/data-format/json-formatter", icon: Braces, keywords: ["json", "format", "validate", "pretty", "minify"] },
  { id: "xml-formatter", name: "XML Formatter", description: "Format and minify XML documents", categoryId: "data-format", path: "/data-format/xml-formatter", icon: Code, keywords: ["xml", "format", "minify"] },
  { id: "yaml-formatter", name: "YAML Formatter", description: "Format YAML and convert to/from JSON", categoryId: "data-format", path: "/data-format/yaml-formatter", icon: FileJson, keywords: ["yaml", "yml", "format", "json"] },
  { id: "csv-to-json", name: "CSV to JSON", description: "Convert CSV data to JSON format", categoryId: "data-format", path: "/data-format/csv-to-json", icon: FileSpreadsheet, keywords: ["csv", "json", "convert", "table"] },
  { id: "base64", name: "Base64 Encode/Decode", description: "Encode and decode Base64 strings and files", categoryId: "data-format", path: "/data-format/base64", icon: Binary, keywords: ["base64", "encode", "decode", "binary"] },
  { id: "html-formatter", name: "HTML Formatter", description: "Format and minify HTML code", categoryId: "data-format", path: "/data-format/html-formatter", icon: FileCode, keywords: ["html", "format", "minify", "beautify"] },

  // Security & Auth
  { id: "jwt-decoder", name: "JWT Decoder", description: "Decode and inspect JSON Web Tokens", categoryId: "security-auth", path: "/security-auth/jwt-decoder", icon: KeyRound, keywords: ["jwt", "token", "decode", "auth"] },
  { id: "hash-generator", name: "Hash Generator", description: "Generate MD5, SHA-1, SHA-256, SHA-512 hashes", categoryId: "security-auth", path: "/security-auth/hash-generator", icon: Hash, keywords: ["hash", "md5", "sha", "checksum"] },
  { id: "password-generator", name: "Password Generator", description: "Generate secure random passwords", categoryId: "security-auth", path: "/security-auth/password-generator", icon: Lock, keywords: ["password", "generate", "random", "secure"] },
  { id: "uuid-generator", name: "UUID Generator", description: "Generate UUID v4 and v7 identifiers", categoryId: "security-auth", path: "/security-auth/uuid-generator", icon: Fingerprint, keywords: ["uuid", "guid", "unique", "id"] },
  { id: "rsa-key-generator", name: "RSA Key Generator", description: "Generate RSA public/private key pairs", categoryId: "security-auth", path: "/security-auth/rsa-key-generator", icon: Key, keywords: ["rsa", "key", "public", "private", "pem"] },

  // Text & String
  { id: "regex-tester", name: "Regex Tester", description: "Test regular expressions with live matching", categoryId: "text-string", path: "/text-string/regex-tester", icon: Regex, keywords: ["regex", "regular", "expression", "match", "test"] },
  { id: "text-diff", name: "Text Diff", description: "Compare two texts and highlight differences", categoryId: "text-string", path: "/text-string/text-diff", icon: GitCompare, keywords: ["diff", "compare", "difference", "merge"] },
  { id: "lorem-ipsum", name: "Lorem Ipsum", description: "Generate placeholder text", categoryId: "text-string", path: "/text-string/lorem-ipsum", icon: TextCursorInput, keywords: ["lorem", "ipsum", "placeholder", "dummy", "text"] },
  { id: "case-converter", name: "Case Converter", description: "Convert text between cases", categoryId: "text-string", path: "/text-string/case-converter", icon: CaseSensitive, keywords: ["case", "camel", "snake", "kebab", "pascal", "upper", "lower"] },
  { id: "url-encode-decode", name: "URL Encode/Decode", description: "Encode and decode URL components", categoryId: "text-string", path: "/text-string/url-encode-decode", icon: Link, keywords: ["url", "encode", "decode", "percent", "uri"] },
  { id: "markdown-preview", name: "Markdown Preview", description: "Write and preview Markdown with GFM support", categoryId: "text-string", path: "/text-string/markdown-preview", icon: Eye, keywords: ["markdown", "preview", "md", "gfm"] },
  { id: "word-counter", name: "Word Counter", description: "Count words, characters, sentences, and reading time", categoryId: "text-string", path: "/text-string/word-counter", icon: LetterText, keywords: ["word", "count", "character", "reading", "time"] },

  // Network & API
  { id: "url-parser", name: "URL Parser", description: "Parse and inspect URL components", categoryId: "network-api", path: "/network-api/url-parser", icon: Globe, keywords: ["url", "parse", "query", "params", "host"] },
  { id: "http-status-codes", name: "HTTP Status Codes", description: "Reference for all HTTP status codes", categoryId: "network-api", path: "/network-api/http-status-codes", icon: Server, keywords: ["http", "status", "code", "200", "404", "500"] },
  { id: "cors-helper", name: "CORS Helper", description: "Generate CORS headers for your server", categoryId: "network-api", path: "/network-api/cors-helper", icon: Shield, keywords: ["cors", "header", "origin", "access", "control"] },
  { id: "cron-parser", name: "Cron Parser", description: "Parse cron expressions and see next run times", categoryId: "network-api", path: "/network-api/cron-parser", icon: Clock, keywords: ["cron", "schedule", "job", "timer"] },

  // Dev Utilities
  { id: "color-converter", name: "Color Converter", description: "Convert between HEX, RGB, and HSL colors", categoryId: "dev-utilities", path: "/dev-utilities/color-converter", icon: Palette, keywords: ["color", "hex", "rgb", "hsl", "convert"] },
  { id: "epoch-converter", name: "Epoch Converter", description: "Convert between epoch timestamps and dates", categoryId: "dev-utilities", path: "/dev-utilities/epoch-converter", icon: Timer, keywords: ["epoch", "timestamp", "unix", "date", "time"] },
  { id: "number-base-converter", name: "Number Base Converter", description: "Convert numbers between bases (binary, octal, hex)", categoryId: "dev-utilities", path: "/dev-utilities/number-base-converter", icon: Calculator, keywords: ["binary", "octal", "hex", "decimal", "base", "convert"] },
  { id: "image-to-base64", name: "Image to Base64", description: "Convert images to Base64 data URIs", categoryId: "dev-utilities", path: "/dev-utilities/image-to-base64", icon: Image, keywords: ["image", "base64", "data", "uri", "convert"] },

  // PDF & Documents
  { id: "pdf-merger", name: "PDF Merger", description: "Combine multiple PDF files into one", categoryId: "pdf-document", path: "/pdf-document/pdf-merger", icon: FilePlus, keywords: ["pdf", "merge", "combine", "join"] },
  { id: "pdf-splitter", name: "PDF Splitter", description: "Split PDF into individual pages or ranges", categoryId: "pdf-document", path: "/pdf-document/pdf-splitter", icon: Scissors, keywords: ["pdf", "split", "extract", "pages"] },
  { id: "pdf-editor", name: "PDF Editor", description: "Add text, fill forms, and annotate PDFs", categoryId: "pdf-document", path: "/pdf-document/pdf-editor", icon: FileText, keywords: ["pdf", "edit", "fill", "form", "annotate", "text"] },
  { id: "pdf-compress", name: "PDF Compress", description: "Reduce PDF file size", categoryId: "pdf-document", path: "/pdf-document/pdf-compress", icon: FileDown, keywords: ["pdf", "compress", "reduce", "size", "optimize"] },
  { id: "image-to-pdf", name: "Image to PDF", description: "Convert images to a PDF document", categoryId: "pdf-document", path: "/pdf-document/image-to-pdf", icon: ImagePlus, keywords: ["image", "pdf", "convert", "photo"] },
  { id: "pdf-to-word", name: "PDF to Word", description: "Convert PDF documents to Word format", categoryId: "pdf-document", path: "/pdf-document/pdf-to-word", icon: FileOutput, keywords: ["pdf", "word", "docx", "convert"] },
  { id: "word-to-pdf", name: "Word to PDF", description: "Convert Word documents to PDF format", categoryId: "pdf-document", path: "/pdf-document/word-to-pdf", icon: FileInput, keywords: ["word", "pdf", "docx", "convert"] },
  { id: "word-editor", name: "Word Editor", description: "Create, edit, and save Word documents online — no subscription needed", categoryId: "pdf-document", path: "/pdf-document/word-editor", icon: FileEdit, keywords: ["word", "editor", "docx", "write", "document", "free"] },
]

export const toolsByCategory = (categoryId: string) =>
  tools.filter((t) => t.categoryId === categoryId)
