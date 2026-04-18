import { NextFunction, Request, Response, Router } from 'express';
import multer from 'multer';
import config from '../config/index.js';
import { AppError } from '../middleware/errorHandler.js';
import { documentUploadMetadataSchema } from '../schemas/documentSchemas.js';
import { ingestDocument } from '../services/documentIngestionService.js';

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

      const result = await ingestDocument({
        file: req.file,
        metadata: metadataValidation.data,
        ownerId: req.userId,
      });

      return res.status(200).json({
        status: 'success',
        data: {
          extractedText: result.extractedText,
          metadata: result.internalDocument.ocr.metadata,
        },
      });
    } catch (error) {
      return next(error);
    }
  }
);

export default router;
