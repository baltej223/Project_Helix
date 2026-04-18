import { Router, Response } from 'express';
import { z } from 'zod';
import { AuthenticatedRequest } from '../middleware/auth.js';
import Document, { DocumentStatus } from '../models/Document.js';
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
      status: DocumentStatus.PROCESSING, // Set to processing immediately
    });

    // 4. Trigger parsing in the background
    // We don't await this to return the response quickly
    DocumentParsingService.parseDocument(
      (document._id as any).toString(),
      fileUrl,
      fileName
    ).catch((err) => {
      console.error(`Background parsing failed for ${document._id}:`, err);
    });

    return res.status(201).json({
      success: true,
      message: 'Document received and parsing started',
      data: document,
    });
  } catch (error: any) {
    console.error('Error storing document:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while storing document reference',
    });
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
