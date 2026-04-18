import mongoose, { Schema, Document } from 'mongoose';

export enum DocumentStatus {
  UPLOADED = 'uploaded',
  PROCESSING = 'processing',
  DONE = 'done',
  FAILED = 'failed',
}

export interface IDocument extends Document {
  userId: string;
  fileUrl: string;
  fileName: string;
  status: DocumentStatus;
  documentType?: string;
  summary?: string;
  risks?: string[];
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
  documentType: { type: String },
  summary: { type: String },
  risks: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IDocument>('Document', DocumentSchema);
