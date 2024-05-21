import { config } from '../../config';
import { YouTubeConvertService } from '../../services/YouTubeConvertService';
import AmqpSingleton from '../AmqpSingleton';
import { queue_processYouTube } from '../names';

export abstract class ProcessYouTubeConsumer {
  static async listen(): Promise<void> {
    const channel = await AmqpSingleton.connect();

    channel.prefetch(config.MAX_QUEUE_ITEMS);

    channel.assertQueue(queue_processYouTube, {
      durable: false,
    });

    console.log(`Waiting for messages in ${queue_processYouTube}`);

    channel.consume(queue_processYouTube, async (msg) => {
      if (msg === null) {
        console.log('Consumer cancelled by server');
        return;
      }

      const response = msg?.content.toString();

      console.log(`Received ${response}`);

      // Wrong data received
      if (!response) {
        channel.ack(msg);
        return;
      }

      const { fileId, url } = JSON.parse(response);

      const outputStoragePath = await YouTubeConvertService.toMp3(fileId, url);

      console.log(`File saved to: ${outputStoragePath}`);

      channel.ack(msg);
    });
  }
}
