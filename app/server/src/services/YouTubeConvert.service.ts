import { StatusCodes } from 'http-status-codes';
import { ProcessYouTubeProducer } from '../queue/producers/ProcessYouTube.producer';
import { db } from '../db/drizzle';
import { ConvertJobType, convertJobs } from '../db/schema';
import { YouTubeService } from './YouTube.service';
import { ApiError, ApiErrorType } from '../types/ApiError';
import { and, eq } from 'drizzle-orm';

export abstract class YouTubeConvertService {
  static async toMp3(url: string): Promise<ConvertJobType> {
    const fileId = Math.random().toString(36).substring(7);

    try {
      const videoInfo = await YouTubeService.getVideoMetadata(url);
      const { id: videoId, title } = videoInfo;

      const convertJob = await db
        .insert(convertJobs)
        .values({ videoId, title, fileId, status: 'pending', type: 'mp3' })
        .returning();

      await ProcessYouTubeProducer.sendMessage(fileId, url);

      return convertJob[0];
    } catch (err) {
      console.error('Failed to start convert process', err);

      throw new ApiError(
        ApiErrorType.UNEXPECTED_ERROR,
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Failed to start convert process',
      );
    }
  }

  static async restoreMp3(fileId: string): Promise<ConvertJobType> {
    const result = await db
      .select({ videoId: convertJobs.videoId })
      .from(convertJobs)
      .where(
        and(eq(convertJobs.fileId, fileId), eq(convertJobs.status, 'archived')),
      )
      .limit(1);

    if (!result.length) {
      throw new ApiError(
        ApiErrorType.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        'Video not found',
      );
    }

    const updatedJob = await db
      .update(convertJobs)
      .set({ status: 'pending' })
      .where(eq(convertJobs.fileId, fileId))
      .returning();

    const convertJob = updatedJob[0];
    const { videoId } = convertJob;
    const url = `https://www.youtube.com/watch?v=${videoId}`;

    await ProcessYouTubeProducer.sendMessage(fileId, url);

    return convertJob;
  }
}
