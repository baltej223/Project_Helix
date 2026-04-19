import { NextFunction, Request, Response, Router } from 'express';
import { getProcessingJobById, getJobsByDocumentId } from '../services/jobQueueService.js';
import { getDocumentsByOwner } from '../services/documentService.js';
import { getClausesByJobId, getDocumentClauseSummary, getClauseSummaries } from '../services/clauseDataService.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

/**
 * GET /processing-jobs/:jobId
 * Get job status and progress
 */
router.get('/:jobId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { jobId } = req.params;
    const ownerId = (req as any).userId || 'user-' + Date.now();

    // Get job
    const job = await getProcessingJobById(jobId);

    // Verify ownership
    if (job.ownerId !== ownerId && ownerId !== (req as any).userId) {
      throw new AppError('Unauthorized', 403);
    }

    return res.status(200).json({
      status: 'success',
      data: {
        jobId: job._id,
        documentId: job.documentId,
        status: job.status,
        currentStage: job.currentStage,
        progress: job.progress,
        results: job.results,
        createdAt: job.createdAt,
        startedAt: job.startedAt,
        completedAt: job.completedAt,
        errorLog: job.errorLog,
      },
    });
  } catch (error) {
    return next(error);
  }
});

/**
 * GET /processing-jobs/:jobId/clauses
 * Get all clauses analyzed in this job
 */
router.get('/:jobId/clauses', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { jobId } = req.params;
    const ownerId = (req as any).userId || 'user-' + Date.now();

    // Verify job ownership
    const job = await getProcessingJobById(jobId);
    if (job.ownerId !== ownerId && ownerId !== (req as any).userId) {
      throw new AppError('Unauthorized', 403);
    }

    // Get clauses
    const clauses = await getClausesByJobId(jobId);

    return res.status(200).json({
      status: 'success',
      data: {
        jobId,
        totalClauses: clauses.length,
        clauses: clauses.map((c) => ({
          index: c.clauseIndex,
          type: c.classification.clauseType,
          scores: c.scores,
          redFlagsCount: c.redFlags.length,
          financialTermsCount: c.financialTerms.length,
        })),
      },
    });
  } catch (error) {
    return next(error);
  }
});

/**
 * GET /processing-jobs/:jobId/clauses/:clauseIndex
 * Get full details of a specific clause
 */
router.get(
  '/:jobId/clauses/:clauseIndex',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { jobId, clauseIndex } = req.params;
      const ownerId = (req as any).userId || 'user-' + Date.now();

      // Verify job ownership
      const job = await getProcessingJobById(jobId);
      if (job.ownerId !== ownerId && ownerId !== (req as any).userId) {
        throw new AppError('Unauthorized', 403);
      }

      // Get clause
      const clauses = await getClausesByJobId(jobId);
      const clause = clauses.find((c) => c.clauseIndex === parseInt(clauseIndex, 10));

      if (!clause) {
        throw new AppError('Clause not found', 404);
      }

      return res.status(200).json({
        status: 'success',
        data: {
          clauseIndex: clause.clauseIndex,
          type: clause.classification.clauseType,
          title: clause.clauseText.substring(0, 100),
          scores: clause.scores,
          plainLanguageRewrite: clause.plainLanguageRewrite,
          redFlags: clause.redFlags,
          financialTerms: clause.financialTerms,
          analyzedAt: clause.analyzedAt,
        },
      });
    } catch (error) {
      return next(error);
    }
  }
);

/**
 * GET /processing-jobs/:jobId/summary
 * Get analysis summary for all clauses in a job
 */
router.get(
  '/:jobId/summary',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { jobId } = req.params;
      const ownerId = (req as any).userId || 'user-' + Date.now();

      // Verify job ownership
      const job = await getProcessingJobById(jobId);
      if (job.ownerId !== ownerId && ownerId !== (req as any).userId) {
        throw new AppError('Unauthorized', 403);
      }

      // Get summaries
      const summaries = await getClauseSummaries(job.documentId);
      const documentSummary = await getDocumentClauseSummary(job.documentId);

      return res.status(200).json({
        status: 'success',
        data: {
          jobId,
          documentId: job.documentId,
          status: job.status,
          progress: job.progress,
          classification: job.results.classificationResult,
          statistics: documentSummary,
          clauseSummaries: summaries,
        },
      });
    } catch (error) {
      return next(error);
    }
  }
);

/**
 * GET /processing-jobs?documentId={id}
 * Get all jobs for a document
 */
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { documentId } = req.query;
      const ownerId = (req as any).userId || 'user-' + Date.now();

      if (!documentId) {
        throw new AppError('documentId query parameter required', 400);
      }

      // Verify document ownership
      const document = await getDocumentsByOwner(ownerId);
      const owned = document.find((d) => d._id?.toString() === documentId);
      if (!owned && ownerId !== (req as any).userId) {
        throw new AppError('Unauthorized', 403);
      }

      // Get jobs
      const jobs = await getJobsByDocumentId(documentId as string);

      return res.status(200).json({
        status: 'success',
        data: {
          documentId,
          jobs: jobs.map((j) => ({
            jobId: j._id,
            status: j.status,
            currentStage: j.currentStage,
            progress: j.progress,
            createdAt: j.createdAt,
            completedAt: j.completedAt,
          })),
        },
      });
    } catch (error) {
      return next(error);
    }
  }
);

export default router;
