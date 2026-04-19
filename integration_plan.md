# Detailed Implementation Plan: Frontend + Backend Integration

## Implementation Status: ✅ COMPLETED

---

## Overview

The integration follows this user flow:
```
Landing Page → Upload (PDF only) → Loading State → 
  Toast: Detected domain + Dynamic party options → User confirms → 
    Clause Analysis → Analysis Page with PDF + Colored Clause Overlays
```

---

## Phase 1: Backend Enhancements ✅ COMPLETED

### 1.1 Updated Classification Service - Added Party Options

**File**: `server/src/services/classificationService.ts`

Added:
- `partyOptionsByDomain` - Domain-specific party options
- `getPartyOptionsByDomain()` - Get party options for a domain
- `getAllDomains()` - Get list of all domains### 1.2 Updated Document Routes

**File**: `server/src/routes/document.ts`

Modified `/classify` endpoint to:
- Return detected domain
- Return party options based on domain
- Return available domains
- NOT enqueue analysis (user must confirm first)

Added `/confirm` endpoint:
- Accepts `{ domain, userParty }` from user
- Updates classification with user's choices
- Enqueues clause analysis in Bull queue
- Returns jobId for polling

### 1.3 Updated Job Queue Service

**File**: `server/src/services/jobQueueService.ts`

Added:- `getProcessingJobByDocumentId()` - Get job by document ID

---

## Phase 2: Frontend API Service Update ✅ COMPLETED

**File**: `client/src/services/api.js`

Added all API functions:
- `getHealth()` - Health check
- `uploadDocument()` - Upload PDF
- `classifyDocument()` - Get domain detection
- `confirmClassification()` - Confirm and start analysis
- `getJobStatus()` - Poll job status
- `getClauses()` - Get clauses
- `getJobSummary()` - Get analysis summary
- `getClauseDetails()` - Get specific clause

---

## Phase 3: Upload Page Redesign ✅ COMPLETED

**File**: `client/src/pages/Upload.jsx`

Implemented:
1. **File Validation** - PDF only, rejects others with error
2. **Loading States** - "Uploading...", "Analyzing..."
3. **Classification Toast** - Shows detected domain + editable
4. **Dynamic Party Options** - Based on detected domain
5. **Navigation** - Redirects to `/analysis?docId=xxx&jobId=xxx`

---

## Phase 4: Analysis Page + PDF Viewer ✅ COMPLETED

### 4.1 PDF Viewer Component

**File**: `client/src/components/PdfViewer.jsx`

- Placeholder PDF viewer with zoom/pagination controls
- Clause list with risk colors
- Click to select clause

### 4.2 Analysis Page

**File**: `client/src/pages/Analysis.jsx`

- Loads `docId` and `jobId` from URL params
- Polls job status every 3 seconds
- Fetches and displays clauses
- Risk-based coloring:
  - High (>66) → Red
  - Medium (33-66) → Yellow
  - Low (<33) → Green

---

## Phase 5: Pending - PDF Rendering Enhancement

The current PdfViewer is a placeholder. To enable real PDF rendering:

1. Install `pdfjs-dist` properly:
   ```bash
   cd client && npm install pdfjs-dist@4.9.155
   ```

2. Configure Vite to handle the worker:
   ```js
   // vite.config.ts
   optimizeDeps: {
     include: ['pdfjs-dist'],
   },
   ```

3. Update PdfViewer to use actual PDF rendering

---

## API Endpoints Summary

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/documents` | Upload PDF |
| POST | `/documents/:id/classify` | Detect domain + party options |
| POST | `/documents/:id/confirm` | Confirm domain + party, start analysis |
| GET | `/processing-jobs/:id` | Poll job status |
| GET | `/processing-jobs/:id/clauses` | Get all clauses |
| GET | `/processing-jobs/:id/summary` | Get analysis summary |

---

## File Changes Summary

### New Files (Frontend)

- `client/src/components/PdfViewer.jsx` - PDF viewer + annotations

### Modified Files (Frontend)

- `client/src/services/api.js` - Added API functions
- `client/src/pages/Upload.jsx` - Complete redesign
- `client/src/pages/Analysis.jsx` - Updated for integration

### Modified Files (Backend)

- `server/src/services/classificationService.ts` - Added party options
- `server/src/routes/document.ts` - Added confirm endpoint
- `server/src/services/jobQueueService.ts` - Added helper function

---

## Implementation Order Completed

1. ✅ Phase 1: Backend enhancements
2. ✅ Phase 2: Frontend API service
3. ✅ Phase 3: Upload page redesign
4. ✅ Phase 4: PDF viewer + Analysis page
5. 🔲 Phase 5: Testing with running services

---

## Notes

- PDF viewer is currently a placeholder (shows "PDF viewer will display here")
- Real PDF rendering requires proper pdfjs-dist setup
- Risk colors applied based on `financialExposure` score
- Toast shows detected domain + dynamic party options