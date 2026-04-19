import { OpenAI } from 'openai';
import config from '../config/index.js';

const client = new OpenAI({
  apiKey: config.geminiApiKey,
  baseURL: config.llmBaseUrl,
});

export interface ClassificationResult {
  domain: string; // rent, employment, loan, nda, etc.
  jurisdiction: string; // India, US, UK, etc.
  userParty: string; // landlord, tenant, employer, employee, etc.
  confidence: number; // 0-1
  reasoning: string;
}

/**
 * Classify a contract using Gemini API via OpenAI SDK with structured output
 */
export async function classifyContractWithGemini(cleanedText: string): Promise<ClassificationResult> {
  try {
    // Truncate text if too long (token limits)
    const maxChars = 10000;
    const textToAnalyze = cleanedText.substring(0, maxChars);

    const prompt = `You are a legal document classifier. Analyze the following contract text and classify it.

Contract text:
${textToAnalyze}

Provide a JSON response with:
- domain: (string) contract type (e.g., "rent", "employment", "loan", "nda", "services", "partnership", "other")
- jurisdiction: (string) governing jurisdiction (e.g., "india", "us", "uk", "other")
- userParty: (string) which party the user likely represents (e.g., "landlord", "tenant", "employer", "employee", "service_provider", "client", "other")
- confidence: (number) confidence level 0-1
- reasoning: (string) brief explanation of classification

Respond ONLY with valid JSON, no other text.`;

    const response = await client.chat.completions.create({
      model: config.llmModel,
      max_tokens: 1024,
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

    console.log(`✓ Contract classified: ${result.domain} (${(result.confidence * 100).toFixed(0)}% confidence)`);

    return {
      domain: result.domain || 'other',
      jurisdiction: result.jurisdiction || 'other',
      userParty: result.userParty || 'other',
      confidence: Number(result.confidence) || 0.5,
      reasoning: result.reasoning || 'Automated classification',
    };
  } catch (error) {
    console.error('Classification error:', error);

    // Return fallback classification
    return {
      domain: 'other',
      jurisdiction: 'other',
      userParty: 'other',
      confidence: 0,
      reasoning: 'Classification failed, manual review needed',
    };
  }
}

/**
 * Alternative: Classify contract using local heuristics (fallback if API unavailable)
 */
export function classifyContractLocal(cleanedText: string): ClassificationResult {
  const text = cleanedText.toLowerCase();

  // Simple keyword-based classification
  const domainKeywords: Record<string, string[]> = {
    rent: ['lease', 'tenant', 'landlord', 'rent', 'property', 'premises'],
    employment: ['employee', 'employer', 'salary', 'employment', 'job', 'position'],
    loan: ['loan', 'lender', 'borrower', 'interest', 'principal', 'repayment'],
    nda: ['confidential', 'nda', 'non-disclosure', 'proprietary', 'trade secret'],
    services: ['service', 'provider', 'client', 'contractor', 'professional'],
  };

  let bestDomain = 'other';
  let bestMatch = 0;

  for (const [domain, keywords] of Object.entries(domainKeywords)) {
    const matches = keywords.filter((k) => text.includes(k)).length;
    if (matches > bestMatch) {
      bestMatch = matches;
      bestDomain = domain;
    }
  }

  // Jurisdiction detection
  let jurisdiction = 'other';
  if (text.includes('india') || text.includes('indian')) jurisdiction = 'india';
  else if (text.includes('united states') || text.includes('usa')) jurisdiction = 'us';
  else if (text.includes('uk') || text.includes('united kingdom')) jurisdiction = 'uk';

  return {
    domain: bestDomain,
    jurisdiction,
    userParty: 'unknown',
    confidence: bestMatch > 3 ? 0.7 : 0.3,
    reasoning: 'Local keyword-based classification (fallback)',
  };
}
