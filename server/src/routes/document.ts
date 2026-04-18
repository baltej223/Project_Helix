import { Router, Response } from 'express';
import { z } from 'zod';
import { AuthenticatedRequest } from '../middleware/auth.js';
import Document, { DocumentStatus } from '../models/Document.js';
import ParsedContent from '../models/ParsedContent.js';
import Clause from '../models/Clause.js';
import { DocumentParsingService } from '../services/DocumentParsingService.js';

const router = Router();

// Validation schema for document upload metadata
const uploadSchema = z.object({
  fileUrl: z.string().url(),
  fileName: z.string().min(1),
});

/**
 * @route POST /documents
 * @desc Receive file URL and metadata after Firebase upload
 * @access Private
 */
router.post('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    // 1. Validate request body
    const validation = uploadSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request body',
        errors: validation.error.errors,
      });
    }

    const { fileUrl, fileName } = validation.data;

    // 2. Validate file type (PDF/DOCX)
    const allowedExtensions = ['.pdf', '.docx'];
    const fileExtension = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
    
    if (!allowedExtensions.includes(fileExtension)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid file type. Only PDF and DOCX are allowed.',
      });
    }

    // 3. Store reference in MongoDB
    const document = await Document.create({
      userId: req.userId,
      fileUrl,
      fileName,
      status: DocumentStatus.UPLOADED,
    });

    // 4. Trigger parsing in the background
    // We don't await this to return the response immediately
    DocumentParsingService.parseDocument(
      (document._id as any).toString(),
      fileUrl,
      fileName
    ).catch((err) => {
      console.error(`Background processing failed for ${document._id}:`, err);
    });

    return res.status(201).json({
      success: true,
      message: 'Document queued for processing',
      data: {
        id: document._id,
        status: document.status,
      },
    });
  } catch (error: any) {
    console.error('Error queuing document:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while queuing document',
    });
  }
});

/**
 * @route GET /documents/:id
 * @desc Get full document data including analysis results
 * @access Private
 */
router.get('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const document = await Document.findById(req.params.id);
    
    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    if (document.userId !== req.userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    return res.json({
      success: true,
      data: document,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error fetching document' });
  }
});

/**
 * @route GET /documents/:id/status
 * @desc Check processing status, progress, and current step
 * @access Private
 */
router.get('/:id/status', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const document = await Document.findById(req.params.id);
    
    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    if (document.userId !== req.userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    return res.json({
      success: true,
      data: {
        id: document._id,
        status: document.status,
        progress: document.progress,
        currentStep: document.currentStep,
        error: document.error,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error fetching status' });
  }
});

/**
 * @route POST /documents/:id/retry
 * @desc Manually retry failed processing
 * @access Private
 */
router.post('/:id/retry', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const document = await Document.findById(req.params.id);
    
    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    if (document.userId !== req.userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    // Idempotency: Only allow retry if failed. 
    // If it's parsing or analyzing, don't allow a duplicate retry.
    const activeStatuses = [DocumentStatus.PARSING, DocumentStatus.ANALYZING];
    if (activeStatuses.includes(document.status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Document is currently being processed. Please wait.' 
      });
    }

    // 1. Clean up partial data from previous attempts
    await Promise.all([
      ParsedContent.deleteOne({ documentId: document._id }),
      Clause.deleteMany({ documentId: document._id }),
    ]);

    // 2. Reset status and start processing
    document.status = DocumentStatus.UPLOADED;
    document.progress = 0;
    document.currentStep = 'Retrying processing...';
    document.error = undefined;
    await document.save();

    // 3. Trigger processing in background
    DocumentParsingService.parseDocument(
      document._id.toString(),
      document.fileUrl,
      document.fileName
    ).catch(err => console.error(`Retry failed for ${document._id}:`, err));

    return res.json({
      success: true,
      message: 'Retry initiated. Previous partial data has been cleared.',
      data: { id: document._id, status: document.status },
    });
  } catch (error) {
    console.error('Retry error:', error);
    return res.status(500).json({ success: false, message: 'Error initiating retry' });
  }
});

/**
 * @route GET /documents
 * @desc Get all documents for the authenticated user
 * @access Private
 */
router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const documents = await Document.find({ userId: req.userId }).sort({ createdAt: -1 });
    return res.json({
      success: true,
      data: documents,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching documents',
    });
  }
});

export default router;
