import Clause from '../models/Clause.js';

export class RiskScoringService {
  /**
   * Weights for the final risk calculation
   */
  private static readonly WEIGHTS = {
    LLM_ASSESSMENT: 0.4,
    SIMILARITY_DEVIATION: 0.3,
    CLAUSE_TYPE_CRITICALITY: 0.3,
  };

  /**
   * Pre-defined risk levels for different clause types (1-10)
   */
  private static readonly CLAUSE_TYPE_RISK_MAP: Record<string, number> = {
    'Indemnification': 9,
    'Limitation of Liability': 10,
    'Non-Compete': 8,
    'Termination': 7,
    'Confidentiality': 5,
    'Intellectual Property': 8,
    'Governing Law': 4,
    'Force Majeure': 3,
    'Payment Terms': 6,
    'Assignment': 5,
  };

  /**
   * Computes the final risk score for a clause and updates the DB
   */
  static async computeFinalRiskScore(clauseId: string): Promise<number> {
    try {
      const clause = await Clause.findById(clauseId);
      if (!clause) throw new Error('Clause not found');

      const llmScore = clause.riskScore; // 1-10
      const similarityScore = clause.similarityScore || 0; // 0-1
      const clauseType = clause.type;

      // 1. Compute Similarity Penalty (Low similarity = High Penalty)
      // If similarity is 1.0, penalty is 0. If similarity is 0.5, penalty is 5.
      const similarityPenalty = (1 - similarityScore) * 10;

      // 2. Compute Type Penalty based on the importance of the clause type
      const typePenalty = this.CLAUSE_TYPE_RISK_MAP[clauseType] || 5; // Default to mid-range

      // 3. Apply Weighting Logic
      const finalScore = 
        (llmScore * this.WEIGHTS.LLM_ASSESSMENT) +
        (similarityPenalty * this.WEIGHTS.SIMILARITY_DEVIATION) +
        (typePenalty * this.WEIGHTS.CLAUSE_TYPE_CRITICALITY);

      // Normalize to 1 decimal place
      const roundedScore = Math.round(finalScore * 10) / 10;

      // 4. Update Database
      await Clause.findByIdAndUpdate(clauseId, { finalRiskScore: roundedScore });

      console.log(`Final risk score for clause ${clauseId} computed: ${roundedScore}`);
      return roundedScore;
    } catch (error: any) {
      console.error(`Risk scoring failed for clause ${clauseId}:`, error.message);
      return 0;
    }
  }
}
