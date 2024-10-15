import { unlink } from 'fs/promises';
import { getFilePath } from '../libs/utils';

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

  static async downloadMp3(fileId: string, url: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const outputFilePath = `${fileId}.mp3`;

      console.log(`Starting download for ${url}...`);

      Bun.spawn(
        [
          'yt-dlp',
          url,
          '-o',
          outputFilePath,
          '-x',
          '--audio-format',
          'mp3',
          '--retries',
          '3',
        ],
        {
          cwd: './scripts/downloader/outputs',
          async onExit(_, exitCode) {
            if (exitCode !== 0) {
              try {
                console.log('Download failed with code', exitCode);

                const fileToRemove = getFilePath(fileId);

                console.log('Cleaning up the file', fileToRemove);

                await unlink(fileToRemove);
              } catch (error) {
                console.error('Failed to remove the file', error);
              } finally {
                reject('Failed to download the file');
              }
            }

            console.log('Download completed successfully');

            resolve(fileId);
          },
        },
      );
    });
  }
}
