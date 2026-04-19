s## ✅ Phase 1 Complete: Document Upload & MongoDB Persistence

**What was implemented:**

1. **Environment Setup**
   - Added `MONGODB_URI` and `REDIS_URL` to .env.example
   - Extended `config/index.ts` to load these credentials

2. **Database Clients**
   - mongoClient.ts — Mongoose connection with lifecycle management
   - redisClient.ts — Redis connection setup (ready for queue)

3. **Document Model**
   - Document.ts — Mongoose schema with proper indexing
   - Fields: ownerId, status, classification, upload metadata, error tracking
   - Compound indices for fast queries by user + status

4. **Schemas (Zod)**
   - Expanded documentSchemas.ts with full Document type
   - Added `DocumentStatus`, `DocumentClassification` enums

5. **Business Logic**
   - documentService.ts — CRUD operations:
     - `createDocument()` — Save new upload
     - `updateDocumentStatus()` — Transition through pipeline
     - `updateDocumentClassification()` — Store domain/jurisdiction/party
     - `getDocumentsByOwner()` — Fetch user's documents

6. **Integration**
   - Updated documentIngestionService.ts to **save** document after OCR
   - Updated document.ts route to return `documentId` in response
   - Updated index.ts to initialize MongoDB + Redis on startup
   - Added dummy ownerId generation for prototyping (no auth yet)

---

**Data Flow (Phase 1):**
```
User uploads PDF
    ↓
OCR extracts text
    ↓
createDocument() saves to MongoDB (status="uploaded")
    ↓
documentId returned to client
```

**Next Steps (Phase 2-3):**
- PII removal + PiiRemovalLog schema
- Document classification service
- ProcessingJob schema + Redis queue

**To test:** Create a `.env` file with valid MongoDB/Redis URLs and run `npm run dev`. Upload a document via POST `/documents`.

Made changes.