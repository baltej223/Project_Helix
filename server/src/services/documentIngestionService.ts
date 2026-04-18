import {
  DocumentUploadMetadata,
  InternalDocument,
  OcrExtractionResult,
} from '../schemas/documentSchemas.js';
import { extractTextWithOcr } from '../clients/ocrClient.js';

interface IngestDocumentInput {
  file: Express.Multer.File;
  metadata: DocumentUploadMetadata;
  ownerId?: string;
}

interface IngestDocumentResult {
  ocr: OcrExtractionResult;
  internalDocument: InternalDocument;
}

function buildInternalDocument(
  input: IngestDocumentInput,
  ocr: OcrExtractionResult
): InternalDocument {
  return {
    ownerId: input.ownerId,
    receivedAt: new Date().toISOString(),
    source: input.metadata.source,
    upload: {
      originalFileName: input.file.originalname,
      mimeType: input.file.mimetype,
      fileSizeBytes: input.file.size,
    },
    ocr,
  };
}

export async function ingestDocument(
  input: IngestDocumentInput
): Promise<IngestDocumentResult> {
  const ocr = await extractTextWithOcr(input.file);

  // To be implemented later
  const internalDocument = buildInternalDocument(input, ocr);

  return { ocr, internalDocument };
}
