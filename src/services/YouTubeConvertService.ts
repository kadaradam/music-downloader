import { unlink } from 'fs/promises';

export abstract class YouTubeConvertService {
  static async toMp3(fileId: string, url: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const outputFilePath = `${fileId}.mp3`;

      console.log(`Starting download for ${url}...`);

      Bun.spawn(
        ['yt-dlp', url, '-o', outputFilePath, '-x', '--audio-format', 'mp3'],
        {
          cwd: './scripts/downloader/outputs',
          async onExit(_, exitCode) {
            if (exitCode !== 0) {
              console.log('Download failed with code', exitCode);

              const fileToRemove = `${process.cwd()}/scripts/downloader/outputs/${fileId}.webm`;

              console.log('Cleaning up the file', fileToRemove);

              await unlink(fileToRemove);

              return reject('Failed to download the file');
            }

            console.log('Download completed successfully');

            resolve(fileId);
          },
        },
      );
    });
  }
}
