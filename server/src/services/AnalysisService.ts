import { GoogleGenerativeAI } from '@google/generative-ai';
import config from '../config/index.js';
import Document from '../models/Document.js';
import { ClauseAnalysisService } from './ClauseAnalysisService.js';

const genAI = new GoogleGenerativeAI(config.geminiApiKey);

interface AnalysisResult {
  documentType: string;
  summary: string;
  risks: string[];
}

export class AnalysisService {
  private static readonly MODEL_NAME = 'gemini-1.5-flash';

  /**
   * Main entry point to analyze document text using Gemini
   */
  static async analyzeDocument(documentId: string, rawText: string): Promise<AnalysisResult> {
    try {
      console.log(`Starting AI analysis for document: ${documentId}`);

      // 1. Prepare text (truncate if extremely long)
      const preparedText = rawText.slice(0, 100000); 

      // 2. Call Gemini with retry logic
      const analysisJson = await this.callGeminiWithRetry(preparedText);

      // 3. Store high-level result in DB
      await Document.findByIdAndUpdate(documentId, {
        documentType: analysisJson.documentType,
        summary: analysisJson.summary,
        risks: analysisJson.risks,
      });

      // 4. Trigger granular clause analysis
      // This is done sequentially here, but could be backgrounded
      await ClauseAnalysisService.analyzeDocumentClauses(documentId, rawText);

      // 5. Finalize status
      await Document.findByIdAndUpdate(documentId, { status: 'done' });

      console.log(`Analysis completed for document: ${documentId}`);
      return analysisJson;
    } catch (error: any) {
      console.error(`AI Analysis failed for document ${documentId}:`, error.message);
      
      await Document.findByIdAndUpdate(documentId, { status: 'failed' });
      throw error;
    }
  }

  private static async callGeminiWithRetry(text: string, retries = 3): Promise<AnalysisResult> {
    const model = genAI.getGenerativeModel({ 
      model: this.MODEL_NAME,
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
      You are an expert legal document analyzer. 
      Analyze the following document text and provide a structured JSON response.
      
      Requirements:
      1. Detect the "documentType" (e.g., Employment Agreement, NDA, Terms of Service, etc.).
      2. Provide a concise "summary" of the document.
      3. Identify a list of "risks" or red flags found in the document text.
      
      Output Format (Strict JSON):
      {
        "documentType": "string",
        "summary": "string",
        "risks": ["string", "string"]
      }

      Document Text:
      ${text}
    `;

    for (let i = 0; i < retries; i++) {
      try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const jsonText = response.text();
        
        const parsed = JSON.parse(jsonText);
        
        if (!parsed.documentType || !parsed.summary || !Array.isArray(parsed.risks)) {
          throw new Error('Incomplete analysis data received from AI');
        }

        return parsed as AnalysisResult;
      } catch (error: any) {
        if (i === retries - 1) throw error;
        const delay = Math.pow(2, i) * 1000;
        console.warn(`Gemini API attempt ${i + 1} failed. Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw new Error('Failed to get analysis from Gemini after multiple retries');
  }
}
