import puppeteer from 'puppeteer';
import { bucket } from '../config/firebase.js';
import Document from '../models/Document.js';
import Clause from '../models/Clause.js';

export class ReportService {
  /**
   * Generates a PDF report for a document and uploads it to Firebase
   */
  static async generateReport(documentId: string): Promise<string> {
    try {
      console.log(`Generating report for document: ${documentId}`);

      // 1. Fetch data
      const document = await Document.findById(documentId);
      if (!document) throw new Error('Document not found');

      const clauses = await Clause.find({ documentId }).sort({ riskScore: -1 });

      // 2. Build HTML Template
      const htmlContent = this.getHtmlTemplate(document, clauses);

      // 3. Generate PDF using Puppeteer
      const pdfBuffer = await this.generatePdfFromHtml(htmlContent);

      // 4. Upload to Firebase
      const fileName = `reports/${documentId}_report.pdf`;
      const file = bucket.file(fileName);

      await file.save(pdfBuffer, {
        metadata: { contentType: 'application/pdf' },
        public: true, // Make it publicly accessible for download
      });

      const reportUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

      // 5. Update Database
      await Document.findByIdAndUpdate(documentId, { reportUrl });

      console.log(`Report generated and uploaded: ${reportUrl}`);
      return reportUrl;
    } catch (error: any) {
      console.error(`Report generation failed for ${documentId}:`, error.message);
      throw error;
    }
  }

  private static async generatePdfFromHtml(html: string): Promise<Buffer> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdf = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();
    return Buffer.from(pdf);
  }

  private static getHtmlTemplate(doc: any, clauses: any[]): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Helvetica', sans-serif; padding: 40px; color: #333; }
          .header { border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 30px; }
          .title { font-size: 28px; font-weight: bold; }
          .metadata { font-size: 14px; color: #666; margin-top: 5px; }
          .section { margin-bottom: 30px; }
          .section-title { font-size: 20px; font-weight: bold; margin-bottom: 10px; color: #000; }
          .summary { line-height: 1.6; }
          .risk-item { margin-bottom: 5px; color: #d32f2f; }
          .clause-card { border: 1px solid #ddd; padding: 15px; margin-bottom: 15px; page-break-inside: avoid; }
          .clause-header { display: flex; justify-content: space-between; margin-bottom: 10px; }
          .clause-type { font-weight: bold; background: #f0f0f0; padding: 2px 8px; border-radius: 4px; }
          .risk-score { font-weight: bold; color: #fff; padding: 2px 8px; border-radius: 4px; }
          .score-high { background: #d32f2f; }
          .score-mid { background: #f57c00; }
          .score-low { background: #388e3c; }
          .clause-text { font-style: italic; font-size: 13px; color: #555; margin-bottom: 10px; }
          .explanation { margin-bottom: 5px; }
          .suggestion { color: #1976d2; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">Legal Analysis Report</div>
          <div class="metadata">Document: ${doc.fileName} | Date: ${new Date().toLocaleDateString()}</div>
        </div>

        <div class="section">
          <div class="section-title">Executive Summary</div>
          <div class="summary">${doc.summary || 'No summary available.'}</div>
        </div>

        <div class="section">
          <div class="section-title">Key Risks</div>
          <ul>
            ${(doc.risks || []).map((risk: string) => `<li class="risk-item">${risk}</li>`).join('')}
          </ul>
        </div>

        <div class="section">
          <div class="section-title">Clause-by-Clause Analysis</div>
          ${clauses.map(clause => `
            <div class="clause-card">
              <div class="clause-header">
                <span class="clause-type">${clause.type}</span>
                <span class="risk-score ${clause.finalRiskScore >= 7 ? 'score-high' : clause.finalRiskScore >= 4 ? 'score-mid' : 'score-low'}">
                  Score: ${clause.finalRiskScore}
                </span>
              </div>
              <div class="clause-text">"${clause.text.substring(0, 500)}${clause.text.length > 500 ? '...' : ''}"</div>
              <div class="explanation"><strong>Analysis:</strong> ${clause.explanation}</div>
              <div class="suggestion"><strong>Recommendation:</strong> ${clause.suggestion}</div>
            </div>
          `).join('')}
        </div>
      </body>
      </html>
    `;
  }
}
