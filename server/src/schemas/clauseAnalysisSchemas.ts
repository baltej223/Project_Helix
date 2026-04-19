import { z } from 'zod';

export const clauseTypeSchema = z.enum([
  'termination',
  'indemnification',
  'payment',
  'intellectual_property',
  'confidentiality',
  'liability_limitation',
  'warranty',
  'governing_law',
  'dispute_resolution',
  'amendment',
  'severability',
  'entire_agreement',
  'other',
]);

export type ClauseType = z.infer<typeof clauseTypeSchema>;

export const financialTermSchema = z.object({
  amount: z.number().nonnegative(),
  currency: z.string().min(2).max(3), // USD, INR, etc.
  context: z.string(), // What this amount covers
});

export type FinancialTerm = z.infer<typeof financialTermSchema>;

export const clauseScoresSchema = z.object({
  clarity: z.number().min(0).max(100), // 0 = very clear, 100 = very confusing
  deviation: z.number().min(0).max(100), // 0 = matches market, 100 = highly divergent
  obligationAsymmetry: z.number().min(0).max(100), // 0 = balanced, 100 = very one-sided
  financialExposure: z.number().min(0).max(100), // 0 = no exposure, 100 = severe liability
});

export type ClauseScores = z.infer<typeof clauseScoresSchema>;

export const clauseClassificationSchema = z.object({
  clauseType: clauseTypeSchema,
  domain: z.string().optional(), // Inherited from document
  confidence: z.number().min(0).max(1).optional(),
});

export type ClauseClassification = z.infer<typeof clauseClassificationSchema>;

export const clauseAnalysisSchema = z.object({
  _id: z.string().optional(),
  documentId: z.string(),
  processingJobId: z.string(),
  clauseIndex: z.number().int().nonnegative(),
  clauseText: z.string(),
  analyzedAt: z.string().datetime(),
  classification: clauseClassificationSchema,
  scores: clauseScoresSchema,
  plainLanguageRewrite: z.string(),
  redFlags: z.array(z.string()),
  financialTerms: z.array(financialTermSchema),
  marketComparisonId: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type ClauseAnalysis = z.infer<typeof clauseAnalysisSchema>;

// Response type for summarized clause analysis
export const clauseAnalysisSummarySchema = z.object({
  clauseIndex: z.number(),
  clauseType: z.string(),
  scores: clauseScoresSchema,
  overallRiskScore: z.number().min(0).max(100),
  hasRedFlags: z.boolean(),
  redFlagsCount: z.number().int(),
});

export type ClauseAnalysisSummary = z.infer<typeof clauseAnalysisSummarySchema>;
