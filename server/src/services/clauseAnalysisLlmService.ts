import { OpenAI } from 'openai';
import config from '../config/index.js';
import { ClauseScores, ClauseType } from '../schemas/clauseAnalysisSchemas.js';

const client = new OpenAI({
  apiKey: config.geminiApiKey,
  baseURL: config.llmBaseUrl,
});

// Valid clause types for validation
const VALID_CLAUSE_TYPES: ClauseType[] = [
  'termination',
  'indemnification',
  'payment',
  'intellectual_property',
  'confidentiality',
  'liability_limitation',
  'warranty',
  'governing_law',
  'dispute_resolution',
  'amendment',
  'severability',
  'entire_agreement',
];

/**
 * Validate if a clause type is valid (not 'other' and in allowed list)
 */
function isValidClauseType(type: any): type is ClauseType {
  return type && VALID_CLAUSE_TYPES.includes(type) && type !== 'other';
}

export interface ClauseAnalysisResult {
  clauseType: ClauseType;
  scores: ClauseScores;
  plainLanguageRewrite: string;
  redFlags: string[];
  financialTerms: Array<{
    amount: number;
    currency: string;
    context: string;
  }>;
  confidence: number;
}

// Keyword-based clause type detection
function detectClauseType(text: string): { type: ClauseType, confidence: number } {
  const textLower = text.toLowerCase();
  
  const typeKeywords: Record<ClauseType, string[]> = {
    termination: ['terminate', 'termination', 'cancel', 'cancellation', 'expires', 'expir', 'end of agreement'],
    indemnification: ['indemnif', 'hold harmless', 'defend', 'liabilit', 'damages'],
    payment: ['payment', 'pay', 'fee', 'cost', 'price', 'amount', 'invoice', 'remuneration'],
    intellectual_property: ['intellectual property', 'ip', 'patent', 'copyright', 'trademark', 'ownership', 'work product'],
    confidentiality: ['confidential', 'confidentiality', 'secrecy', 'non-disclosure', 'secret'],
    liability_limitation: ['limitation of liability', 'liable', 'cap', 'maximum', 'aggregate'],
    warranty: ['warrant', 'represent', 'guarantee', 'assure'],
    governing_law: ['governing law', 'jurisdiction', 'venue', 'applicable law', 'law of'],
    dispute_resolution: ['dispute', 'arbitration', 'mediation', 'settlement', 'resolution'],
    amendment: ['amend', 'modif', 'change', 'supplement', 'addendum'],
    severability: ['severab', 'invalid', 'unenforceable', 'separat'],
    entire_agreement: ['entire agreement', 'complete', 'supersede', 'integrat'],
    other: [],
  };

  let bestType: ClauseType = 'other';
  let bestScore = 0;

  for (const [type, keywords] of Object.entries(typeKeywords) as [ClauseType, string[]][]) {
    if (type === 'other') continue;
    const matches = keywords.filter(k => textLower.includes(k)).length;
    if (matches > bestScore) {
      bestScore = matches;
      bestType = type as ClauseType;
    }
  }

  return { type: bestType, confidence: bestScore >= 2 ? 0.8 : 0.4 };
}

// Local clause analysis when LLM fails
export function analyzeClauseLocal(clauseText: string, contractDomain: string, clauseIndex: number): ClauseAnalysisResult {
  const textLower = clauseText.toLowerCase();
  const { type, confidence } = detectClauseType(clauseText);
  
  // Score based on keywords
  let financialExposure = 30;
  let clarity = 40;
  let deviation = 30;
  let obligationAsymmetry = 30;
  
  const redFlags: string[] = [];
  
  // High risk keywords
  if (textLower.includes('unlimited') || textLower.includes('unlimited liability')) {
    financialExposure = Math.min(100, financialExposure + 30);
    redFlags.push('Unlimited liability');
  }
  if (textLower.includes('perpetual') || textLower.includes('forever')) {
    financialExposure = Math.min(100, financialExposure + 20);
    redFlags.push('Perpetual obligations');
  }
  if (textLower.includes('sole discretion') || textLower.includes('unilateral')) {
    obligationAsymmetry = Math.min(100, obligationAsymmetry + 25);
    redFlags.push('Unilateral rights');
  }
  if (textLower.includes('waive') || textLower.includes('waiver')) {
    deviation = Math.min(100, deviation + 20);
    redFlags.push('Waiver rights');
  }
  if (textLower.includes('indemnif') && !textLower.includes('hold harmless')) {
    financialExposure = Math.min(100, financialExposure + 15);
  }
  
  // Check for financial terms
  const financialTerms: Array<{ amount: number; currency: string; context: string }> = [];
  const amountMatches = clauseText.match(/\d+/g);
  if (amountMatches) {
    for (const amt of amountMatches.slice(0, 3)) {
      const num = parseInt(amt);
      if (num > 100) {
        financialTerms.push({
          amount: num,
          currency: textLower.includes('inr') || textLower.includes('₹') ? 'INR' : 'USD',
          context: 'Found in clause',
        });
      }
    }
  }

  // Generate plain language rewrite
  let plainRewrite = clauseText.substring(0, 150);
  if (clauseText.length > 150) {
    plainRewrite = clauseText.substring(0, 150) + '...';
  }

  return {
    clauseType: type,
    scores: { clarity, deviation, obligationAsymmetry, financialExposure },
    plainLanguageRewrite: plainRewrite,
    redFlags,
    financialTerms,
    confidence,
  };
}

/**
 * Analyze a clause using Gemini API via OpenAI SDK
 */
