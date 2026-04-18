import { extractTextWithOcr } from '../clients/ocrClient.js';
import {
  DocumentUploadMetadata,
  InternalDocument,
} from '../schemas/documentSchemas.js';

interface IngestDocumentInput {
  file: Express.Multer.File;
  metadata: DocumentUploadMetadata;
  ownerId?: string;
}

interface IngestDocumentResult {
  extractedText: string;
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
  const ocrResult = await extractTextWithOcr(input.file);

  // To be implemented later
  const internalDocument = buildInternalDocument(input, ocrResult.extractedText);

  return {
    extractedText: ocrResult.extractedText,
    internalDocument: {
      ...internalDocument,
      ocr: ocrResult,
    },
  };
}
