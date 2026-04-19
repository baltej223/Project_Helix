import { OpenAI } from 'openai';
import config from '../config/index.js';

const client = new OpenAI({
  apiKey: config.geminiApiKey,
  baseURL: config.llmBaseUrl,
});

export interface ClassificationResult {
  domain: string;
  jurisdiction: string;
  userParty: string;
  confidence: number;
  reasoning: string;
}

export const partyOptionsByDomain: Record<string, string[]> = {
  rent: ['Landlord / Lessor', 'Tenant / Lessee'],
  employment: ['Employer', 'Employee', 'Contractor'],
  loan: ['Lender', 'Borrower', 'Guarantor'],
  nda: ['Disclosing Party', 'Receiving Party'],
  services: ['Service Provider', 'Client'],
  partnership: ['General Partner', 'Limited Partner'],
  other: ['First Party', 'Second Party'],
};

export function getPartyOptionsByDomain(domain: string): string[] {
  return partyOptionsByDomain[domain.toLowerCase()] || partyOptionsByDomain.other;
}

export function getAllDomains(): string[] {
  return Object.keys(partyOptionsByDomain);
}

function classifyContractLocal(cleanedText: string): ClassificationResult {
  const text = cleanedText.toLowerCase();
  
  const domainKeywords: Record<string, { keywords: string[], party: string }> = {
    rent: { keywords: ['lease', 'tenant', 'landlord', 'rental', 'property', 'premises', 'leasehold', 'rent'], party: 'tenant' },
    employment: { keywords: ['employee', 'employer', 'salary', 'employment', 'job', 'position', 'wages', 'termination'], party: 'employee' },
    loan: { keywords: ['loan', 'lender', 'borrower', 'interest', 'principal', 'repayment', 'emi', 'credit'], party: 'borrower' },
    nda: { keywords: ['confidential', 'nda', 'non-disclosure', 'proprietary', 'trade secret', 'confidentiality'], party: 'receiving party' },
    services: { keywords: ['service provider', 'client', 'contractor', 'consultant', 'professional services', 'scope of work'], party: 'service provider' },
    partnership: { keywords: ['partnership', 'partner', 'joint venture', 'co-founder', 'equity', 'profit sharing'], party: 'partner' },
  };

  let bestDomain = 'other';
  let bestScore = 0;
  let bestParty = 'other';

  for (const [domain, data] of Object.entries(domainKeywords)) {
    const matches = data.keywords.filter(k => text.includes(k)).length;
    if (matches > bestScore) {
      bestScore = matches;
      bestDomain = domain;
      bestParty = data.party;
    }
  }

  let jurisdiction = 'other';
  if (text.includes('india') || text.includes('indian') || text.includes('rupee') || text.includes('inr')) {
    jurisdiction = 'india';
  } else if (text.includes('united states') || text.includes('usa') || text.includes('dollar')) {
    jurisdiction = 'us';
  } else if (text.includes('united kingdom') || text.includes('uk') || text.includes('pound')) {
    jurisdiction = 'uk';
  }

  const confidence = bestScore >= 2 ? Math.min(0.9, bestScore / 5) : 0.3;
  
  return {
    domain: bestDomain,
    jurisdiction,
    userParty: bestParty,
    confidence,
    reasoning: `Keyword-based: found ${bestScore} keywords for ${bestDomain}`,
  };
}

export async function classifyContractWithGemini(cleanedText: string): Promise<ClassificationResult> {
  const localResult = classifyContractLocal(cleanedText);
  
  if (!config.geminiApiKey) {
    console.log('🔍 Using local classification (no API key)');
    return localResult;
  }

  try {
    const maxChars = 8000;
    const textToAnalyze = cleanedText.substring(0, maxChars);

    const prompt = `You are a legal document classifier. Analyze this contract and respond with JSON only.

Contract: ${textToAnalyze}

Respond with: {"domain":"rent|employment|loan|nda|services|partnership|other","jurisdiction":"india|us|uk|other","userParty":"...","confidence":0-1,"reasoning":"..."}`;

    const response = await client.chat.completions.create({
      model: config.llmModel,
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });

    const responseText = response.choices[0].message.content || '';
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      console.warn('⚠️ Could not parse LLM JSON');
      return localResult;
    }

    const result = JSON.parse(jsonMatch[0]);
    
    if (!result.domain || result.domain === 'other') {
      return localResult;
    }

    console.log(`✓ Contract classified: ${result.domain}`);

    return {
      domain: result.domain?.toLowerCase() || localResult.domain,
      jurisdiction: result.jurisdiction?.toLowerCase() || localResult.jurisdiction,
      userParty: result.userParty?.toLowerCase() || localResult.userParty,
      confidence: Number(result.confidence) || localResult.confidence,
      reasoning: result.reasoning || localResult.reasoning,
    };
  } catch (error) {
    console.error('⚠️ Classification error:', error.message);
    return localResult;
  }
}