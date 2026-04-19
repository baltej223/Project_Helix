import crypto from 'crypto';
import PiiRemovalLog from '../models/PiiRemovalLog.js';
import { RedactedField } from '../schemas/piiRemovalSchemas.js';

// Regex patterns for PII detection
const PII_PATTERNS = {
  aadhaar: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, // 12-digit Aadhaar
  pan: /\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b/g, // PAN format: ABCDE1234F
  phone: /\b[6-9]\d{9}\b/g, // 10-digit Indian phone
  email: /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/g,
  url: /\bhttps?:\/\/[^\s]+\b/g,
  credit_card: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, // 16-digit card
  bank_account: /\b\d{9,18}\b(?=.*account|account.*\b)/gi, // Context-aware
  ssn: /\b\d{3}-\d{2}-\d{4}\b/g, // US format for completeness
};

interface PiiMatch {
  fieldType: keyof typeof PII_PATTERNS;
  matches: string[];
  count: number;
}

export interface PiiRemovalInput {
  documentId: string;
  text: string;
  processingJobId?: string;
}

export interface PiiRemovalResult {
  cleanedText: string;
  redactedFields: RedactedField[];
  piiLogId: string;
}

/**
 * Detects PII in text using regex patterns
 */
function detectPii(text: string): PiiMatch[] {
  const matches: PiiMatch[] = [];

  for (const [fieldType, pattern] of Object.entries(PII_PATTERNS)) {
    const foundMatches = text.match(pattern) || [];
    if (foundMatches.length > 0) {
      // Anonymize examples: show pattern only, not actual values
      const examplePatterns = foundMatches.slice(0, 2).map((m) => {
        if (fieldType === 'aadhaar') return 'XXXX-XXXX-XXXX';
        if (fieldType === 'pan') return 'XXXXX0000A';
        if (fieldType === 'phone') return 'XXXXXX0000';
        if (fieldType === 'email') return 'user@example.com';
        if (fieldType === 'credit_card') return 'XXXX-XXXX-XXXX-XXXX';
        return m.substring(0, 4) + 'XXX';
      });

      matches.push({
        fieldType: fieldType as keyof typeof PII_PATTERNS,
        matches: foundMatches,
        count: foundMatches.length,
      });
    }
  }

  return matches;
}

/**
 * Redacts PII from text (replaces with [REDACTED_TYPE])
 */
function redactPii(text: string, detected: PiiMatch[]): string {
  let cleaned = text;

  for (const match of detected) {
    const pattern = PII_PATTERNS[match.fieldType];
    cleaned = cleaned.replace(pattern, `[REDACTED_${match.fieldType.toUpperCase()}]`);
  }

  return cleaned;
}

/**
 * Removes PII from document text and logs what was found
 */
export async function removePiiAndLog(input: PiiRemovalInput): Promise<PiiRemovalResult> {
  const detected = detectPii(input.text);
  
  // Clean text: redact if PII found, otherwise use original
  const cleanedText = detected.length > 0 ? redactPii(input.text, detected) : input.text;

  // Calculate hash of original text for audit trail
  const originalTextHash = crypto.createHash('sha256').update(input.text).digest('hex');

  // Convert detected matches to redacted fields format
  const redactedFields: RedactedField[] = detected.map((m) => ({
    fieldType: m.fieldType,
    count: m.count,
    examplePatterns: m.matches.slice(0, 2).map((match) => {
      // Mask sensitive data in examples
      if (m.fieldType === 'aadhaar') return 'XXXX-XXXX-XXXX';
      if (m.fieldType === 'pan') return 'XXXXX0000A';
      if (m.fieldType === 'phone') return 'XXXXXX0000';
      if (m.fieldType === 'email') return 'user@domain.com';
      return match.substring(0, 4) + 'XXX';
    }),
  }));

  // ALWAYS save PII removal log to MongoDB (even if no PII found)
  const log = new PiiRemovalLog({
    documentId: input.documentId,
    processingJobId: input.processingJobId,
    redactedFields,
    cleanedText,
    originalTextHash,
  });

  const saved = await log.save();
  if (detected.length === 0) {
    console.log(`✓ PII removal logged (no PII detected): ${saved._id}`);
  } else {
    console.log(`✓ PII removal logged: ${saved._id} (${redactedFields.length} field types redacted)`);
  }

  return {
    cleanedText,
    redactedFields,
    piiLogId: saved._id.toString(),
  };
}

/**
 * Retrieve PII removal log for a document
 */
export async function getPiiRemovalLog(documentId: string) {
  return PiiRemovalLog.findOne({ documentId }).sort({ removedAt: -1 });
}
