import { Router, Response, NextFunction, Request } from 'express';
import multer from 'multer';
import { AuthenticatedRequest } from '../middleware/auth.js';
import config from '../config/index.js';
import { AppError } from '../middleware/errorHandler.js';
import { ingestDocument } from '../services/documentIngestionService.js';
import {
  documentUploadMetadataSchema,
  OcrExtractionResult,
} from '../schemas/documentSchemas.js';

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

/**
 * @route POST /documents
 * @desc Upload a document and extract raw text via OCR service
 * @access Private
 */
router.post(
  '/',
  upload.single('file'),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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
          success: false,
          message: 'Invalid upload metadata',
          errors: metadataValidation.error.errors,
        });
      }

      const { ocr } = await ingestDocument({
        file: req.file,
        metadata: metadataValidation.data,
        ownerId: req.userId,
      });

      return res.status(200).json({
        success: true,
        data: buildOcrResponse(ocr),
      });
    } catch (error) {
      console.error('Error processing document upload:', error);
      return next(error);
    }
  }
);

function buildOcrResponse(ocr: OcrExtractionResult) {
  return {
    extractedText: ocr.extractedText,
    metadata: ocr.metadata,
  };
}

export default router;
