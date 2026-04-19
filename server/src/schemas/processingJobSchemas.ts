import { z } from 'zod';

export const processingStageSchema = z.enum([
  'ocr',
  'pii_removal',
  'classification',
  'clause_analysis',
  'market_comparison',
]);

export type ProcessingStage = z.infer<typeof processingStageSchema>;

export const processingJobStatusSchema = z.enum(['queued', 'processing', 'completed', 'failed']);

export type ProcessingJobStatus = z.infer<typeof processingJobStatusSchema>;

export const progressSchema = z.object({
  totalClauses: z.number().int().min(0).default(0),
  processedClauses: z.number().int().min(0).default(0),
  percentComplete: z.number().min(0).max(100).default(0),
});

export type Progress = z.infer<typeof progressSchema>;

export const processingJobSchema = z.object({
  _id: z.string().optional(),
  documentId: z.string(),
  ownerId: z.string(),
  createdAt: z.string().datetime(),
  startedAt: z.string().datetime().optional(),
  completedAt: z.string().datetime().optional(),
  status: processingJobStatusSchema,
  currentStage: processingStageSchema,
  progress: progressSchema,
  results: z.object({
    piiRemovalLogId: z.string().optional(),
    classificationResult: z.object({
      domain: z.string().optional(),
      jurisdiction: z.string().optional(),
      userParty: z.string().optional(),
      confidence: z.number().min(0).max(1).optional(),
      reasoning: z.string().optional(),
    }).optional(),
    clauseAnalysisIds: z.array(z.string()).default([]),
    marketComparisonId: z.string().optional(),
  }),
  errorLog: z.array(
    z.object({
      timestamp: z.string().datetime(),
      stage: processingStageSchema,
      message: z.string(),
    })
  ).default([]),
  updatedAt: z.string().datetime(),
});

export type ProcessingJob = z.infer<typeof processingJobSchema>;
