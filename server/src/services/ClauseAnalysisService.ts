import { GoogleGenerativeAI } from '@google/generative-ai';
import config from '../config/index.js';
import Clause from '../models/Clause.js';
import { VectorComparisonService } from './VectorComparisonService.js';

const genAI = new GoogleGenerativeAI(config.geminiApiKey);

interface ClauseAnalysisResult {
  text: string;
  type: string;
  riskScore: number;
  explanation: string;
  impact: string;
  suggestion: string;
}

export class ClauseAnalysisService {
  private static readonly MODEL_NAME = 'gemini-1.5-flash';
  private static readonly BATCH_SIZE = 5; // Analyze 5 clauses at a time

  /**
   * Splits text into potential clauses and analyzes them in batches
   */
  static async analyzeDocumentClauses(documentId: string, rawText: string): Promise<void> {
    try {
      console.log(`Starting clause-level analysis for document: ${documentId}`);

      // 1. Split text into potential clauses (by double newlines or significant breaks)
      const rawClauses = rawText
        .split(/\n\s*\n/)
        .map(c => c.trim())
        .filter(c => c.length > 20); // Filter out very short strings

      // 2. Batch process clauses
      for (let i = 0; i < rawClauses.length; i += this.BATCH_SIZE) {
        const batch = rawClauses.slice(i, i + this.BATCH_SIZE);
        await this.analyzeBatch(documentId, batch);
      }

      console.log(`Clause analysis completed for document: ${documentId}`);
    } catch (error: any) {
      console.error(`Clause analysis failed for ${documentId}:`, error.message);
      throw error;
    }
  }

  private static async analyzeBatch(documentId: string, clauses: string[]): Promise<void> {
    const model = genAI.getGenerativeModel({ 
      model: this.MODEL_NAME,
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
      You are a specialized legal assistant. Analyze the following list of document clauses.
      For each clause, provide:
      1. "type": The category of the clause (e.g., Indemnification, Termination, Confidentiality).
      2. "riskScore": A value from 1 to 10 (1 = Safe, 10 = High Risk).
      3. "explanation": A brief reason for the risk score.
      4. "impact": How this clause affects the signer.
      5. "suggestion": How to negotiate or improve this clause.

      Output Format (Strict JSON Array of Objects):
      [
        {
          "text": "original_clause_text",
          "type": "string",
          "riskScore": number,
          "explanation": "string",
          "impact": "string",
          "suggestion": "string"
        }
      ]

      Clauses to analyze:
      ${clauses.map((c, idx) => `[Clause ${idx + 1}]: ${c}`).join('\n\n')}
    `;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const results: ClauseAnalysisResult[] = JSON.parse(response.text());

      // 3. Store results in DB
      const clauseDocs = results.map(res => ({
        documentId,
        text: res.text,
        type: res.type,
        riskScore: res.riskScore,
        explanation: res.explanation,
        impact: res.impact,
        suggestion: res.suggestion,
      }));

      const createdClauses = await Clause.insertMany(clauseDocs);

      // 4. Trigger Vector Comparison for each created clause
      // We process these in parallel to save time
      await Promise.all(
        createdClauses.map(clause => 
          VectorComparisonService.compareClause(
            (clause._id as any).toString(),
            clause.text
          )
        )
      );
    } catch (error: any) {
      console.error('Error analyzing batch:', error.message);
      // We don't throw here to allow other batches to continue, 
      // but in production, you might want more robust error handling.
    }
  }
}
