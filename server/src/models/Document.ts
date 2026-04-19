import mongoose, { Schema, Document as MongooseDoc } from 'mongoose';
import { Document as DocumentType } from '../schemas/documentSchemas.js';

interface DocumentWithMongo extends Omit<DocumentType, '_id'> {
  _id?: mongoose.Types.ObjectId;
}

interface DocumentDocument extends DocumentWithMongo, MongooseDoc {}

const documentSchema = new Schema<DocumentDocument>(
  {
    ownerId: { type: String, required: true, index: true },
    uploadedAt: { type: Date, default: () => new Date() },
    originalFileName: { type: String, required: true },
    mimeType: {
      type: String,
      required: true,
      enum: [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ],
    },
    fileSizeBytes: { type: Number, required: true, min: 0 },
    pageCount: { type: Number, min: 0, default: null },
    extractedTextLength: { type: Number, min: 0 },
    status: {
      type: String,
      enum: ['uploaded', 'pii_removed', 'classified', 'analyzing', 'completed', 'failed'],
      default: 'uploaded',
      index: true,
    },
    classification: {
      domain: String,
      jurisdiction: String,
      userParty: String,
      confirmedByUser: { type: Boolean, default: false },
      classificationTimestamp: Date,
    },
    processingJobId: { type: Schema.Types.ObjectId, index: true },
    versionTracking: { type: Boolean, default: false },
    errorMessage: String,
  },
  {
    timestamps: true,
  }
);

// Create compound index for common query patterns
documentSchema.index({ ownerId: 1, status: 1 });
documentSchema.index({ ownerId: 1, uploadedAt: -1 });

const Document = mongoose.model<DocumentDocument>('Document', documentSchema);

export default Document;
export type { DocumentDocument };
