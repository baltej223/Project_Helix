# Project Helix: Implementation Summary (Phase 1-3)

## Overview

Project Helix is a contract intelligence platform that ingests legal documents, performs PII scrubbing, classifies contracts, analyzes clauses, and provides market comparisons. 

This document outlines all components implemented through Phase 3: **Document Upload → PII Removal → Classification → Job Queue**.

---

## Architecture Overview

```
┌─────────────────┐
│   Client App    │
└────────┬────────┘
         │
         │ POST /documents (multipart/form-data)
         │
┌────────▼────────────────────────────────────────┐
│          Server (Node.js/Express)               │
│                                                 │
│  ┌─ Multer Upload ───────────────────┐         │
│  │ - File validation                  │         │
│  │ - MIME type check (PDF, DOCX)     │         │
│  │ - File size limit (10MB default)  │         │
│  └────────┬────────────────────────────┘         │
│           │                                      │
│  ┌────────▼──────────────────────────┐         │
│  │ OCR Service (separate microservice)          │
│  │ - Extract text + metadata        │         │
│  │ (word count, page count, duration)          │
│  └────────┬──────────────────────────┘         │
│           │                                      │
│  ┌────────▼──────────────────────────┐         │
│  │ PII Removal (Regex-based)        │         │
│  │ - Detect Aadhaar, PAN, Phone     │         │
│  │ - Redact + Log                   │         │
│  └────────┬──────────────────────────┘         │
│           │                                      │
│  ┌────────▼──────────────────────────┐         │
│  │ Document Classification (Gemini)  │         │
│  │ - Domain detection                │         │
│  │ - Jurisdiction detection          │         │
│  │ - User party identification       │         │
│  └────────┬──────────────────────────┘         │
│           │                                      │
│  ┌────────▼──────────────────────────┐         │
│  │ Job Queue (Bull.js + Redis)      │         │
│  │ - Async processing                │         │
│  │ - Retry logic                     │         │
│  │ - Progress tracking               │         │
│  └───────────────────────────────────┘         │
│                                                 │
│  ┌─────────────────────────────────┐          │
│  │ Databases                        │          │
│  │ - MongoDB: Documents, Jobs      │          │
│  │ - Redis: Queue, Cache           │          │
│  └─────────────────────────────────┘          │
└─────────────────────────────────────────────────┘
```

---

## Phase 1: Document Upload & MongoDB Integration

### Purpose
Enable users to upload documents and store metadata in MongoDB.

### Components

#### 1. **Config Enhancement** (`src/config/index.ts`)
```typescript
interface Config {
  // ... existing fields
  mongodbUri: string;
  redisUrl: string;
}
```

**Environment Variables:**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/project-helix
REDIS_URL=redis://localhost:6379
```

#### 2. **MongoDB Client** (`src/clients/mongoClient.ts`)
Manages MongoDB connection lifecycle.

**Exports:**
- `connectMongo()` — Initialize connection
- `getMongoConnection()` — Retrieve active connection
- `disconnectMongo()` — Graceful disconnect

**Usage:**
```typescript
import { connectMongo, getMongoConnection } from './clients/mongoClient.js';

await connectMongo(); // Called in index.ts on server startup
const conn = getMongoConnection(); // Use anywhere
```

#### 3. **Redis Client** (`src/clients/redisClient.ts`)
Manages Redis connection for queues and caching.

**Exports:**
- `connectRedis()` — Initialize connection
- `getRedisClient()` — Retrieve active Redis client
- `disconnectRedis()` — Graceful disconnect

**Usage:**
```typescript
import { connectRedis, getRedisClient } from './clients/redisClient.js';

