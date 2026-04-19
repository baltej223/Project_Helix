import mongoose, { Schema, Document as MongooseDoc } from 'mongoose';
import { ClauseAnalysis as ClauseAnalysisType } from '../schemas/clauseAnalysisSchemas.js';

interface ClauseAnalysisDocument extends Omit<ClauseAnalysisType, '_id'>, MongooseDoc {}

const clauseAnalysisSchema = new Schema<ClauseAnalysisDocument>(
  {
    documentId: { type: Schema.Types.ObjectId, required: true },
    processingJobId: { type: Schema.Types.ObjectId, required: true },
    clauseIndex: { type: Number, required: true, min: 0 },
    clauseText: { type: String, required: true, index: false }, // Large field, no index
    analyzedAt: { type: Date, default: () => new Date() },
    classification: {
      clauseType: {
        type: String,
        enum: [
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
        ],
        required: true,
      },
      domain: String,
      confidence: { type: Number, min: 0, max: 1 },
    },
    scores: {
      clarity: { type: Number, required: true, min: 0, max: 100 },
      deviation: { type: Number, required: true, min: 0, max: 100 },
      obligationAsymmetry: { type: Number, required: true, min: 0, max: 100 },
      financialExposure: { type: Number, required: true, min: 0, max: 100 },
    },
    plainLanguageRewrite: { type: String, required: true },
    redFlags: [String],
    financialTerms: [
      {
        amount: { type: Number, required: true, nonnegative: true },
        currency: { type: String, required: true, minlength: 2, maxlength: 3 },
        context: String,
      },
    ],
    marketComparisonId: Schema.Types.ObjectId,
  },
  {
    timestamps: true,
  }
);

// Indices for query performance
clauseAnalysisSchema.index({ documentId: 1, clauseIndex: 1 });
clauseAnalysisSchema.index({ processingJobId: 1 });
clauseAnalysisSchema.index({ 'scores.clarity': 1 }); // For sorting by clarity
clauseAnalysisSchema.index({ 'scores.financialExposure': 1 }); // For sorting by risk

const ClauseAnalysis = mongoose.model<ClauseAnalysisDocument>(
  'ClauseAnalysis',
  clauseAnalysisSchema
);

export default ClauseAnalysis;
export type { ClauseAnalysisDocument };
