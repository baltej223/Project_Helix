# Project Helix Context

## Overview
Project Helix is a contract intelligence platform that ingests legal documents, classifies them, redacts PII before any LLM processing, analyzes clauses for risk and deviation, and provides market comparisons plus access to human legal experts. The intended user flow is: upload -> classification -> AI analysis -> comparison view -> optional human layer -> reupload for delta analysis.

This repository contains three parts:
- client: React UI for intake, analysis, benchmarks, and marketplace flows.
- server: Node/Express API (legacy/outdated; should be rewritten based on the targets in this doc).
- ocr: Node/Express microservice for PDF/DOCX text extraction (implemented and usable now).

## Architecture
### Current (as implemented)
- client (React + Vite): provides UI scaffolding for Upload, Analysis, Benchmarks, Marketplace.
- ocr (Express): receives multipart upload and extracts text with metadata.
- server (Express + MongoDB): accepts document URLs, parses text, runs LLM analysis, and stores results.

### Target (rewrite-ready)
- Client should orchestrate upload + progress tracking and render analysis results inline with the PDF.
- API server should be re-implemented with:
  - robust clause segmentation and PII scrubbing before LLM calls,
  - async job queue for analysis pipeline,
  - clear, versioned API contracts,
  - explicit status lifecycle and audit-friendly logs.
- OCR remains a dedicated microservice with stable API.

## Data Flow (intended)
1. Upload
   - User uploads PDF/DOCX (or scanned PDF) from client.
   - File is sent to OCR or uploaded to storage; server receives file reference.
2. OCR + Text Extraction
   - OCR service extracts text and metadata (word count, page count, duration).
3. PII Scrub (required before LLM)
   - Run scrubber (e.g., Presidio) on extracted text.
   - Log what was removed for user transparency.
4. Document Classification
   - Identify contract domain, governing jurisdiction, and user party.
   - User confirms classification.
5. Clause Analysis
   - Segment clauses; score each on clarity, deviation, obligation asymmetry, financial exposure.
   - Rewrite complex clauses into plain language.
   - Flag red-risk clauses.
6. Market Comparison
   - Compare to public corpus; show spectrum of aggressive/balanced/user-protective.
7. Human Layer (optional)
   - Book domain-specific advocate or async review.
8. Post-Negotiation Delta
   - Reupload revised contract; show changes and improvement.

## Tech Choices
- Client: React 19, Vite, React Router, Tailwind CSS, framer-motion, lucide-react.
- Server (legacy): Node.js, Express, Mongoose, Gemini SDK, Pinecone SDK, pdfjs-dist, mammoth.
- OCR: Node.js, Express, pdf-parse, mammoth, multer.
- Storage (planned): MongoDB for metadata/results, Redis for queue, object storage for files.
- LLM: Gemini (gemini-1.5-flash), embeddings via text-embedding-004.

## APIs
### OCR Service (current)
Base URL: http://localhost:5000

POST /extract
- Purpose: Extract text from PDF/DOCX.
- Content-Type: multipart/form-data
- Field: file
- Constraints:
  - Supported MIME types: application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document
  - Max file size: config.maxFileSizeBytes
  - Timeout: config.requestTimeoutMs

Response (200)
{
  "status": "success",
  "data": {
    "extractedText": "string",
    "metadata": {
      "filename": "string",
      "mimeType": "string",
      "fileSizeBytes": number,
      "durationMs": number,
      "wordCount": number,
      "pageCount": number | null
    }
  }
}

Errors
- 400: missing file, unsupported type, empty file
- 408: extraction timeout
- 422: failed to extract or no text

### Server API (legacy; rewrite target)
Base URL: http://localhost:3000

GET /health
- Basic health check.

POST /documents
- Purpose: Register a file URL for analysis.
- Auth: required (Clerk in legacy).
- Body:
  {
    "fileUrl": "https://...",
    "fileName": "contract.pdf"
  }
- Validation: only .pdf, .docx fileName.
- Behavior (legacy): create Document with status=processing, then background parse and analyze.

