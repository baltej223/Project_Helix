import { OpenAI } from 'openai';
import config from '../config/index.js';
import { ClauseScores, ClauseType } from '../schemas/clauseAnalysisSchemas.js';

const client = new OpenAI({
  apiKey: config.geminiApiKey,
  baseURL: config.llmBaseUrl,
});

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

/**
 * Analyze a clause using Gemini API via OpenAI SDK
 */
export async function analyzeClauseWithGemini(
  clauseText: string,
  contractDomain: string,
  clauseIndex: number
): Promise<ClauseAnalysisResult> {
  try {
    // Truncate if too long
    const maxChars = 3000;
    const textToAnalyze = clauseText.substring(0, maxChars);

    const prompt = `You are a legal contract analyzer specializing in ${contractDomain} agreements.

Analyze the following clause and provide detailed scoring and analysis:

Clause #${clauseIndex}:
${textToAnalyze}

Provide JSON response with ONLY these fields (no other text):
{
  "clauseType": "(termination|indemnification|payment|intellectual_property|confidentiality|liability_limitation|warranty|governing_law|dispute_resolution|amendment|severability|entire_agreement|other)",
  "scores": {
    "clarity": number (0-100, 0=very clear, 100=very confusing),
    "deviation": number (0-100, 0=matches market standard, 100=highly divergent),
    "obligationAsymmetry": number (0-100, 0=balanced, 100=very one-sided),
    "financialExposure": number (0-100, 0=no exposure, 100=severe liability)
  },
  "plainLanguageRewrite": "string (simplify the clause in plain English, max 150 words)",
  "redFlags": ["string (risky element)", "string (risky element)"],
  "financialTerms": [
    {"amount": number, "currency": "string", "context": "string"}
  ],
  "confidence": number (0-1)
}

Scoring Guide:
- Clarity: Complex terminology reduces clarity. Jargon increases score.
- Deviation: Score higher if terms are unusual for ${contractDomain} contracts.
- Obligation Asymmetry: Score higher if one party has significantly more obligations.
- Financial Exposure: Score based on liability caps, indemnification scope, payment terms.
- Red Flags: Identify uncommon restrictions, unlimited liability, unilateral rights, vague terms.
- Financial Terms: Extract all monetary amounts mentioned.

Respond ONLY with valid JSON.`;

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
      throw new Error('Could not parse JSON from LLM response');
    }

    const result = JSON.parse(jsonMatch[0]);

    // Validate scores are in range
    result.scores.clarity = Math.max(0, Math.min(100, result.scores.clarity || 50));
    result.scores.deviation = Math.max(0, Math.min(100, result.scores.deviation || 50));
    result.scores.obligationAsymmetry = Math.max(0, Math.min(100, result.scores.obligationAsymmetry || 50));
    result.scores.financialExposure = Math.max(0, Math.min(100, result.scores.financialExposure || 50));

    console.log(
      `✓ Clause ${clauseIndex} analyzed: type=${result.clauseType}, risk=${result.scores.financialExposure}/100`
    );

    return result;
  } catch (error) {
    console.error(`Clause analysis error (${clauseIndex}):`, error);

    // Return safe fallback
    return {
      clauseType: 'other',
      scores: {
        clarity: 50,
        deviation: 50,
        obligationAsymmetry: 50,
        financialExposure: 50,
      },
      plainLanguageRewrite: clauseText.substring(0, 200),
      redFlags: ['Analysis failed, manual review recommended'],
      financialTerms: [],
      confidence: 0,
    };
  }
}

/**
 * Local fallback: Analyze clause using keyword-based heuristics
 */
export function analyzeClauseLocal(
  clauseText: string,
  clauseIndex: number
): ClauseAnalysisResult {
  const text = clauseText.toLowerCase();

  // Determine clause type
  let clauseType: ClauseType = 'other';
  const typeKeywords: Record<string, string[]> = {
    termination: ['terminate', 'termination', 'end', 'conclusion', 'expire', 'expiration'],
    indemnification: ['indemnif', 'indemnity', 'hold harmless', 'defend'],
    payment: ['payment', 'pay', 'fee', 'price', 'invoice', 'remuneration'],
    intellectual_property: ['patent', 'copyright', 'trademark', 'intellectual', 'ip', 'proprietary'],
    confidentiality: ['confidential', 'nda', 'non-disclosure', 'secret', 'proprietary'],
    liability_limitation: ['liability', 'limit', 'limitation', 'cap', 'exclude', 'excluded'],
    warranty: ['warranty', 'warrant', 'guarantee', 'representation'],
    governing_law: ['governing', 'law', 'jurisdiction', 'venue', 'arbitration'],
    dispute_resolution: ['dispute', 'arbitration', 'mediation', 'litigation'],
    amendment: ['amend', 'amendment', 'modify', 'modification', 'change'],
    severability: ['sever', 'severability', 'invalid', 'void'],
    entire_agreement: ['entire', 'agreement', 'supersede', 'supersedes'],
  };

  for (const [type, keywords] of Object.entries(typeKeywords)) {
    if (keywords.some((k) => text.includes(k))) {
      clauseType = type as ClauseType;
      break;
    }
  }

  // Calculate scores
  const clarity = text.includes('hereinafter')
    ? 80
    : text.includes('provided that')
      ? 70
      : text.includes('and/or')
        ? 60
        : 40;

  const obligationAsymmetry =
    text.match(/\b(company|employer|provider|licensor)\b/g)?.length || 0 >
    text.match(/\b(employee|tenant|licensee|client)\b/g)?.length || 0
      ? 65
      : 35;

  const financialExposure = text.includes('unlimited')
    ? 90
    : text.includes('cap') || text.includes('limit')
      ? 30
      : text.includes('indemnif')
        ? 75
        : 50;

  // Extract red flags
  const redFlags: string[] = [];
  if (text.includes('unlimited')) redFlags.push('Unlimited liability');
  if (text.includes('unilateral')) redFlags.push('Unilateral rights');
  if (text.includes('sole discretion')) redFlags.push('Sole discretion clause');
  if (text.includes('in perpetuity') || text.includes('perpetually'))
    redFlags.push('Perpetual obligations');
  if (text.match(/\b(and|or)\s+any\s+(other|future)/)) redFlags.push('Vague future obligations');

  // Extract financial terms
  const financialTerms: Array<{
    amount: number;
    currency: string;
    context: string;
  }> = [];
  const amountMatches = clauseText.match(/(?:USD|INR|GBP|EUR|$|₹|£|€)[\s]*[\d,]+(?:\.[\d]{2})?/g) || [];
  for (const match of amountMatches.slice(0, 3)) {
    financialTerms.push({
      amount: parseFloat(match.replace(/[^\d.]/g, '')),
      currency: match.includes('INR') || match.includes('₹') ? 'INR' : 'USD',
      context: 'Amount mentioned',
    });
  }

  return {
    clauseType,
    scores: {
      clarity,
      deviation: 50,
      obligationAsymmetry,
      financialExposure,
    },
    plainLanguageRewrite: clauseText.substring(0, 150),
    redFlags,
    financialTerms,
    confidence: 0.4,
  };
}
