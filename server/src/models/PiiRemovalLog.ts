import mongoose, { Schema, Document as MongooseDoc } from 'mongoose';
import { PiiRemovalLog as PiiRemovalLogType } from '../schemas/piiRemovalSchemas.js';

interface PiiRemovalLogDocument extends Omit<PiiRemovalLogType, '_id'>, MongooseDoc {}

const piiRemovalLogSchema = new Schema<PiiRemovalLogDocument>(
  {
    documentId: { type: Schema.Types.ObjectId, required: true, index: true },
    processingJobId: { type: Schema.Types.ObjectId, index: true },
    removedAt: { type: Date, default: () => new Date() },
    redactedFields: [
      {
        fieldType: {
          type: String,
          enum: [
            'aadhaar',
            'pan',
            'phone',
            'email',
            'ssn',
            'url',
            'credit_card',
            'bank_account',
          ],
          required: true,
        },
        count: { type: Number, required: true, min: 0 },
        examplePatterns: [String],
      },
    ],
    cleanedText: { type: String, required: true, index: false }, // Large text field, no index
    originalTextHash: { type: String, required: true }, // SHA-256 hash
  },
  {
    timestamps: true,
  }
);

// Index for audit trail queries
piiRemovalLogSchema.index({ documentId: 1, removedAt: -1 });

const PiiRemovalLog = mongoose.model<PiiRemovalLogDocument>('PiiRemovalLog', piiRemovalLogSchema);

export default PiiRemovalLog;
export type { PiiRemovalLogDocument };
