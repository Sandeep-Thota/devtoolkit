import {
  Database,
  Shield,
  Type,
  Globe,
  Wrench,
  FileText,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

export interface Category {
  id: string
  name: string
  icon: LucideIcon
  color: string
  description: string
}

export const categories: Category[] = [
  {
    id: "data-format",
    name: "Data Format",
    icon: Database,
    color: "text-blue-500",
    description: "JSON, XML, YAML, CSV, Base64, HTML formatting & conversion",
  },
  {
    id: "security-auth",
    name: "Security & Auth",
    icon: Shield,
    color: "text-green-500",
    description: "JWT, hashing, passwords, UUIDs, RSA keys",
  },
  {
    id: "text-string",
    name: "Text & String",
    icon: Type,
    color: "text-orange-500",
    description: "Regex, diff, case conversion, Markdown, encoding",
  },
  {
    id: "network-api",
    name: "Network & API",
    icon: Globe,
    color: "text-purple-500",
    description: "URL parsing, HTTP codes, CORS, cron expressions",
  },
  {
    id: "dev-utilities",
    name: "Dev Utilities",
    icon: Wrench,
    color: "text-yellow-500",
    description: "Colors, timestamps, number bases, image encoding",
  },
  {
    id: "pdf-document",
    name: "PDF & Documents",
    icon: FileText,
    color: "text-red-500",
    description: "PDF edit, merge, split, compress, convert to/from Word",
  },
]

export const categoryMap = Object.fromEntries(
  categories.map((c) => [c.id, c])
)