Response (201)
{
  "success": true,
  "message": "Document received and parsing started",
  "data": { Document }
}

GET /documents
- Purpose: list documents for current user.
- Auth: required.
- Response: list of Document records sorted by createdAt desc.

GET /me
- Purpose: auth validation.

Rewrite guidance
- Replace fileUrl upload pattern with direct file upload or signed upload flow.
- Add explicit pipeline endpoints:
  - POST /documents/upload (returns upload URL or direct upload)
  - POST /documents/:id/parse
  - POST /documents/:id/analyze
  - GET /documents/:id/status
  - GET /documents/:id/clauses
  - GET /documents/:id/comparison
- Make all long-running steps async via queue.
- Return consistent error envelope across services.

## Database Schemas (MongoDB, legacy)
### Document
- userId: string (indexed)
- fileUrl: string
- fileName: string
- status: enum: uploaded | processing | done | failed
- documentType: string (optional)
- summary: string (optional)
- risks: string[] (optional)
- createdAt: Date

### Clause
- documentId: ObjectId (ref Document, indexed)
- text: string
- type: string
- riskScore: number (1-10)
- explanation: string
- impact: string
- suggestion: string
- similarityScore: number (optional)
- standardClauseText: string (optional)
- deviationFlag: boolean (optional)
- createdAt: Date

### ParsedContent
- documentId: ObjectId (unique)
- rawText: string
- createdAt: Date

### User
- clerkId: string (unique)
- email: string
- createdAt: Date

Rewrite guidance
- Add audit fields: updatedAt, statusHistory.
- Add PII scrub metadata: redactionCount, redactionTypes.
- Separate rawText storage into ephemeral storage with TTL policy.

## Implementation Details (legacy)
- DocumentParsingService
  - Fetches fileUrl via axios.
  - Parses PDF via pdfjs-dist or DOCX via mammoth.
  - Stores raw text in ParsedContent.
  - Calls AnalysisService.

- AnalysisService
  - Truncates raw text to 100k chars.
  - Calls Gemini with JSON response enforcement.
  - Stores documentType, summary, risks in Document.
  - Calls ClauseAnalysisService, then sets status=done.

- ClauseAnalysisService
  - Splits clauses by double newlines.
  - Batches analysis (5 clauses per batch).
  - Stores Clause records.
  - Triggers VectorComparisonService per clause.

- VectorComparisonService
  - Generates embeddings via Gemini embedding model.
  - Queries Pinecone topK=1.
  - Sets similarityScore, standardClauseText, deviationFlag.

## Frontend Surfaces (current)
- Upload: intake UI with classification selectors, privacy toggle, and upload CTA.
- Analysis: PDF viewer + AI analysis panel with flagged clauses and actions.
- Benchmarks: market comparison dashboard and negotiation readiness.
- Marketplace: legal expert discovery and booking UI.

## Risks / Gaps
- Clause segmentation is naive (double newline split).
- No PII removal pipeline implemented.
- No queueing or async job orchestration (analysis can block server).
- Server endpoints assume fileUrl upload, not direct file upload.
- No versioning or reupload comparison logic.
- Benchmarks and marketplace are UI-only placeholders.

## Rewrite Targets (server)
- Implement PII scrubber before any LLM processing.
- Build robust clause segmentation (regex + ML + fallback heuristics).
- Add Redis-backed queue for analysis jobs.
- Formalize analysis pipeline stages and status transitions.
- Introduce consistent API schema and error format.
- Separate storage of raw document text from long-term user data.
- Add contract comparison pipeline and outputs for the Benchmarks view.
- Add support for post-negotiation delta analysis.

## Environment Variables (legacy)
Server:
- NODE_ENV, PORT, CORS_ORIGIN
- CLERK_SECRET_KEY
- MONGODB_URI
- GEMINI_API_KEY
- PINECONE_API_KEY
- PINECONE_INDEX

OCR:
- NODE_ENV, PORT, CORS_ORIGIN
- REQUEST_TIMEOUT_MS
- MAX_FILE_SIZE_BYTES
