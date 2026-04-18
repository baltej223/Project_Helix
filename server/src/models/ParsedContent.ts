import mongoose, { Schema, Document } from 'mongoose';

export interface IParsedContent extends Document {
  documentId: mongoose.Types.ObjectId;
  rawText: string;
  createdAt: Date;
}

const ParsedContentSchema: Schema = new Schema({
  documentId: { type: Schema.Types.ObjectId, ref: 'Document', required: true, unique: true },
  rawText: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IParsedContent>('ParsedContent', ParsedContentSchema);
