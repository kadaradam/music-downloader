import AmqpSingleton from '../AmqpSingleton';
import { queue_processYouTube } from '../names';

export abstract class ProcessYouTubeProducer {
  static async sendMessage(fileId: string, url: string): Promise<void> {
    const channel = await AmqpSingleton.connect();

    channel.assertQueue(queue_processYouTube, {
      durable: false,
    });

    const payload = {
      fileId,
      url,
    };
    const message = JSON.stringify(payload);

    channel.sendToQueue(queue_processYouTube, Buffer.from(message));

    console.log(`Sent ${message}`);
  }
}
