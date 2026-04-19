# Project Helix Server API Documentation

A comprehensive contract intelligence platform API that processes documents through OCR, PII removal, classification, and detailed clause analysis.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Setup & Installation](#setup--installation)
- [Configuration](#configuration)
- [Running the Server](#running-the-server)
- [Architecture](#architecture)
- [Authentication](#authentication)
- [API Endpoints](#api-endpoints)
- [Error Handling](#error-handling)
- [Examples](#examples)

---

## Overview

Project Helix Server is a Node.js/Express backend that:

1. **Ingests Documents** - Accepts PDF & DOCX files with metadata
2. **Extracts Text** - Uses OCR service to extract text from documents
3. **Removes PII** - Detects and redacts sensitive information (Aadhaar, PAN, phone, email, SSN, etc.)
4. **Classifies Contracts** - Uses Gemini LLM to categorize contract type, jurisdiction, and parties
5. **Analyzes Clauses** - Segments documents into clauses and analyzes each for:
   - Type classification (termination, indemnification, payment, IP, etc.)
   - Multi-dimensional risk scoring (clarity, deviation, obligation asymmetry, financial exposure)
   - Plain language rewrites
   - Red flags and financial terms extraction

**Key Features:**
- Asynchronous processing via Bull.js job queue
- MongoDB for persistent storage
- Redis for job queue management
- OpenAI SDK abstraction supporting multiple LLM providers (Gemini, OpenAI, etc.)
- Comprehensive error handling and audit logging
- Progress tracking for long-running analysis
- Graceful degradation with fallback local analysis

---

## Prerequisites

- **Node.js** ≥ 18.0.0
- **npm** ≥ 9.0.0
- **MongoDB** (cloud or local)
- **Redis** (cloud or local)
- **Google Gemini API Key** (for LLM features)
- **OCR Service** running on accessible URL

---

## Setup & Installation

### 1. Clone Repository

```bash
cd /path/to/Project_Helix/server
```

### 2. Install Dependencies

```bash
npm install
```

This installs:
- **express** - Web framework
- **mongoose** - MongoDB ODM
- **bull** - Job queue
- **redis** - In-memory data store
- **openai** - LLM SDK (works with Google Gemini via OpenAI-compatible endpoint)
- **zod** - Schema validation
- **multer** - File upload handling
- **dotenv** - Environment configuration

### 3. Configure Environment

Create a `.env` file in the server directory (see [Configuration](#configuration) section).

---

## Configuration

Create `.env` file with the following variables:

```bash
# Server
NODE_ENV=development
PORT=3000
CORS_ORIGIN=*

# File Upload
UPLOAD_MAX_FILE_SIZE_BYTES=10485760

# OCR Service
OCR_BASE_URL=http://localhost:5000
OCR_REQUEST_TIMEOUT_MS=30000

# MongoDB
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/project-helix?retryWrites=true&w=majority

# Redis
REDIS_URL=redis://default:password@host:port

# Language Model (Gemini via OpenAI SDK)
GEMINI_API_KEY=your_google_api_key_here
LLM_MODEL=gemini-2.5-flash
LLM_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai/
```

### Environment Variables Explained

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | development | Execution environment |
| `PORT` | 3000 | Server port |
| `CORS_ORIGIN` | * | CORS allowed origins |
| `UPLOAD_MAX_FILE_SIZE_BYTES` | 10485760 | Max file size (10MB) |
| `OCR_BASE_URL` | http://localhost:5000 | OCR service endpoint |
| `OCR_REQUEST_TIMEOUT_MS` | 30000 | OCR request timeout |
| `MONGODB_URI` | mongodb://localhost:27017/project-helix | MongoDB connection |
| `REDIS_URL` | redis://localhost:6379 | Redis connection |
| `GEMINI_API_KEY` | - | **Required** for LLM features |
| `LLM_MODEL` | gemini-2.5-flash | Model name for API |
| `LLM_BASE_URL` | https://generativelanguage.googleapis.com/v1beta/openai/ | OpenAI-compatible endpoint |

---

## Running the Server

### Development Mode (with auto-reload)

```bash
npm run dev
```

Expected output:
```
✓ MongoDB connected
✓ Redis connected
✓ Job queue initialized
✓ Job processor registered
✓ Server running in development mode on port 3000
```

### Production Mode

```bash
npm run build  # Build TypeScript
npm start      # Run compiled code
```

---

## Architecture

### Processing Pipeline

```
1. Document Upload (POST /documents)
   ↓
2. OCR Extraction → Text Extraction
   ↓
3. PII Detection & Redaction → Audit Log
   ↓
4. Classification (POST /documents/:id/classify)
   ↓
5. Job Enqueue (Bull.js) → Redis
   ↓
6. Background Worker (Bull Processor)
   ├─ Clause Segmentation (5-strategy regex)
   ├─ Clause Analysis (Gemini LLM)
   └─ Store Results → MongoDB
   ↓
7. Query Results (GET endpoints)
```

### Data Models

**Document**
- Stores original file, OCR metadata, classification results
- Tracks processing status and ownership

**PiiRemovalLog**
- Records PII detection and redaction audit trail
- Stores cleaned text for downstream processing

**ProcessingJob**
- Tracks async clause analysis job
- Stores progress, status, errors, results

**ClauseAnalysis**
- Individual clause with segmentation, type, scores
- Red flags, financial terms, plain language rewrite

---

## Authentication

**Current Implementation:** Mock authentication (development)

All protected routes use middleware that extracts `userId` from request context or generates temporary ID:

```typescript
const ownerId = (req as any).userId || 'user-' + Date.now();
```

**Public Endpoints:**
- `GET /health` - No authentication required

**Protected Endpoints:**
- All `/documents/*` routes
- All `/processing-jobs/*` routes

⚠️ **Note:** Replace with proper JWT/OAuth2 authentication for production.

---

## API Endpoints

### Health Check

#### `GET /health`

Check server status.

**Response:**
```json
{
  "status": "ok",
  "service": "project-helix-server",
  "timestamp": "2026-04-19T05:23:47.000Z"
}
```

---

### Document Management

#### `POST /documents`

Upload a document for processing.

**Request:**
- **Method:** POST
- **ContentType:** multipart/form-data

**Form Fields:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file` | File | Yes | PDF or DOCX document (max 10MB) |
| `title` | String | Yes | Document title/name |
| `sourceUrl` | String | No | Original document URL |
| `uploadedBy` | String | No | Uploader name/identifier |

**Response (200 - Success):**
```json
{
  "status": "success",
  "data": {
    "documentId": "507f1f77bcf86cd799439011",
    "extractedText": "Full document text from OCR...",
    "cleanedText": "Text with PII redacted...",
    "metadata": {
      "fileType": "pdf",
      "pages": 10,
      "wordCount": 5420,
      "language": "en"
    },
    "pii": {
      "piiLogId": "507f1f77bcf86cd799439012",
      "fieldCount": 3,
      "message": "PII detected and redacted"
    }
  }
}
```

**Response (200 - No PII Detected):**
```json
{
  "status": "success",
  "data": {
    "documentId": "507f1f77bcf86cd799439011",
    "extractedText": "...",
    "cleanedText": "...",
    "metadata": { ... },
    "pii": {
      "piiLogId": "507f1f77bcf86cd799439013",
      "fieldCount": 0,
      "message": "No PII detected"
    }
  }
}
```

**Error Responses:**
- `400` - Missing file, invalid type, empty file, invalid metadata
- `500` - OCR service error, database error

---

#### `POST /documents/:documentId/classify`

Classify a document and enqueue for clause analysis.

**Request:**
- **Method:** POST
- **URL Parameter:** `documentId` (MongoDB ObjectId)
- **Body:** Empty or `{}`

**Response (200 - Success):**
```json
{
  "status": "success",
  "data": {
    "documentId": "507f1f77bcf86cd799439011",
    "jobId": "507f1f77bcf86cd799439014",
    "classification": {
      "domain": "rent",
      "jurisdiction": "india",
      "userParty": "landlord",
      "confidence": 0.92,
      "reasoning": "The document contains typical lease agreement terms..."
    }
  }
}
```

**Classification Domains:**
- `rent` - Rental/lease agreements
- `employment` - Employment contracts
- `loan` - Loan agreements
- `nda` - Non-disclosure agreements
- `services` - Service agreements
- `partnership` - Partnership agreements
- `other` - Default/unclassified

**Error Responses:**
- `400` - Document not yet processed for PII removal
- `403` - Unauthorized (document ownership)
- `500` - LLM processing error

---

### Processing Jobs

#### `GET /processing-jobs/:jobId`

Get the status and progress of a processing job.

**Request:**
- **Method:** GET
- **URL Parameter:** `jobId` (MongoDB ObjectId)

**Response (200 - Success):**
```json
{
  "status": "success",
  "data": {
    "jobId": "507f1f77bcf86cd799439014",
    "documentId": "507f1f77bcf86cd799439011",
    "status": "completed",
    "currentStage": "clause_analysis",
    "progress": {
      "totalClauses": 15,
      "analyzedClauses": 15,
      "percentComplete": 100
    },
    "results": {
      "classificationResult": {
        "domain": "rent",
        "jurisdiction": "india",
        "userParty": "landlord",
        "confidence": 0.92
      }
    },
    "createdAt": "2026-04-19T05:00:00Z",
    "startedAt": "2026-04-19T05:01:00Z",
    "completedAt": "2026-04-19T05:05:30Z",
    "errorLog": []
  }
}
```

**Job Statuses:**
- `pending` - Waiting to be processed
- `processing` - Currently analyzing clauses
- `completed` - Successfully completed
- `failed` - Processing failed

**Error Responses:**
- `403` - Unauthorized
- `404` - Job not found
- `500` - Database error

---

#### `GET /processing-jobs?documentId={id}`

Get all processing jobs for a document.

**Request:**
- **Method:** GET
- **Query Parameters:**
  - `documentId` **(required)** - Document MongoDB ObjectId

**Response (200 - Success):**
```json
{
  "status": "success",
  "data": {
    "documentId": "507f1f77bcf86cd799439011",
    "jobs": [
      {
        "jobId": "507f1f77bcf86cd799439014",
        "status": "completed",
        "currentStage": "clause_analysis",
        "progress": {
          "totalClauses": 15,
          "analyzedClauses": 15,
          "percentComplete": 100
        },
        "createdAt": "2026-04-19T05:00:00Z"
      }
    ]
  }
}
```

**Error Responses:**
- `400` - Missing documentId parameter
- `403` - Unauthorized
- `500` - Database error

---

#### `GET /processing-jobs/:jobId/clauses`

Get all clauses analyzed in a processing job.

**Request:**
- **Method:** GET
- **URL Parameter:** `jobId` (MongoDB ObjectId)

**Response (200 - Success):**
```json
{
  "status": "success",
  "data": {
    "jobId": "507f1f77bcf86cd799439014",
    "totalClauses": 15,
    "clauses": [
      {
        "index": 0,
        "type": "payment",
        "scores": {
          "clarity": 35,
          "deviation": 45,
          "obligationAsymmetry": 60,
          "financialExposure": 75
        },
        "redFlagsCount": 2,
        "financialTermsCount": 3
      },
      {
        "index": 1,
        "type": "termination",
        "scores": {
          "clarity": 55,
          "deviation": 30,
          "obligationAsymmetry": 40,
          "financialExposure": 50
        },
        "redFlagsCount": 1,
        "financialTermsCount": 1
      }
    ]
  }
}
```

**Clause Types:**
- `termination` - Termination/exit clauses
- `indemnification` - Indemnity and liability
- `payment` - Payment terms and conditions
- `intellectual_property` - IP ownership and rights
- `confidentiality` - Confidentiality/NDA
- `liability_limitation` - Liability caps
- `warranty` - Warranties and representations
- `governing_law` - Jurisdiction and law
- `dispute_resolution` - Dispute resolution mechanism
- `amendment` - Amendment procedures
- `severability` - Severability clause
- `entire_agreement` - Entire agreement clause
- `other` - Other clause types

**Error Responses:**
- `403` - Unauthorized
- `404` - Job not found
- `500` - Database error

---

#### `GET /processing-jobs/:jobId/clauses/:clauseIndex`

Get detailed analysis of a specific clause.

**Request:**
- **Method:** GET
- **URL Parameters:**
  - `jobId` (MongoDB ObjectId)
  - `clauseIndex` (Integer - 0-based)

**Response (200 - Success):**
```json
{
  "status": "success",
  "data": {
    "clauseIndex": 0,
    "type": "payment",
    "title": "Payment Terms: The Tenant shall pay monthly rent of INR 50,000 on...",
    "scores": {
      "clarity": 35,
      "deviation": 45,
      "obligationAsymmetry": 60,
      "financialExposure": 75
    },
    "plainLanguageRewrite": "The tenant must pay 50,000 rupees every month by the 5th day. Late payments incur 2% interest. Payment should be made via bank transfer to the landlord's account.",
    "redFlags": [
      "Unlimited late fee accumulation",
      "Unilateral amendment rights for landlord"
    ],
    "financialTerms": [
      {
        "amount": 50000,
        "currency": "INR",
        "context": "Monthly rent payment"
      },
      {
        "amount": 2,
        "currency": "INR",
        "context": "Late payment interest percentage"
      }
    ],
    "analyzedAt": "2026-04-19T05:03:15Z"
  }
}
```

**Scoring Scale (0-100):**
- **Clarity:** 0 = Very clear, 100 = Very confusing
- **Deviation:** 0 = Matches market standard, 100 = Highly divergent
- **Obligation Asymmetry:** 0 = Balanced, 100 = Very one-sided
- **Financial Exposure:** 0 = No exposure, 100 = Severe liability

**Error Responses:**
- `403` - Unauthorized
- `404` - Job or clause not found
- `500` - Database error

---

#### `GET /processing-jobs/:jobId/summary`

Get comprehensive analysis summary for all clauses in a job.

**Request:**
- **Method:** GET
- **URL Parameter:** `jobId` (MongoDB ObjectId)

**Response (200 - Success):**
```json
{
  "status": "success",
  "data": {
    "jobId": "507f1f77bcf86cd799439014",
    "documentId": "507f1f77bcf86cd799439011",
    "status": "completed",
    "progress": {
      "totalClauses": 15,
      "analyzedClauses": 15,
      "percentComplete": 100
    },
    "classification": {
      "domain": "rent",
      "jurisdiction": "india",
      "userParty": "landlord",
      "confidence": 0.92,
      "reasoning": "..."
    },
    "statistics": {
      "totalClauses": 15,
      "averageScores": {
        "clarity": 50,
        "deviation": 45,
        "obligationAsymmetry": 55,
        "financialExposure": 60
      },
      "riskLevel": "medium",
      "criticalIssuesCount": 3,
      "redFlagsCount": 8,
      "financialTermsCount": 12
    },
    "clauseSummaries": [
      {
        "index": 0,
        "clauseType": "payment",
        "clarity": 35,
        "riskScore": 75,
        "topRedFlags": [
          "Unlimited late fee accumulation",
          "Unilateral amendment rights"
        ]
      }
    ]
  }
}
```

**Risk Levels:**
- `low` - Average financial exposure < 33
- `medium` - Average financial exposure 33-66
- `high` - Average financial exposure > 66

**Error Responses:**
- `403` - Unauthorized
- `404` - Job not found
- `500` - Database error

---

## Error Handling

### Error Response Format

```json
{
  "status": "error",
  "statusCode": 400,
  "message": "Descriptive error message",
  "errors": [
    {
      "field": "file",
      "message": "Invalid file type"
    }
  ]
}
```

### Common HTTP Status Codes

| Code | Meaning | Common Causes |
|------|---------|---------------|
| `200` | Success | Request completed |
| `400` | Bad Request | Invalid input, missing file, wrong type |
| `403` | Forbidden | Unauthorized access, ownership mismatch |
| `404` | Not Found | Resource doesn't exist |
| `500` | Server Error | Database, OCR service, or LLM errors |

### Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| `Missing file` | No file in multipart request | Include file in body with field name "file" |
| `Invalid file type` | PDF/DOCX only | Upload PDF or DOCX format |
| `Uploaded file is empty` | Zero-byte file | Upload non-empty document |
| `Document not yet processed for PII removal` | Classification before upload | Upload document first, then classify |
| `Invalid upload metadata` | Schema validation failed | Check title, sourceUrl, uploadedBy fields |
| `Unauthorized` | Not document owner | Verify userId/ownership |
| `OCR service unavailable` | OCR endpoint down | Check OCR_BASE_URL and service status |
| `LLM API error` | Gemini API failure | Check GEMINI_API_KEY, rate limits |

---

## Examples

### Example 1: Complete Workflow

```bash
# 1. Upload document
curl -X POST http://localhost:3000/documents \
  -F "file=@contract.pdf" \
  -F "title=Rental Agreement 2026" \
  -F "sourceUrl=https://example.com/docs/rental.pdf" \
  -F "uploadedBy=john@example.com"

# Response:
# {
#   "status": "success",
#   "data": {
#     "documentId": "507f1f77bcf86cd799439011",
#     "extractedText": "...",
#     "cleanedText": "...",
#     "pii": { ... }
#   }
# }

# 2. Classify document and enqueue for analysis
curl -X POST http://localhost:3000/documents/507f1f77bcf86cd799439011/classify \
  -H "Content-Type: application/json"

# Response:
# {
#   "status": "success",
#   "data": {
#     "documentId": "507f1f77bcf86cd799439011",
#     "jobId": "507f1f77bcf86cd799439014",
#     "classification": { ... }
#   }
# }

# 3. Poll job status
curl http://localhost:3000/processing-jobs/507f1f77bcf86cd799439014

# Response:
# {
#   "status": "success",
#   "data": {
#     "jobId": "507f1f77bcf86cd799439014",
#     "status": "processing",
#     "progress": {
#       "totalClauses": 15,
#       "analyzedClauses": 5,
#       "percentComplete": 33.33
#     }
#   }
# }

# 4. Get clauses (when status is "completed")
curl http://localhost:3000/processing-jobs/507f1f77bcf86cd799439014/clauses

# Response:
# {
#   "status": "success",
#   "data": {
#     "jobId": "507f1f77bcf86cd799439014",
#     "totalClauses": 15,
#     "clauses": [ ... ]
#   }
# }

# 5. Get clause details
curl http://localhost:3000/processing-jobs/507f1f77bcf86cd799439014/clauses/0

# Response:
# {
#   "status": "success",
#   "data": {
#     "clauseIndex": 0,
#     "type": "payment",
#     "scores": { ... },
#     "plainLanguageRewrite": "...",
#     "redFlags": [ ... ]
#   }
# }

# 6. Get full summary
curl http://localhost:3000/processing-jobs/507f1f77bcf86cd799439014/summary

# Response:
# {
#   "status": "success",
#   "data": {
#     "jobId": "507f1f77bcf86cd799439014",
#     "classification": { ... },
#     "statistics": { ... },
#     "clauseSummaries": [ ... ]
#   }
# }
```

### Example 2: Error Handling

```bash
# Missing file
curl -X POST http://localhost:3000/documents \
  -F "title=Missing File Test"

# Response (400):
# {
#   "status": "error",
#   "statusCode": 400,
#   "message": "Missing file. Use multipart/form-data with field \"file\".",
#   "errors": []
# }

# Invalid file type
curl -X POST http://localhost:3000/documents \
  -F "file=@image.jpg" \
  -F "title=Invalid Type"

# Response (400):
# {
#   "status": "error",
#   "statusCode": 400,
#   "message": "Invalid file type. Only PDF and DOCX are allowed.",
#   "errors": []
# }

# Unauthorized access
curl http://localhost:3000/processing-jobs/different-user-job-id

# Response (403):
# {
#   "status": "error",
#   "statusCode": 403,
#   "message": "Unauthorized",
#   "errors": []
# }
```

### Example 3: Using JavaScript/Node.js

```javascript
const FormData = require('form-data');
const fs = require('fs');
const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function analyzeContract(filePath) {
  try {
    // 1. Upload
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));
    form.append('title', 'Contract Analysis');
    form.append('uploadedBy', 'user@example.com');

    const uploadRes = await axios.post(`${BASE_URL}/documents`, form, {
      headers: form.getHeaders(),
    });

    const documentId = uploadRes.data.data.documentId;
    console.log('Document uploaded:', documentId);

    // 2. Classify
    const classifyRes = await axios.post(
      `${BASE_URL}/documents/${documentId}/classify`
    );

    const jobId = classifyRes.data.data.jobId;
    console.log('Classification started, Job ID:', jobId);

    // 3. Poll until complete
    let completed = false;
    while (!completed) {
      const jobRes = await axios.get(
        `${BASE_URL}/processing-jobs/${jobId}`
      );

      const { status, progress } = jobRes.data.data;
      console.log(`Status: ${status}, Progress: ${progress.percentComplete}%`);

      if (status === 'completed') {
        completed = true;
      } else {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    // 4. Get summary
    const summaryRes = await axios.get(
      `${BASE_URL}/processing-jobs/${jobId}/summary`
    );

    console.log('Analysis complete!');
    console.log('Classification:', summaryRes.data.data.classification);
    console.log('Statistics:', summaryRes.data.data.statistics);

  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

analyzeContract('./contract.pdf');
```

---

## Development Notes

### File Upload Limits

- Maximum file size: **10 MB** (configurable via `UPLOAD_MAX_FILE_SIZE_BYTES`)
- Supported formats: **PDF**, **DOCX**
- Must use `multipart/form-data` encoding

### PII Detection

Detects and redacts:
- Aadhaar numbers (Indian ID)
- PAN (Indian tax ID)
- Phone numbers (10-digit)
- Email addresses
- URLs
- Credit card numbers (16-digit)
- Bank account numbers
- SSN (9-digit)

### Clause Segmentation Strategy

Uses 5-tier segmentation approach:
1. **Numbered clauses** (1., 2., 3., etc.)
2. **Lettered clauses** (a), b), c), etc.)
3. **Section markers** (Section 1:, ARTICLE I:, etc.)
4. **Paragraph markers** (¶ 1, etc.)
5. **Sentence split** (fallback)

### LLM Integration

Currently uses **Google Gemini 2.5 Flash** via OpenAI-compatible endpoint.

**Switching LLM providers:**

Update `.env`:
```bash
# For OpenAI GPT-4
LLM_MODEL=gpt-4
LLM_BASE_URL=https://api.openai.com/v1/
GEMINI_API_KEY=sk-... # OpenAI API key

# For Anthropic Claude (with OpenAI adapter)
LLM_MODEL=claude-3-opus-20240229
LLM_BASE_URL=https://claude-adapter.example.com/v1/
GEMINI_API_KEY=... # Provider API key
```

No code changes needed - abstraction handles it!

---

## Troubleshooting

### Server won't start

```bash
# Check ports
lsof -i :3000

# Check environment variables
cat .env

# Check database connection
npm run dev
# Look for "✓ MongoDB connected" in logs
```

### Jobs stuck in "processing"

```bash
# Check Redis connection
redis-cli ping

# Check Bull queue
# Access MongoDB and inspect ProcessingJob collection
```

### LLM API errors

```
Error: [404 Not Found] models/gemini-2.5-flash is not found
```

Solutions:
- Verify `GEMINI_API_KEY` is valid
- Check model name in `LLM_MODEL`
- Ensure `LLM_BASE_URL` is correct
- Verify API key has access to the model

### OCR extraction failing

- Check `OCR_BASE_URL` is accessible
- Verify OCR service is running
- Check `OCR_REQUEST_TIMEOUT_MS` (increase if slow)

---

## Performance Tips

1. **Batch Processing** - Process multiple documents simultaneously
2. **Monitoring** - Watch MongoDB/Redis connections
3. **Timeouts** - Adjust `OCR_REQUEST_TIMEOUT_MS` based on document size
4. **Concurrency** - Job queue uses concurrency=1 for sequential processing (adjustable)

---

## Support & Contribution

For issues, feature requests, or contributions, please refer to the main Project Helix documentation.