await connectRedis(); // Called in index.ts on server startup
const redisClient = getRedisClient(); // Use anywhere
```

#### 4. **Document Schema** (`src/schemas/documentSchemas.ts`)
Zod schema for type-safe document validation.

**Schema:**
```typescript
{
  _id?: ObjectId;
  ownerId: string;                    // User who uploaded
  uploadedAt: Date;
  originalFileName: string;
  mimeType: "application/pdf" | "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  fileSizeBytes: number;
  pageCount: number | null;
  extractedTextLength: number;
  status: "uploaded" | "pii_removed" | "classified" | "analyzing" | "completed" | "failed";
  classification: {
    domain: string;                   // rent, employment, loan, etc.
    jurisdiction: string;             // india, us, uk, etc.
    userParty: string;                // landlord, employee, etc.
    confirmedByUser: boolean;
    classificationTimestamp: Date;
  };
  processingJobId: ObjectId;          // Reference to ProcessingJob
  versionTracking: boolean;           // User opt-in for DPDPA
  errorMessage?: string;
  timestamps: { createdAt, updatedAt };
}
```

**Exports:**
- `Document` type
- `DocumentStatus` enum
- `DocumentClassification` type
- Full `documentSchema` (Zod)

#### 5. **Document Model** (`src/models/Document.ts`)
Mongoose model with indices.

**Indices:**
- `{ ownerId: 1, status: 1 }` — Fast filtering by user + status
- `{ ownerId: 1, uploadedAt: -1 }` — Fast listing by user (newest first)
- `{ status: 1 }` — Query by status

**Schema:**
```typescript
const documentSchema = {
  ownerId: { type: String, required: true, index: true },
  uploadedAt: { type: Date, default: Date.now },
  originalFileName: { type: String, required: true },
  mimeType: { type: String, enum: [...], required: true },
  fileSizeBytes: { type: Number, required: true },
  pageCount: { type: Number, nullable: true },
  extractedTextLength: { type: Number },
  status: { type: String, enum: [...], default: 'uploaded' },
  classification: { /* nested */ },
  processingJobId: { type: ObjectId },
  versionTracking: { type: Boolean, default: false },
  errorMessage: { type: String },
  timestamps: true,
};
```

#### 6. **Document Service** (`src/services/documentService.ts`)
Business logic for document CRUD operations.

**Functions:**

```typescript
// Create new document
async function createDocument(input: CreateDocumentInput): Promise<Document>

// Update document status
async function updateDocumentStatus(
  documentId: string,
  status: DocumentStatus,
  errorMessage?: string
): Promise<Document>

// Update classification
async function updateDocumentClassification(
  documentId: string,
  classification: { domain?, jurisdiction?, userParty?, confirmedByUser? }
): Promise<Document>

// Link to processing job
async function updateDocumentProcessingJobId(
  documentId: string,
  processingJobId: string
): Promise<Document>

// Fetch by ID
async function getDocumentById(documentId: string): Promise<Document>

// List by owner
async function getDocumentsByOwner(ownerId: string, limit?: number): Promise<Document[]>
```

#### 7. **Document Ingestion Service** (`src/services/documentIngestionService.ts`)
Orchestrates upload → OCR → PII removal pipeline.

**Function:**
```typescript
async function ingestDocument(input: IngestDocumentInput): Promise<IngestDocumentResult>
```

**Input:**
```typescript
{
  file: Express.Multer.File;
  metadata: DocumentUploadMetadata;
  ownerId?: string;
}
```

**Output:**
```typescript
{
  documentId: string;
  extractedText: string;
  cleanedText: string;
  piiLogId?: string;
  internalDocument: InternalDocument;
}
```

**Flow:**
1. Extract text via OCR service
2. Save document metadata to MongoDB
3. Remove PII and log redactions
4. Update document status to "pii_removed"
5. Return results

#### 8. **Upload Route** (`src/routes/document.ts`)
POST /documents endpoint.

**Endpoint:**
```
POST /documents
Content-Type: multipart/form-data

