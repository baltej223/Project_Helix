export interface ExtractionMetadata {
  filename: string;
  mimeType: string;
  fileSizeBytes: number;
  durationMs: number;
  wordCount: number;
  pageCount?: number;
}

export interface ExtractionResult {
  extractedText: string;
  metadata: ExtractionMetadata;
}
