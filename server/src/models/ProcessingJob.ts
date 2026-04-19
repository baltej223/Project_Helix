import mongoose, { Schema, Document as MongooseDoc } from 'mongoose';
import { ProcessingJob as ProcessingJobType } from '../schemas/processingJobSchemas.js';

interface ProcessingJobDocument extends Omit<ProcessingJobType, '_id'>, MongooseDoc {}

const processingJobSchema = new Schema<ProcessingJobDocument>(
  {
    documentId: { type: Schema.Types.ObjectId, required: true },
    ownerId: { type: String, required: true },
    createdAt: { type: Date, default: () => new Date() },
    startedAt: { type: Date },
    completedAt: { type: Date },
    status: {
      type: String,
      enum: ['queued', 'processing', 'completed', 'failed'],
      default: 'queued',
    },
    currentStage: {
      type: String,
      enum: ['ocr', 'pii_removal', 'classification', 'clause_analysis', 'market_comparison'],
      default: 'classification',
    },
    progress: {
      totalClauses: { type: Number, default: 0 },
      processedClauses: { type: Number, default: 0 },
      percentComplete: { type: Number, default: 0, min: 0, max: 100 },
    },
    results: {
      piiRemovalLogId: Schema.Types.ObjectId,
      classificationResult: {
        domain: String,
        jurisdiction: String,
        userParty: String,
        confidence: { type: Number, min: 0, max: 1 },
        reasoning: String,
      },
      clauseAnalysisIds: [Schema.Types.ObjectId],
      marketComparisonId: Schema.Types.ObjectId,
    },
    errorLog: [
      {
        timestamp: Date,
        stage: String,
        message: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indices for common queries
processingJobSchema.index({ ownerId: 1, createdAt: -1 });
processingJobSchema.index({ documentId: 1 });
processingJobSchema.index({ status: 1 });

const ProcessingJob = mongoose.model<ProcessingJobDocument>('ProcessingJob', processingJobSchema);

export default ProcessingJob;
export type { ProcessingJobDocument };
