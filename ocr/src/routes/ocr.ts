import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import config from '../config/index.js';
import { AppError } from '../middleware/errorHandler.js';
import { extractDocumentText } from '../services/extractionService.js';

const router = Router();

const supportedMimeTypes = new Set([
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: config.maxFileSizeBytes },
  fileFilter: (_req, file, cb) => {
    if (!supportedMimeTypes.has(file.mimetype)) {
      cb(new AppError('Unsupported file type. Only PDF and DOCX are allowed', 400));
      return;
    }

    cb(null, true);
  },
});

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(
        new AppError(
          `Extraction timeout after ${timeoutMs}ms. Try a smaller document`,
          408
        )
      );
    }, timeoutMs);

    promise
      .then((result) => {
        clearTimeout(timeoutId);
        resolve(result);
      })
      .catch((error: unknown) => {
        clearTimeout(timeoutId);
        reject(error);
      });
  });
}

router.post(
  '/extract',
  upload.single('file'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        throw new AppError('Missing file. Send multipart/form-data with field "file"', 400);
      }

      if (req.file.size === 0) {
        throw new AppError('Uploaded file is empty', 400);
      }

      const result = await withTimeout(
        extractDocumentText(req.file),
        config.requestTimeoutMs
      );

      if (!result.extractedText) {
        throw new AppError('No text could be extracted from the document', 422);
      }

      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
