/**
 * Clause Segmentation Service
 *
 * Splits contract text into individual clauses using:
 * 1. Regex patterns for numbered/lettered sections
 * 2. Heuristics for common clause markers
 * 3. Sentence splitting with context
 */

export interface SegmentedClause {
  index: number;
  text: string;
  title?: string; // e.g., "Termination", "Indemnification"
  startPosition: number; // Character offset in original text
  endPosition: number;
}

/**
 * Regex patterns for clause detection
 */
const CLAUSE_PATTERNS = {
  // Numbered sections: "1.", "1)", "1 -"
  numbered: /^[\s]*([\d]+)[.):\-]\s+(.+?)(?=^[\s]*[\d]+[.):\-]|$)/gm,

  // Lettered sections: "a.", "a)", "(a)"
  lettered: /^[\s]*[a-z][.):\-]\s+(.+?)(?=^[\s]*[a-z][.):\-]|$)/gm,

  // Section headers: "Section 1", "Article 2", "Clause 3"
  sections: /^((?:Section|Article|Clause|Part)\s+[\d\w]+[.:]?)\s*(.+?)(?=^(?:Section|Article|Clause|Part)|$)/gim,

  // Common clause markers
  markers: /^((?:The\s+)?(?:Company|Employer|Landlord|Lessor|Licensor|Vendor|Provider|Buyer|Seller|Customer|Client|Employee|Tenant|Lessee|Licensee|Buyer|Seller|Services|Confidentiality|Payment|Term|Termination|Indemnification|Limitation|Warranty|Representation|Covenant|Obligation|Right|Benefit|Dispute|Governing|Jurisdiction|Severability|Amendment|Entire|Notice|Assignment|Force|Majeure)[^.]*[.:])\s*(.+?)(?=^(?:The|Company|Employer|Landlord|Lessor|Licensor|Vendor|Provider|Buyer|Seller|Customer|Client|Employee|Tenant|Lessee|Licensee|Services|Confidentiality|Payment|Term|Termination|Indemnification|Limitation|Warranty|Representation|Covenant|Obligation|Right|Benefit|Dispute|Governing|Jurisdiction|Severability|Amendment|Entire|Notice|Assignment|Force|Majeure)[^.]*[.:]|$)/gim,
};

/**
 * Clean and normalize clause text
 */
function cleanClauseText(text: string): string {
  return text
    .trim()
    .replace(/\s+/g, ' ') // Normalize whitespace
    .replace(/\xa0/g, ' '); // Remove non-breaking spaces
}

/**
 * Extract title from clause text (if present)
 */
function extractTitle(text: string): string | undefined {
  const titleMatch = text.match(/^([^.!?\n]+[.!?])/);
  if (titleMatch && titleMatch[1].length < 100) {
    return titleMatch[1].trim();
  }
  return undefined;
}

/**
 * Segment document into clauses using multi-pattern approach
 */
export function segmentClauses(text: string, minClauseLength = 50): SegmentedClause[] {
  const clauses: SegmentedClause[] = [];
  const clauseTexts = new Set<string>(); // Track to avoid duplicates

  // Try numbered sections first (most reliable)
  let matches = [...text.matchAll(CLAUSE_PATTERNS.numbered)];
  if (matches.length > 2) {
    // Use numbered if we find multiple matches
    let regex = /^[\s]*([\d]+)[.):\-]\s+(.+?)(?=^[\s]*[\d]+[.):\-]|$)/gm;
    let match;
    while ((match = regex.exec(text)) !== null) {
      const clauseText = cleanClauseText(match[0]);
      if (clauseText.length >= minClauseLength && !clauseTexts.has(clauseText)) {
        clauseTexts.add(clauseText);
        clauses.push({
          index: clauses.length,
          text: clauseText,
          title: extractTitle(clauseText),
          startPosition: match.index,
          endPosition: match.index + match[0].length,
        });
      }
    }
    if (clauses.length > 2) {
      return clauses; // Success with numbered sections
    }
  }

  // Try section headers
  clauses.length = 0;
  clauseTexts.clear();
  matches = [...text.matchAll(CLAUSE_PATTERNS.sections)];
  if (matches.length > 2) {
    let regex = /^((?:Section|Article|Clause|Part)\s+[\d\w]+[.:]?)\s*(.+?)(?=^(?:Section|Article|Clause|Part)|$)/gim;
    let match;
    while ((match = regex.exec(text)) !== null) {
      const clauseText = cleanClauseText(match[0]);
      if (clauseText.length >= minClauseLength && !clauseTexts.has(clauseText)) {
        clauseTexts.add(clauseText);
        clauses.push({
          index: clauses.length,
          text: clauseText,
          title: match[1]?.trim(),
          startPosition: match.index,
          endPosition: match.index + match[0].length,
        });
      }
    }
    if (clauses.length > 2) {
      return clauses;
    }
  }

  // Fallback: Split by sentence + context
  clauses.length = 0;
  clauseTexts.clear();

  // Split by double newlines or common clause endings
  const parts = text.split(/\n\n+|(?<=[.!?])\s+(?=[A-Z])/);

  for (let i = 0; i < parts.length; i++) {
    const clauseText = cleanClauseText(parts[i]);
    if (clauseText.length >= minClauseLength && !clauseTexts.has(clauseText)) {
      clauseTexts.add(clauseText);

      // Calculate position
      let startPos = 0;
      for (let j = 0; j < i; j++) {
        startPos += parts[j].length + 2; // +2 for \n\n
      }

      clauses.push({
        index: clauses.length,
        text: clauseText,
        title: extractTitle(clauseText),
        startPosition: startPos,
        endPosition: startPos + clauseText.length,
      });
    }
  }

  // Ensure we have at least some clauses
  if (clauses.length === 0) {
    const parts = text.split(/[.!?]+/).filter((p) => p.trim().length >= minClauseLength);
    for (let i = 0; i < Math.min(parts.length, 20); i++) {
      const clauseText = cleanClauseText(parts[i]);
      clauses.push({
        index: i,
        text: clauseText,
        title: extractTitle(clauseText),
        startPosition: 0,
        endPosition: clauseText.length,
      });
    }
  }

  return clauses;
}

/**
 * Get clause statistics
 */
export function getClauseStatistics(clauses: SegmentedClause[]): {
  totalClauses: number;
  avgClauseLength: number;
  totalCharacters: number;
} {
  const totalCharacters = clauses.reduce((sum, c) => sum + c.text.length, 0);
  return {
    totalClauses: clauses.length,
    avgClauseLength: totalCharacters / Math.max(clauses.length, 1),
    totalCharacters,
  };
}
