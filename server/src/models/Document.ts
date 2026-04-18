import mongoose, { Schema, Document } from 'mongoose';

export enum DocumentStatus {
  UPLOADED = 'uploaded',
  PARSING = 'parsing',
  ANALYZING = 'analyzing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export interface IDocument extends Document {
  userId: string;
  fileUrl: string;
  fileName: string;
  status: DocumentStatus;
  progress: number;
  currentStep?: string;
  error?: string;
  documentType?: string;
  summary?: string;
  risks?: string[];
  reportUrl?: string;
  createdAt: Date;
}

const DocumentSchema: Schema = new Schema({
  userId: { type: String, required: true, index: true },
  fileUrl: { type: String, required: true },
  fileName: { type: String, required: true },
  status: {
    type: String,
    enum: Object.values(DocumentStatus),
    default: DocumentStatus.UPLOADED,
  },
  progress: { type: Number, default: 0 },
  currentStep: { type: String },
  error: { type: String },
  documentType: { type: String },
  summary: { type: String },
  risks: [{ type: String }],
  reportUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IDocument>('Document', DocumentSchema);
