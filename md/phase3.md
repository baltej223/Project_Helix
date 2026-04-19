Created 6 todos

Read [](file:///home/baltej/Desktop/Project_Helix/server/package.json)

Ran terminal command:  npm install @google/generative-ai

Now I'll implement Phase 3 components. Creating ProcessingJob schema, model, job queue, classification service, and route: 

Created [](file:///home/baltej/Desktop/Project_Helix/server/src/schemas/processingJobSchemas.ts)

Created [](file:///home/baltej/Desktop/Project_Helix/server/src/models/ProcessingJob.ts)

Created [](file:///home/baltej/Desktop/Project_Helix/server/src/services/jobQueueService.ts)

Created [](file:///home/baltej/Desktop/Project_Helix/server/src/services/classificationService.ts)

Replacing 12 lines with 15 lines in [](file:///home/baltej/Desktop/Project_Helix/server/.env.example)


```

```


Replacing 34 lines with 36 lines in [](file:///home/baltej/Desktop/Project_Helix/server/src/config/index.ts)


```

```


Read [](file:///home/baltej/Desktop/Project_Helix/server/src/routes/index.ts)

Read [](file:///home/baltej/Desktop/Project_Helix/server/src/routes/document.ts)

Replacing 89 lines with 163 lines in [](file:///home/baltej/Desktop/Project_Helix/server/src/routes/document.ts)


```

```


Replacing 26 lines with 28 lines in [](file:///home/baltej/Desktop/Project_Helix/server/src/index.ts)


```

```


Completed: *Phase 3: ProcessingJob Schema & Model* (3/6)

Updated memory file [](file:///home/baltej/.config/Code/User/workspaceStorage/617834e3eaebaebb26255dc691589381/GitHub.copilot-chat/memory-tool/memories/YWQ1NTYwNmMtZDE0ZC00YmZiLWI5NTktZDg5YWEyNjQ3YmMx/plan.md)

## ✅ Phase 3 Complete: Document Classification & Job Queue

**What was implemented:**

### 1. **ProcessingJob Schema** (processingJobSchemas.ts)
   - Zod schema with enums: `ProcessingJobStatus`, `ProcessingStage`, `Progress`
   - Tracks: job metadata, classification results, error logs, progress
   - Types: `ProcessingJob`, `ProcessingJobStatus`, `ProcessingStage`

### 2. **ProcessingJob Model** (ProcessingJob.ts)
   - Mongoose schema with indices on: `ownerId`, `documentId`, `status`, `createdAt`
   - Stores:
     - Job lifecycle: `queued → processing → completed/failed`
     - Classification results: domain, jurisdiction, userParty, confidence, reasoning
     - Progress tracking: processedClauses, totalClauses, percentComplete
     - Error logs with timestamp + stage + message

### 3. **Job Queue Service** (jobQueueService.ts)
   - **Bull.js integration** with Redis for async job processing
   - Functions:
     - `initializeJobQueue()` — Start queue on server startup
     - `enqueueAnalysisJob()` — Add document to processing queue
     - `getJobStatus()` — Check job state/progress
     - `createProcessingJob()` — Create MongoDB record
     - `storeClassificationResult()` — Save LLM classification
     - `updateJobProgress()` — Track clause processing
   - Automatic retry: 3 attempts with exponential backoff

### 4. **Classification Service** (classificationService.ts)
   - **Gemini 1.5 Flash** integration with JSON structured output
   - `classifyContractWithGemini()`:
     - Detects: domain, jurisdiction, userParty
     - Returns: confidence score + reasoning
     - Domains: rent, employment, loan, nda, services, partnership, other
   - `classifyContractLocal()` — Fallback keyword-based classifier
   - Error handling: returns safe fallback if API fails

### 5. **Classification Route** ([document.ts route](server/src/routes/document.ts))
   - **POST /documents/:documentId/classify**
   - Flow:
     1. Verify document ownership
     2. Get cleaned text from PiiRemovalLog
     3. Call Gemini classification
     4. Update Document with classification
     5. Create ProcessingJob record
     6. Enqueue for async analysis
     7. Store classification in job results
   - Response includes: `jobId`, `classification`, `message`

### 6. **Configuration Updates**
   - Added `GEMINI_API_KEY` to .env.example
   - Extended `config/index.ts` with `geminiApiKey`
   - Updated index.ts to initialize job queue on server startup

---

## Data Flow (Phase 3)

```
POST /documents/:id/classify
    ↓
Load Document + PiiRemovalLog
    ↓
classifyContractWithGemini(cleanedText)
    ↓
updateDocumentClassification() → Document.status="classified"
    ↓
createProcessingJob() → ProcessingJob.status="queued"
    ↓
enqueueAnalysisJob() → Add to Redis queue with Bull.js
    ↓
Return: { jobId, classification, message }
```

---

## State After Phase 3

| Collection | Records | Purpose |
|---|---|---|
| **Document** | 1 per upload | Metadata + classification + status |
| **PiiRemovalLog** | 1 per document | Redacted fields + cleaned text |
| **ProcessingJob** | 1 per classification | Job tracking + results + error logs |

| Queue | Status | Purpose |
|---|---|---|
| **Redis (Bull)** | document-analysis | Async job queue with retry logic |

---

## API Endpoints (Phase 3)

### POST /documents (Upload)
```json
{
  "status": "success",
  "data": {
    "documentId": "ObjectId",
    "cleanedText": "PII redacted...",
    "pii": { "piiLogId", "fieldCount", "message" }
  }
}
```

### POST /documents/:documentId/classify
```json
{
  "status": "success",
  "data": {
    "jobId": "Bull job ID",
    "classification": {
      "domain": "employment",
      "jurisdiction": "india",
      "userParty": "employee",
      "confidence": 0.92,
      "reasoning": "Contains salary, position, duties..."
    }
  }
}
```

---

## Next: Phase 4 (Clause Analysis)

Ready to implement:
1. **ClauseAnalysis** schema + model
2. **Clause segmentation** service (regex + CUAD-trained RoBERTa)
3. **Clause scoring** — LLM ranks clarity, deviation, asymmetry, financial exposure
4. **Plain language rewrite** — LLM simplification
5. **Red flag detection** — Identify risky clauses
6. **Job worker** — Process Bull queue in background

Should I proceed with Phase 4?

Made changes.