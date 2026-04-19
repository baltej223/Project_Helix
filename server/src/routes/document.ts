import { NextFunction, Request, Response, Router } from 'express';
import multer from 'multer';
import config from '../config/index.js';
import { AppError } from '../middleware/errorHandler.js';
import { documentUploadMetadataSchema } from '../schemas/documentSchemas.js';
import { ingestDocument } from '../services/documentIngestionService.js';
import { getDocumentById, updateDocumentClassification } from '../services/documentService.js';
import { getPiiRemovalLog } from '../services/piiRemovalService.js';
import { classifyContractWithGemini } from '../services/classificationService.js';
import {
  createProcessingJob,
  enqueueAnalysisJob,
  storeClassificationResult,
} from '../services/jobQueueService.js';

const router = Router();

const supportedMimeTypes = new Set([
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: config.uploadMaxFileSizeBytes },
  fileFilter: (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (!supportedMimeTypes.has(file.mimetype)) {
      cb(new AppError('Invalid file type. Only PDF and DOCX are allowed.', 400));
      return;
    }

    cb(null, true);
  },
});

router.post(
  '/',
  upload.single('file'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        throw new AppError('Missing file. Use multipart/form-data with field "file".', 400);
      }

      if (req.file.size === 0) {
        throw new AppError('Uploaded file is empty.', 400);
      }

      const metadataValidation = documentUploadMetadataSchema.safeParse(req.body);
      if (!metadataValidation.success) {
        return res.status(400).json({
          status: 'error',
          statusCode: 400,
          message: 'Invalid upload metadata',
          errors: metadataValidation.error.errors,
        });
      }

      // For prototyping: use dummy ownerId if not authenticated
      const ownerId = (req as any).userId || 'user-' + Date.now();

      const result = await ingestDocument({
        file: req.file,
        metadata: metadataValidation.data,
        ownerId,
      });

      // Build PII summary for response
      const piiSummary =
        result.piiLogId && result.internalDocument
          ? {
              piiLogId: result.piiLogId,
              fieldCount: result.internalDocument.ocr.metadata.wordCount || 0,
              message:
                result.piiLogId && result.internalDocument.ocr.metadata.wordCount > 0
                  ? 'PII detected and redacted'
                  : 'No PII detected',
            }
          : null;

      return res.status(200).json({
        status: 'success',
        data: {
          documentId: result.documentId,
          extractedText: result.extractedText,
          cleanedText: result.cleanedText,
          metadata: result.internalDocument.ocr.metadata,
          pii: piiSummary,
        },
      });
    } catch (error) {
      return next(error);
    }
  }
);

/**
 * POST /documents/:documentId/classify
 * Classify a document and enqueue for analysis
 */
router.post('/:documentId/classify', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { documentId } = req.params;
    const ownerId = (req as any).userId || 'user-' + Date.now();

    // Get document
    const document = await getDocumentById(documentId);
    if (document.ownerId !== ownerId && ownerId !== (req as any).userId) {
      throw new AppError('Unauthorized', 403);
    }

    // Get PII removal log to get cleaned text
    const piiLog = await getPiiRemovalLog(documentId);
    if (!piiLog) {
      throw new AppError('Document not yet processed for PII removal', 400);
    }

    // Classify using Gemini
    const classification = await classifyContractWithGemini(piiLog.cleanedText);

    // Update document with classification
    await updateDocumentClassification(documentId, classification);

    // Create processing job
    const jobId = await createProcessingJob({
      documentId,
      ownerId,
      piiRemovalLogId: piiLog._id.toString(),
      stage: 'clause_analysis',
    });

    // Enqueue for analysis (if Gemini API key is available)
    let bulletJobID = null;
    if (config.geminiApiKey) {
      try {
        bulletJobID = await enqueueAnalysisJob({
          jobId,
          documentId,
          ownerId,
          cleanedText: piiLog.cleanedText,
          domain: classification.domain,
        });
        console.log(`✓ Job enqueued in Bull queue: ${bulletJobID}`);
      } catch (error) {
        console.warn('Failed to enqueue job, but classification stored:', error);
      }
    } else {
      console.log('GEMINI_API_KEY not set, job queued in MongoDB only');
    }

    // Store classification in job results
    await storeClassificationResult(jobId, classification);

    return res.status(200).json({
      status: 'success',
      data: {
        jobId,
        classification,
        message: 'Document classified and queued for analysis',
      },
    });
  } catch (error) {
    return next(error);
  }
});

export default router;
