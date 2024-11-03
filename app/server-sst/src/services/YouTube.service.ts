import { Resource } from 'sst';

import { QueuePublisherService } from './QueuePublisher.service';

export abstract class YouTubeService {
  static async getVideoMetadata(url: string): Promise<YouTubeMetadata> {
    const response = await fetch(
      `https://noembed.com/embed?dataType=json&url=${url}`,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    );

    const data = (await response.json()) as YouTubeMetadata;

    const videoId = data.thumbnail_url.split('/')[4];

    return {
      ...data,
      id: videoId,
    };
  }

  static async downloadMp3({
    fileId,
    url,
  }: {
    fileId: string;
    url: string;
  }): Promise<boolean> {
    const payload = {
      fileId,
      url,
    };
    const message = JSON.stringify(payload);

    await QueuePublisherService.postMessage(
      Resource.ConvertJobQueue.url,
      message,
    );

    return true;
  }
}