Fields:
- file: File (PDF or DOCX, max 10MB)
- metadata: JSON (optional) { title, documentTypeHint, source, clientUploadId, notes }
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "documentId": "ObjectId",
    "extractedText": "Full text from document",
    "cleanedText": "[REDACTED_AADHAAR] some text [REDACTED_PAN]",
    "metadata": {
      "filename": "contract.pdf",
      "mimeType": "application/pdf",
      "fileSizeBytes": 102400,
      "durationMs": 1200,
      "wordCount": 5432,
      "pageCount": 3
    },
    "pii": {
      "piiLogId": "ObjectId",
      "fieldCount": 2,
      "message": "PII detected and redacted"
    }
  }
}
```

**Errors:**
- 400: Missing file, empty file, unsupported MIME type
- 413: File too large

#### 9. **Server Initialization** (`src/index.ts`)
Connects databases on startup.

```typescript
async function startServer(): Promise<void> {
  try {
    await connectMongo();
    await connectRedis();
    
    const app = createApp();
    app.listen(config.port, () => {
      console.log(`✓ Server running on port ${config.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}
```

### Database State After Phase 1

**Collections Created:**
- `documents` — One record per upload

**Sample Document:**
```json
{
  "_id": "ObjectId(...)",
  "ownerId": "user-1234567890",
  "uploadedAt": "2026-04-19T10:30:00Z",
  "originalFileName": "employment_contract.pdf",
  "mimeType": "application/pdf",
  "fileSizeBytes": 102400,
  "pageCount": 3,
  "extractedTextLength": 5432,
  "status": "uploaded",
  "versionTracking": false,
  "createdAt": "2026-04-19T10:30:00Z",
  "updatedAt": "2026-04-19T10:30:00Z"
}
```

---

## Phase 2: PII Removal & Logging

### Purpose
Scrub personally identifiable information before passing text to LLM.

### Components

#### 1. **PII Removal Schema** (`src/schemas/piiRemovalSchemas.ts`)
Zod schema for PII detection and logging.

**Supported PII Field Types:**
- `aadhaar` — 12-digit Aadhaar number (India)
- `pan` — Permanent Account Number (India)
- `phone` — 10-digit phone number
- `email` — Email address
- `ssn` — Social Security Number (US)
- `url` — URL
- `credit_card` — Credit card number
- `bank_account` — Bank account number

**Schema:**
```typescript
{
  _id?: ObjectId;
  documentId: ObjectId;               // Reference to Document
  processingJobId?: ObjectId;         // Reference to ProcessingJob
  removedAt: Date;
  redactedFields: [{
    fieldType: string;                // aadhaar, pan, phone, etc.
    count: number;                    // How many found
    examplePatterns: string[];        // Anonymized examples
  }];
  cleanedText: string;                // PII-scrubbed version
  originalTextHash: string;           // SHA-256 hash of original
  timestamps: { createdAt, updatedAt };
}
```

**Exports:**
- `RedactedField` type
- `PiiRemovalLog` type
- `PiiRemovalSummary` type

#### 2. **PII Removal Log Model** (`src/models/PiiRemovalLog.ts`)
Mongoose model for audit trail.

**Indices:**
- `{ documentId: 1, removedAt: -1 }` — Audit trail per document

**Storage:**
- `cleanedText` is NOT indexed (large text)
- `originalTextHash` is stored for audit (not the original text itself)

#### 3. **PII Removal Service** (`src/services/piiRemovalService.ts`)
Regex-based PII detection and scrubbing.

**Regex Patterns:**
```
aadhaar:     /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g
pan:         /\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b/g
phone:       /\b[6-9]\d{9}\b/g
email:       /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/g
url:         /\bhttps?:\/\/[^\s]+\b/g
credit_card: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g
ssn:         /\b\d{3}-\d{2}-\d{4}\b/g
```

**Functions:**

```typescript
// Main function: Detect, redact, and log PII
async function removePiiAndLog(input: PiiRemovalInput): Promise<PiiRemovalResult>

// Retrieve audit trail
async function getPiiRemovalLog(documentId: string): Promise<PiiRemovalLog>
```

**Examples:**
```
Original:  "Aadhaar: 1234-5678-9012, employee since 2020"
Cleaned:   "Aadhaar: [REDACTED_AADHAAR], employee since 2020"

Original:  "Email: john@example.com, PAN: ABCDE1234F"
Cleaned:   "Email: [REDACTED_EMAIL], PAN: [REDACTED_PAN]"
```

**Anonymized Logging:**
```json
{
  "fieldType": "aadhaar",
  "count": 1,
  "examplePatterns": ["XXXX-XXXX-XXXX"]  // Not actual value
}
```

#### 4. **Integration into Ingestion Pipeline** (`src/services/documentIngestionService.ts`)
Updated to call PII removal after OCR.

**Updated Flow:**
```
1. Extract text (OCR)
2. Create Document record (status="uploaded")
3. Remove PII and log (calls removePiiAndLog)
4. Update Document status to "pii_removed"
5. Return cleanedText + piiLogId
```

#### 5. **Updated Upload Response** (`src/routes/document.ts`)
Now includes PII summary.

**Response includes:**
```json
{
  "pii": {
    "piiLogId": "ObjectId",
    "fieldCount": 2,
    "message": "PII detected and redacted"
  }
}
```

### Database State After Phase 2

**Collections:**
- `documents` — Document metadata
- `piiremovallogs` — PII redaction audit trail

**Sample PiiRemovalLog:**
```json
{
  "_id": "ObjectId(...)",
  "documentId": "ObjectId(...)",
  "removedAt": "2026-04-19T10:30:05Z",
  "redactedFields": [
    {
      "fieldType": "aadhaar",
      "count": 1,
      "examplePatterns": ["XXXX-XXXX-XXXX"]
    },
    {
      "fieldType": "pan",
      "count": 1,
      "examplePatterns": ["XXXXX0000A"]
    }
  ],
  "cleanedText": "Aadhaar: [REDACTED_AADHAAR], PAN: [REDACTED_PAN], ...",
  "originalTextHash": "sha256_hash_of_original_text",
  "createdAt": "2026-04-19T10:30:05Z"
}
```

**Document After Phase 2:**
```json
{
  "_id": "ObjectId(...)",
  "status": "pii_removed",       // Transitioned from "uploaded"
  "...": "..."
}
```

---

## Phase 3: Document Classification & Job Queue

### Purpose
Classify contracts by domain/jurisdiction, enqueue for async analysis, track job progress.

### Components

#### 1. **ProcessingJob Schema** (`src/schemas/processingJobSchemas.ts`)
Zod schema for async job tracking.

**Enums:**
```typescript
enum ProcessingStage {
  ocr = "ocr",
  pii_removal = "pii_removal",
  classification = "classification",
  clause_analysis = "clause_analysis",
  market_comparison = "market_comparison",
}

enum ProcessingJobStatus {
  queued = "queued",
  processing = "processing",
  completed = "completed",
  failed = "failed",
}
```

**Schema:**
```typescript
{
  _id?: ObjectId;
  documentId: ObjectId;               // Reference to Document
  ownerId: string;                    // User who owns job
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  status: ProcessingJobStatus;        // queued|processing|completed|failed
  currentStage: ProcessingStage;      // Which stage is being processed
  progress: {
    totalClauses: number;
    processedClauses: number;
    percentComplete: number;          // 0-100
  };
  results: {
    piiRemovalLogId?: ObjectId;
    classificationResult?: {
      domain: string;
      jurisdiction: string;
      userParty: string;
      confidence: number;             // 0-1
      reasoning: string;
    };
    clauseAnalysisIds: ObjectId[];
    marketComparisonId?: ObjectId;
  };
  errorLog: [{
    timestamp: Date;
    stage: ProcessingStage;
    message: string;
  }];
  timestamps: { createdAt, updatedAt };
}
```

**Exports:**
- `ProcessingJob` type
- `ProcessingJobStatus` enum
- `ProcessingStage` enum
- `Progress` type

#### 2. **ProcessingJob Model** (`src/models/ProcessingJob.ts`)
Mongoose model with job tracking indices.

**Indices:**
- `{ ownerId: 1, createdAt: -1 }` — List jobs by user (newest first)
- `{ documentId: 1 }` — Find jobs by document
- `{ status: 1 }` — Query by status

#### 3. **Redis Client Enhancement** (`src/clients/redisClient.ts`)
Already implemented in Phase 1, used by job queue.

#### 4. **Job Queue Service** (`src/services/jobQueueService.ts`)
Bull.js integration for async job processing.

**Configuration:**
```typescript
const queue = new Queue('document-analysis', {
  redis: { url: REDIS_URL },
  defaultJobOptions: {
    removeOnComplete: true,
    removeOnFail: true,
    attempts: 3,
    backoff: { type: 'exponential', delay: 2000 }
  }
})
```

**Functions:**

```typescript
// Initialize queue (called in index.ts)
async function initializeJobQueue(): Promise<Queue>

// Add job to queue
async function enqueueAnalysisJob(data: AnalysisJobData): Promise<string>

// Check job status
async function getJobStatus(jobId: string): Promise<{
  id: number;
  state: string;
  progress: number;
  data: AnalysisJobData;
  failedReason?: string;
}>

// Create MongoDB record
async function createProcessingJob(input: {
  documentId: string;
  ownerId: string;
  piiRemovalLogId?: string;
  stage?: ProcessingStage;
}): Promise<string>

// Update job status
async function updateJobStatus(
  jobId: string,
  status: ProcessingJobStatus,
  errorMessage?: string
): Promise<ProcessingJob>

// Track progress
async function updateJobProgress(
  jobId: string,
  processed: number,
  total: number
): Promise<ProcessingJob>

// Store classification result
async function storeClassificationResult(
  jobId: string,
  result: ClassificationResult
): Promise<ProcessingJob>

// Retrieve job
async function getProcessingJobById(jobId: string): Promise<ProcessingJob>

// List jobs by document
async function getJobsByDocumentId(documentId: string): Promise<ProcessingJob[]>
```

**Job Data:**
```typescript
interface AnalysisJobData {
  jobId: string;
  documentId: string;
  ownerId: string;
  cleanedText: string;
  domain?: string;
  sourceMetadata?: Record<string, any>;
}
```

#### 5. **Classification Service** (`src/services/classificationService.ts`)
Gemini 1.5 Flash integration for contract classification.

**Functions:**

```typescript
// Classify via Gemini API (with structured output)
async function classifyContractWithGemini(
  cleanedText: string
): Promise<ClassificationResult>

// Fallback: keyword-based local classification
function classifyContractLocal(
  cleanedText: string
): ClassificationResult
```

**Output Type:**
```typescript
interface ClassificationResult {
  domain: string;           // rent, employment, loan, nda, services, partnership, other
  jurisdiction: string;     // india, us, uk, other
  userParty: string;       // landlord, tenant, employer, employee, etc.
  confidence: number;      // 0-1
  reasoning: string;       // LLM explanation
}
```

**Gemini Prompt:**
```
You are a legal document classifier. Analyze the following contract text.

Contract text:
[{cleanedText}]

Provide JSON:
- domain: contract type
- jurisdiction: governing jurisdiction
- userParty: which party user represents
- confidence: confidence level 0-1
- reasoning: brief explanation

Respond ONLY with valid JSON.
```

**Classification Domains:**
- rent — Lease/rental agreements
- employment — Employment contracts
- loan — Loan/financing agreements
- nda — Non-disclosure agreements
- services — Service contracts
- partnership — Partnership agreements
- other — Uncategorized

#### 6. **Configuration Updates** (`src/config/index.ts`)
Added Gemini API support.

**New Environment Variable:**
```
GEMINI_API_KEY=your-gemini-api-key-here
```

**Config Export:**
```typescript
interface Config {
  // ... existing
  geminiApiKey: string;
}
```

#### 7. **Classification Route** (`src/routes/document.ts`)
POST /documents/:documentId/classify endpoint.

**Endpoint:**
```
POST /documents/:documentId/classify
Content-Type: application/json
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "jobId": "Bull job ID or ObjectId",
    "classification": {
      "domain": "employment",
      "jurisdiction": "india",
      "userParty": "employee",
      "confidence": 0.92,
      "reasoning": "Contains salary, position, duties, termination clause..."
    },
    "message": "Document classified and queued for analysis"
  }
}
```

**Errors:**
- 400: Document not yet processed for PII
- 403: Unauthorized (not document owner)
- 500: LLM classification failed (falls back gracefully)

**Flow:**
1. Verify document ownership
2. Retrieve PiiRemovalLog (get cleanedText)
3. Call classifyContractWithGemini()
4. Update Document with classification
5. Create ProcessingJob record
6. Enqueue job in Bull queue
7. Store classification in job results
8. Return { jobId, classification }

#### 8. **Server Initialization Enhancement** (`src/index.ts`)
Initialize job queue on startup.

```typescript
async function startServer(): Promise<void> {
  try {
    await connectMongo();
    await connectRedis();
    await initializeJobQueue();  // NEW
    
    const app = createApp();
    app.listen(config.port, () => {
      console.log(`✓ Server running on port ${config.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}
```

### Database State After Phase 3

**Collections:**
- `documents` — Document metadata + classification
- `piiremovallogs` — PII audit trail
- `processingjobs` — Job tracking

**Redis:**
- `document-analysis` queue — Pending/processing jobs

**Sample ProcessingJob:**
```json
{
  "_id": "ObjectId(...)",
  "documentId": "ObjectId(...)",
  "ownerId": "user-1234567890",
  "createdAt": "2026-04-19T10:30:10Z",
  "startedAt": null,
  "completedAt": null,
  "status": "queued",
  "currentStage": "classification",
  "progress": {
    "totalClauses": 0,
    "processedClauses": 0,
    "percentComplete": 0
  },
  "results": {
    "piiRemovalLogId": "ObjectId(...)",
    "classificationResult": {
      "domain": "employment",
      "jurisdiction": "india",
      "userParty": "employee",
      "confidence": 0.92,
      "reasoning": "..."
    },
    "clauseAnalysisIds": [],
    "marketComparisonId": null
  },
  "errorLog": []
}
```

**Document After Phase 3:**
```json
{
  "_id": "ObjectId(...)",
  "status": "classified",       // Transitioned from "pii_removed"
  "classification": {
    "domain": "employment",
    "jurisdiction": "india",
    "userParty": "employee",
    "confirmedByUser": false,
    "classificationTimestamp": "2026-04-19T10:30:10Z"
  },
  "processingJobId": "ObjectId(...)",
  "...": "..."
}
```

---

## Complete Request/Response Flow

### 1. Upload Document
```
POST /documents
Content-Type: multipart/form-data

Field: file → contract.pdf
Field: metadata → {"source": "manual"}

↓

Processing:
- Validate file (MIME, size)
- Extract text via OCR
- Create Document (status="uploaded")
- Remove PII, log redactions
- Update Document (status="pii_removed")

↓

Response (200):
{
  "status": "success",
  "data": {
    "documentId": "65abc1234...",
    "extractedText": "Full text",
    "cleanedText": "[REDACTED_AADHAAR] some text",
    "metadata": {"wordCount": 5432, ...},
    "pii": {"piiLogId": "65def5678...", "fieldCount": 2}
  }
}
```

### 2. Classify Document
```
POST /documents/65abc1234.../classify
Content-Type: application/json

↓

Processing:
- Get Document + PiiRemovalLog
- Call Gemini API
- Update Document (status="classified", add classification)
- Create ProcessingJob (status="queued")
- Enqueue to Bull queue
- Store classification result

↓

Response (200):
{
  "status": "success",
  "data": {
    "jobId": "job_12345",
    "classification": {
      "domain": "employment",
      "jurisdiction": "india",
      "userParty": "employee",
      "confidence": 0.92,
      "reasoning": "..."
    },
    "message": "Document classified and queued for analysis"
  }
}
```

---

## Environment Setup

### `.env` File
```
NODE_ENV=development
PORT=3000
CORS_ORIGIN=*
UPLOAD_MAX_FILE_SIZE_BYTES=10485760
OCR_BASE_URL=http://localhost:5000
OCR_REQUEST_TIMEOUT_MS=30000

MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/project-helix?retryWrites=true&w=majority
REDIS_URL=redis://localhost:6379

GEMINI_API_KEY=your-gemini-api-key-here
```

---

## File Structure

```
server/
├── src/
│   ├── clients/
│   │   ├── mongoClient.ts         ✅ Phase 1
│   │   ├── redisClient.ts         ✅ Phase 1
│   │   └── ocrClient.ts           (existing)
│   ├── models/
│   │   ├── Document.ts            ✅ Phase 1
│   │   ├── PiiRemovalLog.ts        ✅ Phase 2
│   │   └── ProcessingJob.ts        ✅ Phase 3
│   ├── schemas/
│   │   ├── documentSchemas.ts      ✅ Phase 1
│   │   ├── piiRemovalSchemas.ts    ✅ Phase 2
│   │   └── processingJobSchemas.ts ✅ Phase 3
│   ├── services/
│   │   ├── documentService.ts      ✅ Phase 1
│   │   ├── documentIngestionService.ts (Updated: Phase 2)
│   │   ├── piiRemovalService.ts    ✅ Phase 2
│   │   ├── classificationService.ts ✅ Phase 3
│   │   └── jobQueueService.ts      ✅ Phase 3
│   ├── routes/
│   │   ├── document.ts             (Updated: Phase 1, 2, 3)
│   │   ├── health.ts               (existing)
│   │   └── index.ts                (existing)
│   ├── middleware/
│   │   ├── auth.ts                 (existing)
│   │   ├── errorHandler.ts         (existing)
│   │   └── requestLogger.ts        (existing)
│   ├── config/
│   │   └── index.ts                (Updated: Phase 1, 3)
│   ├── app/
│   │   ├── createApp.ts            (existing)
│   │   ├── registerErrorHandlers.ts (existing)
│   │   ├── registerMiddlewares.ts  (existing)
│   │   └── registerRoutes.ts       (existing)
│   └── index.ts                    (Updated: Phase 1, 3)
├── .env.example                    (Updated: Phase 1, 3)
├── package.json
└── tsconfig.json
```

---

## Dependencies Added

```json
{
  "dependencies": {
    "mongoose": "^9.4.1",          ✅ Phase 1 (MongoDB ODM)
    "redis": "^5.12.1",            ✅ Phase 1 (Redis client)
    "bull": "^4.16.5",             ✅ Phase 3 (Job queue)
    "@google/generative-ai": "latest"  ✅ Phase 3 (Gemini API)
  }
}
```

---

## Testing Checklist

### Phase 1: Document Upload
- [ ] Upload PDF document
- [ ] Verify Document record created in MongoDB
- [ ] Check filename, filesize, pageCount stored
- [ ] Verify status="uploaded"
- [ ] Confirm documentId returned in response

### Phase 2: PII Removal
- [ ] Upload document with Aadhaar number
- [ ] Verify PiiRemovalLog created
- [ ] Check redacted fields logged (count, type)
- [ ] Confirm cleanedText has [REDACTED_AADHAAR]
- [ ] Verify Document status updated to "pii_removed"
- [ ] Confirm piiLogId in response

### Phase 3: Classification
- [ ] POST /documents/:id/classify
- [ ] Verify ProcessingJob created
- [ ] Check classification stored (domain, jurisdiction, confidence)
- [ ] Confirm job queued in Redis
- [ ] Verify Document status updated to "classified"
- [ ] Check jobId and classification returned

---

## Known Limitations & TODO

### Phase 3 Limitations:
1. **No clause segmentation yet** — Classification works on full text
2. **No clause analysis** — Scoring, rewrites, red flags not implemented
3. **No market comparison** — Pinecone integration pending
4. **No workers** — Job queue created but no background processors
5. **No progress polling** — Frontend can't track job progress
6. **No persistence of raw text** — DPDPA compliant (ephemeral)

### Next Steps (Phase 4):
1. Implement ClauseAnalysis schema + model
2. Build clause segmentation service
3. Create LLM scoring service (4 dimensions)
4. Implement background workers to process job queue
5. Add progress update endpoints
6. Build frontend job polling

### Phase 5:
1. MarketComparison schema + model
2. Pinecone integration for similarity search
3. API endpoint for market spectrum visualization

---

## Useful Commands

### Start Server
```bash
cd server
npm run dev
```

### Build TypeScript
```bash
npm run build
```

### View Logs
```bash
# Server logs show ✓/✗ for each operation
npm run dev 2>&1 | grep -E "✓|✗"
```

---

## Troubleshooting

### MongoDB Connection Failed
```
Error: MongoDB connection failed
→ Check MONGODB_URI in .env
→ Verify cluster IP whitelist includes your IP
```

### Redis Connection Failed
```
Error: Redis connection failed
→ Check REDIS_URL in .env
→ Verify Redis server is running: redis-cli ping
```

### Gemini API Error
```
Error: Classification failed
→ Check GEMINI_API_KEY in .env
→ Falls back to local keyword-based classifier
```

### Bull Queue Not Initializing
```
Error: Job queue not initialized
→ Ensure Redis is connected first
→ Check initializeJobQueue() called in index.ts
```

---

## Summary

**Phase 1-3 implements:**
- ✅ Secure document upload with validation
- ✅ MongoDB storage with proper indexing
- ✅ Redis connection for cache/queue
- ✅ Comprehensive PII detection & redaction (Indian + international)
- ✅ Transparent audit logs (what was removed)
- ✅ Gemini AI classification (domain, jurisdiction, party)
- ✅ Async job queue with retry logic
- ✅ Progress tracking infrastructure

**Ready for Phase 4:**
- Clause segmentation + analysis
- LLM-powered scoring (4 dimensions)
- Background workers for job processing

---

**Last Updated:** April 19, 2026  
**Phase:** 3/5  
**Status:** ✅ Complete
