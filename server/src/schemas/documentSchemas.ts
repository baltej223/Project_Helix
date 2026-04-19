import { z } from 'zod';

export const documentUploadMetadataSchema = z
  .object({
    title: z.string().min(1).max(200).optional(),
    documentTypeHint: z.string().min(1).max(100).optional(),
    source: z.enum(['web', 'email', 'manual', 'api']).optional(),
    clientUploadId: z.string().min(1).max(100).optional(),
    notes: z.string().max(2000).optional(),
  })
  .strict();

export type DocumentUploadMetadata = z.infer<typeof documentUploadMetadataSchema>;

export const ocrMetadataSchema = z.object({
  filename: z.string(),
  mimeType: z.string(),
  fileSizeBytes: z.number().int().nonnegative(),
  durationMs: z.number().int().nonnegative(),
  wordCount: z.number().int().nonnegative(),
  pageCount: z.number().int().nonnegative().nullable(),
});

export type OcrMetadata = z.infer<typeof ocrMetadataSchema>;

export const ocrExtractionSchema = z.object({
  extractedText: z.string(),
  metadata: ocrMetadataSchema,
});

export type OcrExtractionResult = z.infer<typeof ocrExtractionSchema>;

export const ocrExtractResponseSchema = z.object({
  status: z.literal('success'),
  data: ocrExtractionSchema,
});

export const documentClassificationSchema = z.object({
  domain: z.string().optional(),
  jurisdiction: z.string().optional(),
  userParty: z.string().optional(),
  confirmedByUser: z.boolean().default(false),
  classificationTimestamp: z.string().datetime().optional(),
});

export type DocumentClassification = z.infer<typeof documentClassificationSchema>;

export const documentStatusSchema = z.enum([
  'uploaded',
  'pii_removed',
  'classified',
  'analyzing',
  'completed',
  'failed',
]);

export type DocumentStatus = z.infer<typeof documentStatusSchema>;

export const internalDocumentSchema = z.object({
  id: z.string().optional(),
  ownerId: z.string().optional(),
  receivedAt: z.string().datetime(),
  source: z.string().optional(),
  upload: z.object({
    originalFileName: z.string(),
    mimeType: z.string(),
    fileSizeBytes: z.number().int().nonnegative(),
  }),
  ocr: ocrExtractionSchema,
});

export type InternalDocument = z.infer<typeof internalDocumentSchema>;

// Full Document schema (for MongoDB)
export const documentSchema = z.object({
  _id: z.string().optional(),
  ownerId: z.string(),
  uploadedAt: z.string().datetime(),
  originalFileName: z.string(),
  mimeType: z.enum(['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']),
  fileSizeBytes: z.number().int().nonnegative(),
  pageCount: z.number().int().nonnegative().nullable(),
  extractedTextLength: z.number().int().nonnegative().optional(),
  status: documentStatusSchema,
  classification: documentClassificationSchema.optional(),
  processingJobId: z.string().optional(),
  versionTracking: z.boolean().default(false),
  errorMessage: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Document = z.infer<typeof documentSchema>;
