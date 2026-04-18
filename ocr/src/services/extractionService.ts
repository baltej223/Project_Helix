import mammoth from 'mammoth';
import pdf from 'pdf-parse';
import { AppError } from '../middleware/errorHandler.js';
import { ExtractionResult } from '../types/extraction.js';

function countWords(text: string): number {
  if (!text.trim()) {
    return 0;
  }

  return text.trim().split(/\s+/).length;
}

function normalizeText(text: string): string {
  return text.replace(/\r\n/g, '\n').trim();
}

function estimatePdfPageCount(pdfText: string): number | undefined {
  const formFeedMatches = pdfText.match(/\f/g);

  if (!formFeedMatches || formFeedMatches.length === 0) {
    return undefined;
  }

  return formFeedMatches.length + 1;
}

export async function extractFromPdf(fileBuffer: Buffer): Promise<{ text: string; pageCount?: number }> {
  try {
    const parsed = await pdf(fileBuffer);
    const text = normalizeText(parsed.text || '');

    return {
      text,
      pageCount: parsed.numpages || estimatePdfPageCount(parsed.text || ''),
    };
  } catch {
    throw new AppError('Failed to extract text from PDF document', 422);
  }
}

export async function extractFromDocx(fileBuffer: Buffer): Promise<{ text: string }> {
  try {
    const result = await mammoth.extractRawText({ buffer: fileBuffer });
    const text = normalizeText(result.value || '');

    return { text };
  } catch {
    throw new AppError('Failed to extract text from DOCX document', 422);
  }
}

interface BuildExtractionResultInput {
  filename: string;
  mimeType: string;
  fileSizeBytes: number;
  startedAtMs: number;
  text: string;
  pageCount?: number;
}

function buildExtractionResult(input: BuildExtractionResultInput): ExtractionResult {
  return {
    extractedText: input.text,
    metadata: {
      filename: input.filename,
      mimeType: input.mimeType,
      fileSizeBytes: input.fileSizeBytes,
      durationMs: Date.now() - input.startedAtMs,
      wordCount: countWords(input.text),
      pageCount: input.pageCount,
    },
  };
}

export async function extractDocumentText(file: Express.Multer.File): Promise<ExtractionResult> {
  const startedAtMs = Date.now();
  const mimeType = file.mimetype;

  if (mimeType === 'application/pdf') {
    const { text, pageCount } = await extractFromPdf(file.buffer);

    return buildExtractionResult({
      filename: file.originalname,
      mimeType,
      fileSizeBytes: file.size,
      startedAtMs,
      text,
      pageCount,
    });
  }

  if (
    mimeType ===
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    const { text } = await extractFromDocx(file.buffer);

    return buildExtractionResult({
      filename: file.originalname,
      mimeType,
      fileSizeBytes: file.size,
      startedAtMs,
      text,
    });
  }

  throw new AppError('Unsupported file type. Only PDF and DOCX are allowed', 400);
}
