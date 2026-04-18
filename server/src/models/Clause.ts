import mongoose, { Schema, Document } from 'mongoose';

export interface IClause extends Document {
  documentId: mongoose.Types.ObjectId;
  text: string;
  type: string;
  riskScore: number;
  finalRiskScore?: number;
  explanation: string;
  impact: string;
  suggestion: string;
  similarityScore?: number;
  standardClauseText?: string;
  deviationFlag?: boolean;
  createdAt: Date;
}

const ClauseSchema: Schema = new Schema({
  documentId: { type: Schema.Types.ObjectId, ref: 'Document', required: true, index: true },
  text: { type: String, required: true },
  type: { type: String, required: true },
  riskScore: { type: Number, required: true, min: 1, max: 10 },
  finalRiskScore: { type: Number },
  explanation: { type: String, required: true },
  impact: { type: String, required: true },
  suggestion: { type: String, required: true },
  similarityScore: { type: Number },
  standardClauseText: { type: String },
  deviationFlag: { type: Boolean },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IClause>('Clause', ClauseSchema);
