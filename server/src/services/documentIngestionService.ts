import { extractTextWithOcr } from '../clients/ocrClient.js';
import {
  DocumentUploadMetadata,
  InternalDocument,
} from '../schemas/documentSchemas.js';
import { createDocument, updateDocumentStatus } from './documentService.js';
import { removePiiAndLog } from './piiRemovalService.js';

interface IngestDocumentInput {
  file: Express.Multer.File;
  metadata: DocumentUploadMetadata;
  ownerId?: string;
}

interface IngestDocumentResult {
  documentId: string;
  extractedText: string;
  cleanedText: string;
  piiLogId?: string;
  internalDocument: InternalDocument;
}

function buildInternalDocument(input: IngestDocumentInput, extractedText: string): InternalDocument {
  return {
    ownerId: input.ownerId,
    receivedAt: new Date().toISOString(),
    source: input.metadata.source,
    upload: {
      originalFileName: input.file.originalname,
      mimeType: input.file.mimetype,
      fileSizeBytes: input.file.size,
    },
    ocr: {
      extractedText,
      metadata: {
        filename: input.file.originalname,
        mimeType: input.file.mimetype,
        fileSizeBytes: input.file.size,
        durationMs: 0,
        wordCount: 0,
        pageCount: null,
      },
    },
  };
}

export async function ingestDocument(
  input: IngestDocumentInput
): Promise<IngestDocumentResult> {
  const ownerId = input.ownerId || 'anonymous';

  // Step 1: Extract text with OCR
  const ocrResult = await extractTextWithOcr(input.file);

  // Step 2: Save document metadata to MongoDB (status="uploaded")
  const document = await createDocument({
    ownerId,
    originalFileName: input.file.originalname,
    mimeType: input.file.mimetype,
    fileSizeBytes: input.file.size,
    pageCount: ocrResult.metadata.pageCount,
    extractedTextLength: ocrResult.metadata.wordCount,
  });

  const documentId = document._id?.toString() || '';

  // Step 3: Remove PII and log redactions
  const piiResult = await removePiiAndLog({
    documentId,
    text: ocrResult.extractedText,
  });

  // Step 4: Update document status to "pii_removed"
  await updateDocumentStatus(documentId, 'pii_removed');

  // Build internal document
  const internalDocument = buildInternalDocument(input, ocrResult.extractedText);

  return {
    documentId,
    extractedText: ocrResult.extractedText, // Original (for logging)
    cleanedText: piiResult.cleanedText, // PII-scrubbed
    piiLogId: piiResult.piiLogId,
    internalDocument: {
      ...internalDocument,
      ocr: ocrResult,
    },
  };
}
