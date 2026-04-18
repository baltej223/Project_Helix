import { Pinecone } from '@pinecone-database/pinecone';
import { GoogleGenerativeAI } from '@google/generative-ai';
import config from '../config/index.js';
import Clause from '../models/Clause.js';
import { RiskScoringService } from './RiskScoringService.js';

const genAI = new GoogleGenerativeAI(config.geminiApiKey);
const pc = new Pinecone({ apiKey: config.pineconeApiKey });

export class VectorComparisonService {
  private static readonly EMBEDDING_MODEL = 'text-embedding-004';
  private static readonly SIMILARITY_THRESHOLD = 0.85;

  /**
   * Main entry point to compare a clause against standard clauses in Pinecone
   */
  static async compareClause(clauseId: string, text: string): Promise<void> {
    try {
      // 1. Generate embedding using Gemini
      const embedding = await this.generateEmbedding(text);

      // 2. Query Pinecone for the closest standard clause
      const index = pc.index(config.pineconeIndex);
      const queryResponse = await index.query({
        vector: embedding,
        topK: 1,
        includeMetadata: true,
      });

      if (queryResponse.matches.length > 0) {
        const bestMatch = queryResponse.matches[0];
        const similarityScore = bestMatch.score || 0;
        const standardClauseText = (bestMatch.metadata?.text as string) || 'Standard clause text not available';
        
        // 3. Determine deviation flag based on threshold
        const deviationFlag = similarityScore < this.SIMILARITY_THRESHOLD;

        // 4. Update the clause in MongoDB
        await Clause.findByIdAndUpdate(clauseId, {
          similarityScore,
          standardClauseText,
          deviationFlag,
        });

        // 5. Compute Final Risk Score
        await RiskScoringService.computeFinalRiskScore(clauseId);

        console.log(`Vector comparison complete for clause: ${clauseId}. Similarity: ${similarityScore}`);
      }
    } catch (error: any) {
      console.error(`Vector comparison failed for clause ${clauseId}:`, error.message);
      // We don't throw here to allow the pipeline to continue even if Pinecone fails
    }
  }

  private static async generateEmbedding(text: string): Promise<number[]> {
    try {
      const model = genAI.getGenerativeModel({ model: this.EMBEDDING_MODEL });
      const result = await model.embedContent(text);
      return result.embedding.values;
    } catch (error: any) {
      throw new Error(`Embedding generation failed: ${error.message}`);
    }
  }
}
