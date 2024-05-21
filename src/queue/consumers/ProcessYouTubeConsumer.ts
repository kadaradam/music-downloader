import { Channel, Message } from 'amqplib';
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

    channel.consume(queue_processYouTube, (msg) =>
      this.handleMessage(channel, msg),
    );
  }

  private static async handleMessage(
    channel: Channel,
    msg: Message | null,
  ): Promise<void> {
    if (msg === null) {
      console.log('Consumer cancelled by server');
      return;
    }

    try {
      const response = msg?.content.toString();

      console.log(`Received ${response}`);

      // Should not occur
      // Wrong data received, ack the message to remove it from the queue
      if (!response) {
        channel.ack(msg);
        return;
      }

      const { fileId, url } = JSON.parse(response);

      const outputStoragePath = await YouTubeConvertService.toMp3(fileId, url);

      console.log(`File saved to: ${outputStoragePath}`);
    } catch (error) {
      console.error('Failed to process the message', error);
    } finally {
      channel.ack(msg);
    }
  }
}
