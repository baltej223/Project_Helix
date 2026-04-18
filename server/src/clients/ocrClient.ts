import axios from 'axios';
import FormData from 'form-data';
import config from '../config/index.js';
import { AppError } from '../middleware/errorHandler.js';
import {
  ocrExtractResponseSchema,
  OcrExtractionResult,
} from '../schemas/documentSchemas.js';

export async function extractTextWithOcr(
  file: Express.Multer.File
): Promise<OcrExtractionResult> {
  try {
    const formData = new FormData();
    formData.append('file', file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });

    const response = await axios.post(`${config.ocrBaseUrl}/extract`, formData, {
      headers: formData.getHeaders(),
      timeout: config.ocrRequestTimeoutMs,
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
      validateStatus: (status) => status >= 200 && status < 500,
    });

    if (response.status >= 400) {
      const message =
        typeof response.data?.message === 'string'
          ? response.data.message
          : 'OCR extraction failed';
      throw new AppError(message, response.status);
    }

    const parsed = ocrExtractResponseSchema.safeParse(response.data);
    if (!parsed.success) {
      throw new AppError('OCR service returned an invalid response', 502);
    }

    return parsed.data.data;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError('Failed to reach OCR service', 502);
  }
}