export async function analyzeClauseWithGemini(
  clauseText: string,
  contractDomain: string,
  clauseIndex: number
): Promise<ClauseAnalysisResult> {
  // First try local analysis
  const localResult = analyzeClauseLocal(clauseText, contractDomain, clauseIndex);
  
  // If no API key, use local
  if (!config.geminiApiKey) {
    console.log(`🔍 Clause ${clauseIndex}: using local analysis`);
    return localResult;
  }

  try {
    const maxChars = 2000;
    const textToAnalyze = clauseText.substring(0, maxChars);

    const prompt = `You are a legal contract analyzer. Analyze this clause and respond with VALID JSON only.

Clause: ${textToAnalyze}

RESPOND WITH THIS EXACT JSON STRUCTURE:
{
  "clauseType": "MUST BE ONE OF: termination, indemnification, payment, intellectual_property, confidentiality, liability_limitation, warranty, governing_law, dispute_resolution, amendment, severability, entire_agreement",
  "scores": {
    "clarity": number between 0-100,
    "deviation": number between 0-100,
    "obligationAsymmetry": number between 0-100,
    "financialExposure": number between 0-100
  },
  "plainLanguageRewrite": "brief summary in plain English",
  "redFlags": ["flag1", "flag2"],
  "financialTerms": [{"amount": number, "currency": "USD or INR", "context": "description"}],
  "confidence": number between 0 and 1
}

IMPORTANT RULES:
1. ALWAYS include clauseType - never omit it
2. NEVER use "other" as clauseType - use the closest matching type from the list
3. Return VALID JSON with NO trailing commas
4. All scores must be numbers (0-100)
5. Return ONLY the JSON object, no other text

Clause type examples:
- "payment" for rent, fees, pricing, invoices
- "termination" for ending, cancellation, expiration
- "indemnification" for liability, damages, hold harmless
- "intellectual_property" for patents, copyrights, ownership
- "confidentiality" for secrets, NDAs, non-disclosure
- "liability_limitation" for liability caps, exclusions
- "warranty" for guarantees, representations, assurances
- "governing_law" for jurisdiction, applicable law
- "dispute_resolution" for arbitration, mediation, litigation
- "amendment" for modifications, changes, addendums
- "severability" for invalid provisions, enforceability
- "entire_agreement" for superseding, integration clauses`;

    const response = await client.chat.completions.create({
      model: config.llmModel,
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const responseText = response.choices[0].message.content || '';

    // Parse JSON response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.log(`⚠️ Clause ${clauseIndex}: LLM failed to return JSON, using local analysis`);
      return localResult;
    }

    let result;
    try {
      result = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.log(`⚠️ Clause ${clauseIndex}: LLM returned invalid JSON: ${parseError.message}, using local`);
      return localResult;
    }

    // DEFENSIVE CHECK 1: Verify clauseType exists
    if (!result.clauseType) {
      console.log(`⚠️ Clause ${clauseIndex}: LLM response missing 'clauseType' field, using local analysis`);
      console.log(`   LLM response keys: ${Object.keys(result).join(', ')}`);
      return localResult;
    }

    // DEFENSIVE CHECK 2: Verify clauseType is valid (not 'other' and in allowed list)
    if (!isValidClauseType(result.clauseType)) {
      console.log(`⚠️ Clause ${clauseIndex}: LLM returned invalid clauseType '${result.clauseType}' (must be one of: ${VALID_CLAUSE_TYPES.join(', ')}), using local`);
      return localResult;
    }

    // DEFENSIVE CHECK 3: Verify scores object exists
    if (!result.scores || typeof result.scores !== 'object') {
      console.log(`⚠️ Clause ${clauseIndex}: LLM response missing or invalid 'scores' field, using local defaults`);
      result.scores = { ...localResult.scores };
    }

    // DEFENSIVE CHECK 4: Validate and normalize scores
    const scores = result.scores || {};
    result.scores = {
      clarity: typeof scores.clarity === 'number' ? Math.max(0, Math.min(100, scores.clarity)) : localResult.scores.clarity,
      deviation: typeof scores.deviation === 'number' ? Math.max(0, Math.min(100, scores.deviation)) : localResult.scores.deviation,
      obligationAsymmetry: typeof scores.obligationAsymmetry === 'number' ? Math.max(0, Math.min(100, scores.obligationAsymmetry)) : localResult.scores.obligationAsymmetry,
      financialExposure: typeof scores.financialExposure === 'number' ? Math.max(0, Math.min(100, scores.financialExposure)) : localResult.scores.financialExposure,
    };

    // DEFENSIVE CHECK 5: Validate other fields
    result.plainLanguageRewrite = typeof result.plainLanguageRewrite === 'string' ? result.plainLanguageRewrite.substring(0, 500) : localResult.plainLanguageRewrite;
    result.redFlags = Array.isArray(result.redFlags) ? result.redFlags.slice(0, 5) : localResult.redFlags;
    result.financialTerms = Array.isArray(result.financialTerms) ? result.financialTerms.slice(0, 5) : localResult.financialTerms;
    result.confidence = typeof result.confidence === 'number' ? Math.max(0, Math.min(1, result.confidence)) : 0.6;

    console.log(`✓ Clause ${clauseIndex}: ${result.clauseType} (confidence=${(result.confidence * 100).toFixed(0)}%, risk=${result.scores.financialExposure})`);

    return result;
  } catch (error) {
    console.error(`⚠️ Clause ${clauseIndex} LLM error:`, error.message);
    return localResult;
  }
}