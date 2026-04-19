import Queue from 'bull';
import { getRedisClient } from '../clients/redisClient.js';
import { getDocumentById } from '../services/documentService.js';
import { getPiiRemovalLog } from '../services/piiRemovalService.js';
import { segmentClauses } from '../services/clauseSegmentationService.js';
import { analyzeClauseWithGemini, analyzeClauseLocal } from '../services/clauseAnalysisLlmService.js';
import { saveClauseAnalysis } from '../services/clauseDataService.js';
import { updateJobStatus, updateJobProgress, getProcessingJobById } from '../services/jobQueueService.js';
import config from '../config/index.js';

export interface AnalysisJobData {
  jobId: string;
  documentId: string;
  ownerId: string;
  cleanedText: string;
  domain?: string;
}

let analysisQueue: Queue.Queue<AnalysisJobData> | null = null;

/**
 * Register the background processor
 * This processes jobs from the Bull queue
 */
export async function registerJobProcessor() {
  if (!analysisQueue) {
    throw new Error('Job queue not initialized. Call initializeJobQueue first');
  }

  // Process 1 job at a time with concurrency=1
  analysisQueue.process(1, async (job) => {
    const { jobId, documentId, ownerId, cleanedText, domain } = job.data;

    console.log(`\n▶ Processing job ${jobId} for document ${documentId}`);

    try {
      // Update job status
      await updateJobStatus(jobId, 'processing');

      // Get document
      const document = await getDocumentById(documentId);

      // Segment clauses
      console.log(`▶ Segmenting clauses...`);
      const clauses = segmentClauses(cleanedText, 50);
      console.log(`✓ Found ${clauses.length} clauses`);

      if (clauses.length === 0) {
        throw new Error('No clauses found in document');
      }

      // Update job progress
      await updateJobProgress(jobId, 0, clauses.length);

      // Analyze each clause
      const clauseIds: string[] = [];

      for (let i = 0; i < clauses.length; i++) {
        const clause = clauses[i];
        console.log(`▶ Analyzing clause ${i + 1}/${clauses.length}: ${clause.title || 'untitled'}`);

        try {
          // Analyze using LLM (Gemini if available, fallback to local)
          let analysisResult;
          if (config.geminiApiKey) {
            analysisResult = await analyzeClauseWithGemini(
              clause.text,
              domain || document.classification?.domain || 'general',
              i
            );
          } else {
            analysisResult = analyzeClauseLocal(clause.text, i);
          }

          // Save to MongoDB
          const savedClause = await saveClauseAnalysis({
            documentId,
            processingJobId: jobId,
            clauseIndex: i,
            clauseText: clause.text,
            classification: {
              clauseType: analysisResult.clauseType,
              domain: domain || document.classification?.domain,
              confidence: analysisResult.confidence,
            },
            scores: analysisResult.scores,
            plainLanguageRewrite: analysisResult.plainLanguageRewrite,
            redFlags: analysisResult.redFlags,
            financialTerms: analysisResult.financialTerms,
          });

          clauseIds.push(savedClause._id.toString());

          // Update progress
          await updateJobProgress(jobId, i + 1, clauses.length);

          // Update Bull job progress for UI
          job.progress(Math.round(((i + 1) / clauses.length) * 100));
        } catch (clauseError) {
          console.error(`Error analyzing clause ${i}:`, clauseError);
          // Continue with next clause instead of failing entire job
          await updateJobStatus(jobId, 'processing');
        }
      }

      // Update job with results
      const job_model = await getProcessingJobById(jobId);
      job_model.results.clauseAnalysisIds = clauseIds;
      job_model.currentStage = 'market_comparison'; // Next stage (Phase 5)
      await job_model.save();

      // Mark job as completed
      await updateJobStatus(jobId, 'completed');

      console.log(`\n✓ Job ${jobId} completed successfully`);
      console.log(`  Analyzed ${clauseIds.length} clauses`);

      return {
        success: true,
        clausesAnalyzed: clauseIds.length,
      };
    } catch (error) {
      console.error(`✗ Job ${jobId} failed:`, error);
      await updateJobStatus(jobId, 'failed', error instanceof Error ? error.message : String(error));
      throw error;
    }
  });

  // Handle failed jobs
  analysisQueue.on('failed', (job, error) => {
    console.error(`Job ${job.id} failed:`, error.message);
  });

  // Handle completed jobs
  analysisQueue.on('completed', (job) => {
    console.log(`Job ${job.id} completed`);
  });

  console.log('✓ Job processor registered');
}

/**
 * Get queue instance (for testing/monitoring)
 */
export function getAnalysisQueue() {
  return analysisQueue;
}

/**
 * Set queue instance (called by jobQueueService)
 */
export function setAnalysisQueue(queue: Queue.Queue<AnalysisJobData>) {
  analysisQueue = queue;
}
