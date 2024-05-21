import { BunFile } from 'bun';
import { ProcessYouTubeProducer } from '../queue/producers/ProcessYouTubeProducer';

export abstract class ConvertVideoService {
  static async toMp3(url: string): Promise<string> {
    const fileId = Math.random().toString(36).substring(7);

    await ProcessYouTubeProducer.sendMessage(fileId, url);

    return fileId;
  }

  static getFile(fileId: string): BunFile {
    const fullOutputFilePath = `scripts/downloader/outputs/${fileId}.mp3`;

    console.log('Sending file', fullOutputFilePath);

    return Bun.file(fullOutputFilePath);
  }
}
