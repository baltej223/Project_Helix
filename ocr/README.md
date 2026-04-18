# OCR Microservice (Internal API)

This service extracts text from uploaded documents and returns structured output.

Current scope:
- Synchronous extraction
- Digital-text PDF support
- DOCX support
- Internal API (no authentication by design)

## Service Summary

- Runtime: Node.js 18+
- Language: TypeScript
- Framework: Express
- Upload handling: multer (memory storage)
- PDF extraction: pdf-parse
- DOCX extraction: mammoth

## Endpoints

### Health Check

- Method: GET
- Path: `/health`

Response example:

```json
{
  "status": "ok",
  "service": "ocr",
  "timestamp": "2026-04-19T00:00:00.000Z",
  "uptime": 123.45
}
```

### Extract Text

- Method: POST
- Path: `/ocr/extract`
- Content-Type: `multipart/form-data`
- Form field: `file`

Supported MIME types:
- `application/pdf`
- `application/vnd.openxmlformats-officedocument.wordprocessingml.document`

Success response example:

```json
{
  "status": "success",
  "data": {
    "extractedText": "...document text...",
    "metadata": {
      "filename": "example.pdf",
      "mimeType": "application/pdf",
      "fileSizeBytes": 34856,
      "durationMs": 122,
      "wordCount": 640,
      "pageCount": 3
    }
  }
}
```

Error response shape:

```json
{
  "status": "error",
  "statusCode": 400,
  "message": "Unsupported file type. Only PDF and DOCX are allowed"
}
```

## Validation and Limits

Default validation rules:
- Missing file is rejected
- Empty file is rejected
- Unsupported MIME type is rejected
- Files above max size are rejected
- Requests timing out are rejected
- Documents with no extractable text return a 422-style extraction error

Environment-driven limits:
- Max upload size: `OCR_MAX_FILE_SIZE` (default `10485760`, 10 MB)
- Request timeout: `OCR_REQUEST_TIMEOUT_MS` (default `30000`, 30 s)

## Environment Variables

Use [ocr/.env.example](.env.example) as baseline.

- `NODE_ENV`: service environment (`development` by default)
- `PORT`: service port (`5000` by default)
- `CORS_ORIGIN`: allowed CORS origin (`http://localhost:5173` by default)
- `OCR_MAX_FILE_SIZE`: max upload size in bytes (`10485760` by default)
- `OCR_REQUEST_TIMEOUT_MS`: extraction timeout in ms (`30000` by default)

## Run Commands

From [ocr](.) directory:

```bash
npm install
npm run dev
```

Build and run production bundle:

```bash
npm run build
npm start
```

## Quick Local Test

Health:

```bash
curl -s http://localhost:5000/health
```

Extract PDF:

```bash
curl -s -X POST http://localhost:5000/ocr/extract \
  -F "file=@/absolute/path/sample.pdf"
```

Extract DOCX:

```bash
curl -s -X POST http://localhost:5000/ocr/extract \
  -F "file=@/absolute/path/sample.docx"
```

## Project Structure

```text
ocr/
  src/
    app.ts
    index.ts
    config/
      index.ts
    middleware/
      errorHandler.ts
      requestLogger.ts
    routes/
      health.ts
      index.ts
      ocr.ts
    services/
      extractionService.ts
    types/
      extraction.ts
```

## Internal API Notes

- No auth is applied intentionally for internal usage.
- If exposed beyond trusted internal networks, add authentication and rate limiting before external access.
- Uploads are processed in memory; avoid setting very large limits without profiling memory impact.

## Handoff for Next Agent

Priority tasks:
1. Add automated tests for `POST /ocr/extract` and validation paths.
2. Improve error mapping for multer-specific errors (oversize, malformed multipart payloads).
3. Add structured request-level logging fields (request id, file type, extraction duration, outcome).
4. Optional: expose version/build info on health endpoint.

Suggested tests:
1. Valid PDF returns `200` and non-empty `extractedText`.
2. Valid DOCX returns `200` and non-empty `extractedText`.
3. Unsupported type returns `400`.
4. Missing file returns `400`.
5. Empty file returns `400`.
6. Over-size file returns `4xx` with clear error message.
7. Non-extractable/corrupt file returns `422`.

## Extension Plan: Scanned OCR (Future Phase)

Current implementation supports digital-text extraction only. For scanned PDFs/images, add an OCR engine in a separate phase.

Recommended approach:
1. Introduce a feature flag, for example `OCR_ENABLE_SCANNED=true`.
2. Add an OCR worker module using `tesseract.js` or an external OCR provider.
3. Detect scanned/no-text PDFs by checking digital extraction output length and fallback to OCR if enabled.
4. Add language configuration (for example `OCR_LANG=eng`).
5. Raise timeout and add concurrency controls for CPU-heavy workloads.
6. Keep existing response schema stable, adding optional OCR metadata fields only.

Scanned OCR operational concerns:
- CPU and memory usage increase significantly
- Throughput may require queue-based async processing
- Language model assets may increase startup time and image size

## Migration Path to Async Jobs (If Needed)

If synchronous performance becomes insufficient under load:
1. Keep `POST /ocr/extract` for small files.
2. Add `POST /ocr/jobs` to enqueue heavy jobs.
3. Add `GET /ocr/jobs/:id` for status/result retrieval.
4. Preserve data schema compatibility with current `data` payload.
