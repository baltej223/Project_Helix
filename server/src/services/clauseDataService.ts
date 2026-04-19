import ClauseAnalysis from '../models/ClauseAnalysis.js';
import {
  ClauseAnalysis as ClauseAnalysisType,
  ClauseAnalysisSummary,
} from '../schemas/clauseAnalysisSchemas.js';

export interface SaveClauseAnalysisInput {
  documentId: string;
  processingJobId: string;
  clauseIndex: number;
  clauseText: string;
  classification: {
    clauseType: string;
    domain?: string;
    confidence?: number;
  };
  scores: {
    clarity: number;
    deviation: number;
    obligationAsymmetry: number;
    financialExposure: number;
  };
  plainLanguageRewrite: string;
  redFlags: string[];
  financialTerms: Array<{
    amount: number;
    currency: string;
    context: string;
  }>;
}

/**
 * Save clause analysis to MongoDB
 */
export async function saveClauseAnalysis(input: SaveClauseAnalysisInput): Promise<ClauseAnalysisType> {
  const analysis = new ClauseAnalysis({
    documentId: input.documentId,
    processingJobId: input.processingJobId,
    clauseIndex: input.clauseIndex,
    clauseText: input.clauseText,
    analyzedAt: new Date(),
    classification: input.classification,
    scores: input.scores,
    plainLanguageRewrite: input.plainLanguageRewrite,
    redFlags: input.redFlags,
    financialTerms: input.financialTerms,
  });

  const saved = await analysis.save();
  console.log(`✓ Clause ${input.clauseIndex} saved: ${saved._id}`);
  return saved;
}

/**
 * Get all clauses for a document
 */
export async function getClausesByDocumentId(documentId: string): Promise<ClauseAnalysisType[]> {
  return ClauseAnalysis.find({ documentId }).sort({ clauseIndex: 1 }).exec();
}

/**
 * Get clauses for a processing job
 */
export async function getClausesByJobId(processingJobId: string): Promise<ClauseAnalysisType[]> {
  return ClauseAnalysis.find({ processingJobId }).sort({ clauseIndex: 1 }).exec();
}

/**
 * Get clauses with high risk scores
 */
export async function getHighRiskClauses(
  documentId: string,
  riskThreshold = 70
): Promise<ClauseAnalysisType[]> {
  return ClauseAnalysis.find({
    documentId,
    $or: [
      { 'scores.financialExposure': { $gte: riskThreshold } },
      { 'scores.obligationAsymmetry': { $gte: riskThreshold } },
      { 'scores.clarity': { $gte: riskThreshold } },
    ],
  })
    .sort({ 'scores.financialExposure': -1 })
    .exec();
}

/**
 * Get clauses with red flags
 */
export async function getClausesWithRedFlags(documentId: string): Promise<ClauseAnalysisType[]> {
  return ClauseAnalysis.find({
    documentId,
    redFlags: { $exists: true, $ne: [] },
  })
    .sort({ clauseIndex: 1 })
    .exec();
}

/**
 * Calculate summary statistics for all clauses in a document
 */
export async function getDocumentClauseSummary(documentId: string): Promise<{
  totalClauses: number;
  avgClarity: number;
  avgDeviation: number;
  avgAsymmetry: number;
  avgFinancialExposure: number;
  totalRedFlags: number;
  riskProfile: string;
  highRiskClauses: number;
  financialTermsTotal: number;
}> {
  const clauses = await getClausesByDocumentId(documentId);

  if (clauses.length === 0) {
    return {
      totalClauses: 0,
      avgClarity: 0,
      avgDeviation: 0,
      avgAsymmetry: 0,
      avgFinancialExposure: 0,
      totalRedFlags: 0,
      riskProfile: 'unknown',
      highRiskClauses: 0,
      financialTermsTotal: 0,
    };
  }

  const avgClarity =
    clauses.reduce((sum, c) => sum + c.scores.clarity, 0) / clauses.length;
  const avgDeviation =
    clauses.reduce((sum, c) => sum + c.scores.deviation, 0) / clauses.length;
  const avgAsymmetry =
    clauses.reduce((sum, c) => sum + c.scores.obligationAsymmetry, 0) / clauses.length;
  const avgFinancialExposure =
    clauses.reduce((sum, c) => sum + c.scores.financialExposure, 0) / clauses.length;

  const totalRedFlags = clauses.reduce((sum, c) => sum + c.redFlags.length, 0);
  const highRiskClauses = clauses.filter((c) => c.scores.financialExposure >= 70).length;
  const financialTermsTotal = clauses.reduce((sum, c) => sum + c.financialTerms.length, 0);

  let riskProfile = 'Low';
  if (avgFinancialExposure >= 70 || highRiskClauses > 3) {
    riskProfile = 'High';
  } else if (avgFinancialExposure >= 50 || highRiskClauses > 1) {
    riskProfile = 'Medium';
  }

  return {
    totalClauses: clauses.length,
    avgClarity: Math.round(avgClarity),
    avgDeviation: Math.round(avgDeviation),
    avgAsymmetry: Math.round(avgAsymmetry),
    avgFinancialExposure: Math.round(avgFinancialExposure),
    totalRedFlags,
    riskProfile,
    highRiskClauses,
    financialTermsTotal,
  };
}

/**
 * Get clause summaries (lightweight version)
 */
export async function getClauseSummaries(documentId: string): Promise<ClauseAnalysisSummary[]> {
  const clauses = await getClausesByDocumentId(documentId);
  return clauses.map((c) => ({
    clauseIndex: c.clauseIndex,
    clauseType: c.classification.clauseType,
    scores: c.scores,
    overallRiskScore: Math.round(
      (c.scores.financialExposure + c.scores.obligationAsymmetry + c.scores.clarity) / 3
    ),
    hasRedFlags: c.redFlags.length > 0,
    redFlagsCount: c.redFlags.length,
  }));
}
