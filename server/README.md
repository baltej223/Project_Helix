# Project Helix Server API

This service is the main API layer for Project Helix.
Current stage: OCR-first ingestion pipeline.

The server receives document uploads and forwards them to the OCR microservice, then returns extracted raw text and OCR metadata.

## Base URL

- Local: `http://localhost:3000`

## Route Summary

- `GET /health` - Service health check
- `POST /documents` - Upload PDF/DOCX and return OCR extraction result

## Authentication (Current)

Routes under `/documents` use temporary mock auth middleware.

- Header: `x-user-id` (optional)
- If omitted, user defaults to `anonymous-user`

This is only a placeholder until real auth is integrated.

## API Routes

### 1) Health Check

**GET** `/health`

Purpose:
- Verify server is running

Success Response (`200`):

```json
{
  "status": "ok",
  "service": "project-helix-server",
  "timestamp": "2026-04-19T00:00:00.000Z"
}
```

Example:

```bash
curl -X GET http://localhost:3000/health
```

---

### 2) Upload Document for OCR Extraction

**POST** `/documents`

Purpose:
- Accept a file upload
- Forward file to OCR microservice
- Return extracted raw text + OCR metadata

Content Type:
- `multipart/form-data`

Form Fields:
- `file` (required): PDF or DOCX
- Optional metadata fields:
  - `title` (string, max 200)
  - `documentTypeHint` (string, max 100)
  - `source` (`web` | `email` | `manual` | `api`)
  - `clientUploadId` (string, max 100)
  - `notes` (string, max 2000)

Validation Rules:
- Allowed MIME types:
  - `application/pdf`
  - `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
- Maximum file size controlled by `UPLOAD_MAX_FILE_SIZE_BYTES`
- Metadata is validated using Zod and rejects unknown keys

Success Response (`200`):

```json
{
  "status": "success",
  "data": {
    "extractedText": "...",
    "metadata": {
      "filename": "contract.pdf",
      "mimeType": "application/pdf",
      "fileSizeBytes": 123456,
      "durationMs": 842,
      "wordCount": 3512,
      "pageCount": 12
    }
  }
}
```

Client Validation Error (`400`) Example:

```json
{
  "status": "error",
  "statusCode": 400,
  "message": "Invalid upload metadata",
  "errors": [
    {
      "code": "unrecognized_keys",
      "path": [],
      "message": "Unrecognized key(s) in object"
    }
  ]
}
```

Possible Error Status Codes:
- `400`: missing file, invalid file type, empty file, invalid metadata
- `408`: OCR extraction timeout (propagated from OCR service)
- `422`: OCR could not extract usable text
- `502`: OCR service unavailable or returned invalid response
- `500`: unexpected server error

Example (PDF upload):

```bash
curl -X POST http://localhost:3000/documents \
  -H "x-user-id: user_123" \
  -F "file=@/absolute/path/to/contract.pdf" \
  -F "source=web" \
  -F "title=Employment Contract"
```

Example (DOCX upload):

```bash
curl -X POST http://localhost:3000/documents \
  -H "x-user-id: user_123" \
  -F "file=@/absolute/path/to/contract.docx" \
  -F "source=manual"
```

## Environment Variables

Copy `.env.example` and set values as needed.

- `NODE_ENV` - `development` or `production`
- `PORT` - API port (default `3000`)
- `CORS_ORIGIN` - allowed origin(s)
- `UPLOAD_MAX_FILE_SIZE_BYTES` - upload limit in bytes (default `10485760`)
- `OCR_BASE_URL` - OCR service base URL (default `http://localhost:5000`)
- `OCR_REQUEST_TIMEOUT_MS` - OCR request timeout (default `30000`)

## Run Locally

```bash
cd server
npm install
npm run dev
```

Build:

```bash
npm run build
npm start
```

## Internal Contract Layers

The API is organized to keep contracts separate from handlers:

- Route handlers: `src/routes/*`
- Validation schemas: `src/schemas/documentSchemas.ts`
- OCR integration client: `src/clients/ocrClient.ts`
- Ingestion orchestration: `src/services/documentIngestionService.ts`

## Current Boundary

Only OCR extraction is implemented at this stage.

Post-OCR processing remains intentionally deferred:

```ts
// To be implemented later
```

This placeholder exists in the ingestion service for future parsing/indexing/analysis pipeline stages.
