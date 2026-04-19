import Queue from 'bull';
import { getRedisClient } from '../clients/redisClient.js';
import config from '../config/index.js';
import ProcessingJob from '../models/ProcessingJob.js';
import { ProcessingJobStatus, ProcessingStage } from '../schemas/processingJobSchemas.js';

export interface AnalysisJobData {
  jobId: string;
  documentId: string;
  ownerId: string;
  cleanedText: string;
  domain?: string;
  sourceMetadata?: Record<string, any>;
}

let analysisQueue: Queue.Queue<AnalysisJobData> | null = null;

/**
 * Initialize Bull queue (requires Redis connection)
 */
export async function initializeJobQueue() {
  if (analysisQueue) {
    return analysisQueue;
  }

  try {
    await getRedisClient(); // Ensure main Redis client is connected
    analysisQueue = new Queue('document-analysis', {
      redis: config.redisUrl,
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: true,
      },
    });

    analysisQueue.on('error', (error) => {
      console.error('Queue error:', error);
    });

    console.log('✓ Job queue initialized');
    
    // Register processors
    try {
      const { registerJobProcessor, setAnalysisQueue } = await import('../workers/clauseAnalysisWorker.js');
      setAnalysisQueue(analysisQueue);
      await registerJobProcessor();
    } catch (error) {
      console.warn('Could not register job processor:', error);
    }

    return analysisQueue;
  } catch (error) {
    console.error('✗ Failed to initialize job queue:', error);
    throw error;
  }
}

/**
 * Enqueue a document for analysis
 */
export async function enqueueAnalysisJob(data: AnalysisJobData): Promise<string> {
  if (!analysisQueue) {
    throw new Error('Job queue not initialized. Call initializeJobQueue() first');
  }

  const job = await analysisQueue.add(data, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
  });

  console.log(`✓ Job enqueued: ${job.id} for document ${data.documentId}`);
  return job.id.toString();
}

/**
 * Get job status
 */
export async function getJobStatus(jobId: string) {
  if (!analysisQueue) {
    throw new Error('Job queue not initialized');
  }

  try {
    const job = await analysisQueue.getJob(jobId);
    if (!job) {
      throw new Error(`Job not found: ${jobId}`);
    }

    const state = await job.getState();
    const progress = job.progress();

    return {
      id: job.id,
      state,
      progress,
      data: job.data,
      failedReason: job.failedReason,
    };
  } catch (error) {
    console.error('Error retrieving job status:', error);
    throw error;
  }
}

/**
 * Create and save a ProcessingJob record
 */
export async function createProcessingJob(input: {
  documentId: string;
  ownerId: string;
  piiRemovalLogId?: string;
  stage?: ProcessingStage;
}): Promise<string> {
  const job = new ProcessingJob({
    documentId: input.documentId,
    ownerId: input.ownerId,
    status: 'queued',
    currentStage: input.stage || 'classification',
    progress: {
      totalClauses: 0,
      processedClauses: 0,
      percentComplete: 0,
    },
    results: {
      piiRemovalLogId: input.piiRemovalLogId,
      clauseAnalysisIds: [],
    },
  });

  const saved = await job.save();
  console.log(`✓ ProcessingJob created: ${saved._id}`);
  return saved._id.toString();
}

/**
 * Update ProcessingJob status
 */
export async function updateJobStatus(
  jobId: string,
  status: ProcessingJobStatus,
  errorMessage?: string
) {
  const update: any = { status };

  if (status === 'processing') {
    update.startedAt = new Date();
  } else if (status === 'completed') {
    update.completedAt = new Date();
  } else if (status === 'failed' && errorMessage) {
    update.$push = {
      errorLog: {
        timestamp: new Date(),
        stage: 'clause_analysis',
        message: errorMessage,
      },
    };
  }

  const updated = await ProcessingJob.findByIdAndUpdate(jobId, update, { new: true });
  console.log(`✓ Job ${jobId} status updated to ${status}`);
  return updated;
}

/**
 * Update job progress
 */
export async function updateJobProgress(
  jobId: string,
  processed: number,
  total: number
) {
  const percentComplete = Math.round((processed / total) * 100);

  const updated = await ProcessingJob.findByIdAndUpdate(
    jobId,
    {
      'progress.processedClauses': processed,
      'progress.totalClauses': total,
      'progress.percentComplete': percentComplete,
    },
    { new: true }
  );

  return updated;
}

/**
 * Store classification result
 */
export async function storeClassificationResult(
  jobId: string,
  result: {
    domain: string;
    jurisdiction: string;
    userParty: string;
    confidence: number;
    reasoning?: string;
  }
) {
  const updated = await ProcessingJob.findByIdAndUpdate(
    jobId,
    {
      'results.classificationResult': result,
      currentStage: 'clause_analysis',
    },
    { new: true }
  );

  console.log(`✓ Classification result stored for job ${jobId}`);
  return updated;
}

/**
 * Get ProcessingJob by ID
 */
export async function getProcessingJobById(jobId: string) {
  const job = await ProcessingJob.findById(jobId);
  if (!job) {
    throw new Error(`ProcessingJob not found: ${jobId}`);
  }
  return job;
}

/**
 * Get jobs by document ID
 */
export async function getJobsByDocumentId(documentId: string) {
  return ProcessingJob.find({ documentId }).sort({ createdAt: -1 });
}
