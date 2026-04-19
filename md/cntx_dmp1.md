# Project Helix Context Dump #1 — April 19, 2026

## Project Overview
**Project Helix** is a contract intelligence platform that ingests legal documents (PDF/DOCX), performs PII scrubbing, classifies contracts by domain, analyzes clauses for risk/deviation, and provides market comparisons. Current implementation: **Phases 1-4 complete**, Phase 5 deferred.

**User flow**: Upload → OCR → PII Removal → Classification → Clause Analysis → (Phase 5: Market Comparison) → Frontend display

---

## Architecture Status

### Tech Stack
- **Client**: React 19 + Vite + Chakra UI (Upload, Analysis, Benchmarks, Marketplace pages)
- **Server**: Node.js/Express + TypeScript (main API)
- **OCR Microservice**: Node.js/Express (standalone text extraction)
- **Databases**: MongoDB (persistent metadata + results), Redis (job queue)
- **Job Queue**: Bull.js (async processing, retry logic)
- **LLM**: Google Gemini 1.5 Flash (classification, clause analysis)
- **Validation**: Zod (schema definitions)
- **ORM**: Mongoose (MongoDB)

### Environment Variables (Required)
```
# Core
NODE_ENV=development|production
PORT=3000
CORS_ORIGIN=*

# Upload/OCR
UPLOAD_MAX_FILE_SIZE_BYTES=10485760
OCR_BASE_URL=http://localhost:5000
OCR_REQUEST_TIMEOUT_MS=30000

# Databases
MONGODB_URI=mongodb+srv://...
REDIS_URL=redis://localhost:6379

# LLM
GEMINI_API_KEY=<api-key>
```

---

## Implemented Components

### Phase 1: Document Upload & MongoDB ✅
- `src/clients/mongoClient.ts` — MongoDB connection
- `src/schemas/documentSchemas.ts` — Zod schemas
- `src/models/Document.ts` — Mongoose model
- `src/services/documentService.ts` — CRUD operations
- `src/routes/document.ts` — Upload & list endpoints

**Endpoints**: POST /documents, GET /documents, GET /documents/:id

---

### Phase 2: PII Removal & Audit Logging ✅
- `src/schemas/piiRemovalSchemas.ts`
- `src/models/PiiRemovalLog.ts`
- `src/services/piiRemovalService.ts`

**PII Patterns**: Aadhaar, PAN, Phone, Email, URLs, Credit cards

**Process**: Detect → Redact → Log audit trail

---

### Phase 3: Classification & Job Queue ✅
- `src/clients/redisClient.ts`
- `src/models/ProcessingJob.ts`
- `src/services/jobQueueService.ts`
- `src/services/classificationService.ts`

**Classification Domains**: rent, employment, loan, nda, services, partnership, other

**Endpoints**: POST /documents/:id/classify, GET /processing-jobs/:jobId

---

### Phase 4: Clause Analysis & Background Workers ✅
- `src/schemas/clauseAnalysisSchemas.ts`
- `src/models/ClauseAnalysis.ts`
- `src/services/clauseSegmentationService.ts`
- `src/services/clauseAnalysisLlmService.ts`
- `src/services/clauseDataService.ts`
- `src/workers/clauseAnalysisWorker.ts`
- `src/routes/processingJobs.ts`

**Scoring Dimensions**: Clarity (0-100), Deviation (0-100), Obligation Asymmetry (0-100), Financial Exposure (0-100)

**Segmentation**: Multi-pattern (numbered → lettered → sections → markers → sentence split)

**Endpoints**: 5 monitoring endpoints for job progress and clause retrieval

---

## Server File Structure

```
server/src/
├── index.ts
├── app/ (Express creation, middleware, routes)
├── clients/ (MongoDB, Redis, OCR HTTP client)
├── config/ (environment variables)
├── middleware/ (auth, logging, error handling)
├── models/ (Mongoose: Document, PiiRemovalLog, ProcessingJob, ClauseAnalysis)
├── routes/ (document.ts, processingJobs.ts)
├── schemas/ (Zod validation schemas)
├── services/ (business logic for each phase)
├── types/
└── workers/ (clauseAnalysisWorker.ts)
```

---

## Data Flow: End-to-End

```
Upload PDF/DOCX
    ↓
documentIngestionService (OCR + PII)
    ↓
Document.status = 'pii_removed'
    ↓
POST /classify (Gemini classification)
    ↓
Create ProcessingJob + enqueue to Bull
    ↓
clauseAnalysisWorker (background)
    ├── Segment clauses
    ├── Analyze each (Gemini + scores)
    ├── Save ClauseAnalysis records
    └── Update progress
    ↓
ProcessingJob.status = 'completed'
    ↓
API endpoints return clause data
    ↓
Frontend renders Analysis
```

---

## Database Collections

| Collection | Key Fields | Indices |
|------------|-----------|---------|
| Document | ownerId, filename, status, classification | ownerId, status |
| PiiRemovalLog | documentId, patternsFound, redactionCount | documentId |
| ProcessingJob | ownerId, documentId, status, progress, results | ownerId, documentId, status |
| ClauseAnalysis | documentId, processingJobId, clauseIndex, scores | documentId, processingJobId, clarity, financialExposure |

---

## Current Capabilities ✅

- File upload (PDF/DOCX)
- OCR text extraction
- PII detection + redaction (6 patterns)
- Document classification (domain, jurisdiction, party)
- Clause segmentation (5 strategies)
- Clause analysis (4-dimensional scoring, rewrite, red flags)
- Background job processing (Bull + Redis)
- Real-time progress tracking
- Audit trails + error recovery

---

## What's Not Yet Integrated

- Phase 5: Pinecone vector search (deferred)
- Authentication / Authorization
- File persistence (only text stored)
- Versioning / Delta comparison
- Legal marketplace
- Payment processing

---

## Next Steps

1. **Test end-to-end** (upload → classify → analyze)
2. **Deploy** (add auth, monitoring, error handling)
3. **Frontend integration** (Analysis page UI)
4. **Phase 5** (Market comparison when ready)

**Status**: Phases 1-4 complete | Phase 5 deferred | Ready for testing/deployment
**Date**: April 19, 2026