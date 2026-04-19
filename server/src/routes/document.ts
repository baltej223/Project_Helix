import { NextFunction, Request, Response, Router } from 'express';
import multer from 'multer';
import config from '../config/index.js';
import { AppError } from '../middleware/errorHandler.js';
import { documentUploadMetadataSchema } from '../schemas/documentSchemas.js';
import { ingestDocument } from '../services/documentIngestionService.js';
import { getDocumentById, updateDocumentClassification, setDocumentPdf, getDocumentPdf } from '../services/documentService.js';
import { getPiiRemovalLog } from '../services/piiRemovalService.js';
import { classifyContractWithGemini, getPartyOptionsByDomain, getAllDomains } from '../services/classificationService.js';
import {
  createProcessingJob,
  enqueueAnalysisJob,
  storeClassificationResult,
  updateJobStatus,
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
      console.log(`📤 Upload started: ${req.file.originalname} (${req.file.size} bytes) by ${ownerId}`);

      const result = await ingestDocument({
        file: req.file,
        metadata: metadataValidation.data,
        ownerId,
      });

      console.log(`✅ Upload success: documentId=${result.documentId}, textLength=${result.extractedText?.length || 0}`);

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
});

/**
 * POST /documents/:documentId/pdf
 * Store PDF in server memory
 */
router.post('/:documentId/pdf', upload.single('file'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { documentId } = req.params;
    const ownerId = (req as any).userId || 'user-' + Date.now();

    // Verify document ownership
    const document = await getDocumentById(documentId);
    if (document.ownerId !== ownerId) {
      throw new AppError('Unauthorized', 403);
    }

    if (!req.file) {
      throw new AppError('Missing PDF file', 400);
    }

    // Store PDF in memory
    const pdfBuffer = Buffer.from(req.file.buffer);
    setDocumentPdf(documentId, pdfBuffer);
    console.log(`📄 PDF stored: ${pdfBuffer.length} bytes for doc ${documentId}`);

    return res.status(200).json({
      status: 'success',
      data: { documentId, size: pdfBuffer.length },
    });
  } catch (error) {
    return next(error);
  }
});

/**
 * GET /documents/:documentId/pdf
 * Get PDF from server memory
 */
router.get('/:documentId/pdf', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { documentId } = req.params;
    const ownerId = (req as any).userId || 'user-' + Date.now();

    // Verify document ownership
    const document = await getDocumentById(documentId);
    if (document.ownerId !== ownerId) {
      throw new AppError('Unauthorized', 403);
    }

    // Get PDF from memory
    const pdfData = getDocumentPdf(documentId);
    if (!pdfData) {
      throw new AppError('PDF not found', 404);
    }

    console.log(`📄 Serving PDF: ${pdfData.length} bytes for doc ${documentId}`);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${document.originalFileName}"`);
    res.send(pdfData);
  } catch (error) {
    return next(error);
  }
});

/**
 * POST /documents/:documentId/classify
 * Classify a document (get domain detection + party options)
 * NOTE: Does NOT start clause analysis - user must confirm first
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
    console.log(`🔍 Classifying document ${documentId}...`);
    const classification = await classifyContractWithGemini(piiLog.cleanedText);
    console.log(`✅ Classification: domain=${classification.domain}, party=${classification.userParty}, confidence=${classification.confidence}`);

    // Update document with classification
    await updateDocumentClassification(documentId, classification);

    // Create processing job in "pending" state (NOT enqueued yet)
    const jobId = await createProcessingJob({
      documentId,
      ownerId,
      piiRemovalLogId: piiLog._id.toString(),
      stage: 'clause_analysis',
    });

    // Store classification in job results but don't start analysis yet
    await storeClassificationResult(jobId, classification);

    // Get party options based on detected domain
    const partyOptions = getPartyOptionsByDomain(classification.domain);
    const availableDomains = getAllDomains();

    return res.status(200).json({
      status: 'success',
      data: {
        documentId,
        jobId,
        classification,
        partyOptions,
        availableDomains,
        message: 'Domain detected. User confirmation required to start analysis.',
      },
    });
  } catch (error) {
    return next(error);
  }
});

/**
 * POST /documents/:documentId/confirm
 * Confirm domain + user party, then start clause analysis
 */
router.post('/:documentId/confirm', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { documentId } = req.params;
    const { domain, userParty } = req.body;
    const ownerId = (req as any).userId || 'user-' + Date.now();

    if (!domain || !userParty) {
      throw new AppError('domain and userParty are required', 400);
    }

    console.log(`📋 Confirm received: docId=${documentId}, domain=${domain}, userParty=${userParty}`);

    // Get document
    const document = await getDocumentById(documentId);
    if (document.ownerId !== ownerId && ownerId !== (req as any).userId) {
      throw new AppError('Unauthorized', 403);
    }

    // Get PII removal log
    const piiLog = await getPiiRemovalLog(documentId);
    if (!piiLog) {
      throw new AppError('Document not yet processed', 400);
    }

    // Find the job for this document
    const { getProcessingJobByDocumentId } = await import('../services/jobQueueService.js');
    const job = await getProcessingJobByDocumentId(documentId, ownerId);
    if (!job) {
      throw new AppError('No processing job found. Classify document first.', 400);
    }

    // Update classification with user's choices
    const updatedClassification = {
      domain,
      userParty,
      jurisdiction: document.classification?.jurisdiction || 'other',
      confidence: 1, // User confirmed, so 100%
      reasoning: 'User confirmed domain and party selection',
    };

    // Update document with confirmed classification
    await updateDocumentClassification(documentId, updatedClassification);

    // Store classification in job
    await storeClassificationResult(job._id.toString(), updatedClassification);

    // Update job status to processing
    await updateJobStatus(job._id.toString(), 'processing');

    // Enqueue for clause analysis
    let bulletJobID = null;
    if (config.geminiApiKey) {
      try {
        bulletJobID = await enqueueAnalysisJob({
          jobId: job._id.toString(),
          documentId,
          ownerId,
          cleanedText: piiLog.cleanedText,
          domain,
        });
        console.log(`✓ Job enqueued in Bull queue: ${bulletJobID}`);
      } catch (error) {
        console.error('Failed to enqueue analysis job:', error);
        throw new AppError('Failed to start analysis', 500);
      }
    } else {
      throw new AppError('GEMINI_API_KEY not configured', 500);
    }

    return res.status(200).json({
      status: 'success',
      data: {
        jobId: job._id.toString(),
        documentId,
        message: 'Analysis started. Poll /processing-jobs/:jobId for status.',
      },
    });
  } catch (error) {
    return next(error);
  }
});

export default router;
