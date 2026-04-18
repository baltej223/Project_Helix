import axios from 'axios';
import * as pdfjs from 'pdfjs-dist';
import mammoth from 'mammoth';
import ParsedContent from '../models/ParsedContent.js';
import Document from '../models/Document.js';
import { AnalysisService } from './AnalysisService.js';

// ... (rest of imports and setup)

export class DocumentParsingService {
  /**
   * Main entry point to parse a document from a URL
   */
  static async parseDocument(documentId: string, fileUrl: string, fileName: string): Promise<string> {
    try {
      console.log(`Starting parsing for document: ${documentId} (${fileName})`);
      
      // 1. Fetch file from URL
      const response = await axios.get(fileUrl, { responseType: 'arraybuffer' });
      const buffer = Buffer.from(response.data);

      let extractedText = '';
      const extension = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));

      // 2. Detect type and parse
      if (extension === '.pdf') {
        extractedText = await this.parsePdf(buffer);
      } else if (extension === '.docx') {
        extractedText = await this.parseDocx(buffer);
      } else {
        throw new Error(`Unsupported file type: ${extension}`);
      }

      // 3. Handle edge cases
      if (!extractedText || extractedText.trim().length === 0) {
        throw new Error('Empty text extracted from document');
      }

      // Check for scanned PDF
      if (extension === '.pdf' && extractedText.trim().length < 50) {
        console.warn(`[WARNING] Document ${documentId} might be a scanned PDF.`);
      }

      // 4. Store in DB
      await ParsedContent.findOneAndUpdate(
        { documentId },
        { rawText: extractedText },
        { upsert: true, new: true }
      );

      // 5. Trigger AI Analysis
      // We keep the status as 'processing' during analysis
      await AnalysisService.analyzeDocument(documentId, extractedText);

      return extractedText;
    } catch (error: any) {
      console.error(`Parsing failed for document ${documentId}:`, error.message);
      
      // Update document status to failed
      await Document.findByIdAndUpdate(documentId, { status: 'failed' });
      
      throw error;
    }
  }

  private static async parsePdf(buffer: Buffer): Promise<string> {
    try {
      // Convert buffer to Uint8Array for pdfjs
      const data = new Uint8Array(buffer);
      const loadingTask = pdfjs.getDocument({ data });
      const pdf = await loadingTask.promise;
      
      let fullText = '';
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + '\n';
      }
      
      return fullText;
    } catch (error: any) {
      throw new Error(`PDF Parsing Error: ${error.message}`);
    }
  }

  private static async parseDocx(buffer: Buffer): Promise<string> {
    try {
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    } catch (error: any) {
      throw new Error(`DOCX Parsing Error: ${error.message}`);
    }
  }
}
