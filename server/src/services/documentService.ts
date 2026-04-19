import Document from '../models/Document.js';
import { DocumentUploadMetadata, DocumentStatus } from '../schemas/documentSchemas.js';

export interface CreateDocumentInput {
  ownerId: string;
  originalFileName: string;
  mimeType: string;
  fileSizeBytes: number;
  pageCount: number | null;
  extractedTextLength?: number;
  source?: string;
}

export async function createDocument(input: CreateDocumentInput) {
  const document = new Document({
    ownerId: input.ownerId,
    originalFileName: input.originalFileName,
    mimeType: input.mimeType,
    fileSizeBytes: input.fileSizeBytes,
    pageCount: input.pageCount,
    extractedTextLength: input.extractedTextLength || 0,
    status: 'uploaded',
  });

  const saved = await document.save();
  console.log(`✓ Document created: ${saved._id}`);
  return saved;
}

export async function updateDocumentStatus(documentId: string, status: DocumentStatus, errorMessage?: string) {
  const update: any = { status };
  if (errorMessage) {
    update.errorMessage = errorMessage;
  }

  const updated = await Document.findByIdAndUpdate(documentId, update, { new: true });
  console.log(`✓ Document ${documentId} status updated to ${status}`);
  return updated;
}

export async function updateDocumentClassification(
  documentId: string,
  classification: {
    domain?: string;
    jurisdiction?: string;
    userParty?: string;
    confirmedByUser?: boolean;
  }
) {
  const updated = await Document.findByIdAndUpdate(
    documentId,
    {
      classification: {
        ...classification,
        classificationTimestamp: new Date(),
      },
      status: 'classified',
    },
    { new: true }
  );
  console.log(`✓ Document ${documentId} classified`);
  return updated;
}

export async function updateDocumentProcessingJobId(documentId: string, processingJobId: string) {
  const updated = await Document.findByIdAndUpdate(
    documentId,
    {
      processingJobId,
      status: 'analyzing',
    },
    { new: true }
  );
  console.log(`✓ Document ${documentId} linked to processing job ${processingJobId}`);
  return updated;
}

export async function getDocumentById(documentId: string) {
  const document = await Document.findById(documentId);
  if (!document) {
    throw new Error(`Document not found: ${documentId}`);
  }
  return document;
}

export async function getDocumentsByOwner(ownerId: string, limit = 50) {
  return Document.find({ ownerId }).sort({ uploadedAt: -1 }).limit(limit).exec();
}
