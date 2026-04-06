import { lazy, Suspense } from "react"
import { BrowserRouter, Routes, Route } from "react-router"
import { MainLayout } from "@/components/layout/MainLayout"

// Pages
const Home = lazy(() => import("@/pages/Home"))
const ComingSoon = lazy(() => import("@/pages/ComingSoon"))

// Data Format
const JsonFormatter = lazy(() => import("@/pages/data-format/JsonFormatter"))
const XmlFormatter = lazy(() => import("@/pages/data-format/XmlFormatter"))
const YamlFormatter = lazy(() => import("@/pages/data-format/YamlFormatter"))
const CsvToJson = lazy(() => import("@/pages/data-format/CsvToJson"))
const Base64EncodeDecode = lazy(() => import("@/pages/data-format/Base64EncodeDecode"))
const HtmlFormatter = lazy(() => import("@/pages/data-format/HtmlFormatter"))

// Security & Auth
const JwtDecoder = lazy(() => import("@/pages/security-auth/JwtDecoder"))
const HashGenerator = lazy(() => import("@/pages/security-auth/HashGenerator"))
const PasswordGenerator = lazy(() => import("@/pages/security-auth/PasswordGenerator"))
const UuidGenerator = lazy(() => import("@/pages/security-auth/UuidGenerator"))
const RsaKeyGenerator = lazy(() => import("@/pages/security-auth/RsaKeyGenerator"))

// Text & String
const RegexTester = lazy(() => import("@/pages/text-string/RegexTester"))
const TextDiff = lazy(() => import("@/pages/text-string/TextDiff"))
const LoremIpsum = lazy(() => import("@/pages/text-string/LoremIpsum"))
const CaseConverter = lazy(() => import("@/pages/text-string/CaseConverter"))
const UrlEncodeDecode = lazy(() => import("@/pages/text-string/UrlEncodeDecode"))
const MarkdownPreview = lazy(() => import("@/pages/text-string/MarkdownPreview"))
const WordCounter = lazy(() => import("@/pages/text-string/WordCounter"))

// Network & API
const UrlParser = lazy(() => import("@/pages/network-api/UrlParser"))
const HttpStatusCodes = lazy(() => import("@/pages/network-api/HttpStatusCodes"))
const CorsHelper = lazy(() => import("@/pages/network-api/CorsHelper"))
const CronParser = lazy(() => import("@/pages/network-api/CronParser"))

// Dev Utilities
const ColorConverter = lazy(() => import("@/pages/dev-utilities/ColorConverter"))
const EpochConverter = lazy(() => import("@/pages/dev-utilities/EpochConverter"))
const NumberBaseConverter = lazy(() => import("@/pages/dev-utilities/NumberBaseConverter"))
const ImageToBase64 = lazy(() => import("@/pages/dev-utilities/ImageToBase64"))

// PDF & Documents
const PdfMerger = lazy(() => import("@/pages/pdf-document/PdfMerger"))
const PdfSplitter = lazy(() => import("@/pages/pdf-document/PdfSplitter"))
const PdfEditor = lazy(() => import("@/pages/pdf-document/PdfEditor"))
const PdfCompress = lazy(() => import("@/pages/pdf-document/PdfCompress"))
const ImageToPdf = lazy(() => import("@/pages/pdf-document/ImageToPdf"))
const PdfToWord = lazy(() => import("@/pages/pdf-document/PdfToWord"))
const WordToPdf = lazy(() => import("@/pages/pdf-document/WordToPdf"))
const WordEditor = lazy(() => import("@/pages/pdf-document/WordEditor"))

function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route index element={<Home />} />

            {/* Data Format */}
            <Route path="data-format/json-formatter" element={<JsonFormatter />} />
            <Route path="data-format/xml-formatter" element={<XmlFormatter />} />
            <Route path="data-format/yaml-formatter" element={<YamlFormatter />} />
            <Route path="data-format/csv-to-json" element={<CsvToJson />} />
            <Route path="data-format/base64" element={<Base64EncodeDecode />} />
            <Route path="data-format/html-formatter" element={<HtmlFormatter />} />

            {/* Security & Auth */}
            <Route path="security-auth/jwt-decoder" element={<JwtDecoder />} />
            <Route path="security-auth/hash-generator" element={<HashGenerator />} />
            <Route path="security-auth/password-generator" element={<PasswordGenerator />} />
            <Route path="security-auth/uuid-generator" element={<UuidGenerator />} />
            <Route path="security-auth/rsa-key-generator" element={<RsaKeyGenerator />} />

            {/* Text & String */}
            <Route path="text-string/regex-tester" element={<RegexTester />} />
            <Route path="text-string/text-diff" element={<TextDiff />} />
            <Route path="text-string/lorem-ipsum" element={<LoremIpsum />} />
            <Route path="text-string/case-converter" element={<CaseConverter />} />
            <Route path="text-string/url-encode-decode" element={<UrlEncodeDecode />} />
            <Route path="text-string/markdown-preview" element={<MarkdownPreview />} />
            <Route path="text-string/word-counter" element={<WordCounter />} />

            {/* Network & API */}
            <Route path="network-api/url-parser" element={<UrlParser />} />
            <Route path="network-api/http-status-codes" element={<HttpStatusCodes />} />
            <Route path="network-api/cors-helper" element={<CorsHelper />} />
            <Route path="network-api/cron-parser" element={<CronParser />} />

            {/* Dev Utilities */}
            <Route path="dev-utilities/color-converter" element={<ColorConverter />} />
            <Route path="dev-utilities/epoch-converter" element={<EpochConverter />} />
            <Route path="dev-utilities/number-base-converter" element={<NumberBaseConverter />} />
            <Route path="dev-utilities/image-to-base64" element={<ImageToBase64 />} />

            {/* PDF & Documents */}
            <Route path="pdf-document/pdf-merger" element={<PdfMerger />} />
            <Route path="pdf-document/pdf-splitter" element={<PdfSplitter />} />
            <Route path="pdf-document/pdf-editor" element={<PdfEditor />} />
            <Route path="pdf-document/pdf-compress" element={<PdfCompress />} />
            <Route path="pdf-document/image-to-pdf" element={<ImageToPdf />} />
            <Route path="pdf-document/pdf-to-word" element={<PdfToWord />} />
            <Route path="pdf-document/word-to-pdf" element={<WordToPdf />} />
            <Route path="pdf-document/word-editor" element={<WordEditor />} />

            {/* Catch all */}
            <Route path="*" element={<ComingSoon />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
