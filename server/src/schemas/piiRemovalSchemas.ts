import { z } from 'zod';

export const redactedFieldSchema = z.object({
  fieldType: z.enum([
    'aadhaar',
    'pan',
    'phone',
    'email',
    'ssn',
    'url',
    'credit_card',
    'bank_account',
  ]),
  count: z.number().int().min(0),
  examplePatterns: z.array(z.string()),
});

export type RedactedField = z.infer<typeof redactedFieldSchema>;

export const piiRemovalLogSchema = z.object({
  _id: z.string().optional(),
  documentId: z.string(),
  processingJobId: z.string().optional(),
  removedAt: z.string().datetime(),
  redactedFields: z.array(redactedFieldSchema),
  cleanedText: z.string(),
  originalTextHash: z.string(), // SHA-256 hash of original for audit
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type PiiRemovalLog = z.infer<typeof piiRemovalLogSchema>;

// Response type for PII removal analysis (sent to client)
export const piiRemovalSummarySchema = z.object({
  piiLogId: z.string(),
  fieldCount: z.number().int(),
  redactedFields: z.array(
    z.object({
      fieldType: z.string(),
      count: z.number().int(),
    })
  ),
  message: z.string(),
});

export type PiiRemovalSummary = z.infer<typeof piiRemovalSummarySchema>;
