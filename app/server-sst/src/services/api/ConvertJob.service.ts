import { Resource } from 'sst';

import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { StatusCodes } from 'http-status-codes';

import { MEDIA_BUCKET_KEY_PREFIX } from '../../constants';
import { ApiError } from '../../libs/ApiError';
import { shortId } from '../../libs/utils';
import { ApiErrorType } from '../../types/ApiError.type';
import { ConvertJob } from '../../types/ConvertJob.type';
import { YouTubeService } from '../YouTube.service';
import { DBService } from '../db.service';

const s3 = new S3Client({});

export abstract class ConvertJobService {
  static async store(url: string): Promise<ConvertJob> {
    const videoInfo = await YouTubeService.getVideoMetadata(url);
    const { id: videoId, title } = videoInfo;
    const fileId = shortId();

    const createdItem = await DBService.insert<ConvertJob>(
      Resource.ConvertJobsTable.name,
      {
        fileId,
        videoId,
        title,
        type: 'mp3',
        status: 'pending',
        createdAt: new Date().toISOString(),
        downloadCount: 0,
      },
    );
    await YouTubeService.downloadMp3({ fileId, url });

    return createdItem;
  }

  static async restore(fileId: string): Promise<ConvertJob> {
    const items = await DBService.find<ConvertJob>(
      Resource.ConvertJobsTable.name,
      { fileId, status: 'archived' },
      { primaryKey: 'fileId' },
    );

    if (!items.length) {
      throw new ApiError(
        ApiErrorType.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        'Video not found',
      );
    }

    const updatedJob = await DBService.updateOne<ConvertJob>(
      Resource.ConvertJobsTable.name,
      { fileId },
      { status: 'pending' },
    );

    const { videoId } = updatedJob;
    const url = `https://www.youtube.com/watch?v=${videoId}`;

    await YouTubeService.downloadMp3({ fileId, url });

    return updatedJob;
  }

  static async get(fileId: string): Promise<ConvertJob> {
    const items = await DBService.find<ConvertJob>(
      Resource.ConvertJobsTable.name,
      {
        fileId,
      },
    );

    if (!items.length) {
      throw new ApiError(
        ApiErrorType.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        'Video info not found',
      );
    }

    return items[0];
  }

  static async download(fileId: string): Promise<string> {
    const items = await DBService.find<ConvertJob>(
      Resource.ConvertJobsTable.name,
      {
        fileId,
      },
      { selectFields: ['fileId'] },
    );

    if (!items.length) {
      throw new ApiError(
        ApiErrorType.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        'Video info not found',
      );
    }

    const command = new GetObjectCommand({
      Key: MEDIA_BUCKET_KEY_PREFIX + fileId + '.mp3',
      Bucket: Resource.MediaBucket.name,
    });

    // Link expires in 24 hours
    const downloadUrl = await getSignedUrl(s3, command, {
      expiresIn: 60 * 60 * 24,
    });

    await DBService.incrementOne<ConvertJob>(
      Resource.ConvertJobsTable.name,
      { fileId },
      'downloadCount',
    );

    return downloadUrl;
  }
}
