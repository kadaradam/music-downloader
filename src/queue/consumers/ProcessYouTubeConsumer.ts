import { Channel, Message } from 'amqplib';
import { config } from '../../config';
import { YouTubeConvertService } from '../../services/YouTubeConvertService';
import AmqpSingleton from '../AmqpSingleton';
import { queue_processYouTube } from '../names';
import { db } from '../../db/drizzle';
import { convertJobs } from '../../db/schema';
import { eq } from 'drizzle-orm';
import Elysia from 'elysia';

export abstract class ProcessYouTubeConsumer {
  static async listen(app: Elysia): Promise<void> {
    const channel = await AmqpSingleton.connect();

    channel.prefetch(config.MAX_QUEUE_ITEMS);

    channel.assertQueue(queue_processYouTube, {
      durable: false,
    });

    console.log(`Waiting for messages in ${queue_processYouTube}`);

    channel.consume(queue_processYouTube, (msg) =>
      this.handleMessage(app, channel, msg),
    );
  }

  private static async handleMessage(
    app: Elysia,
    channel: Channel,
    msg: Message | null,
  ): Promise<void> {
    if (msg === null) {
      console.log('Consumer cancelled by server');
      return;
    }

    let tempFileId = '';

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

      tempFileId = fileId;
      const outputStoragePath = await YouTubeConvertService.toMp3(fileId, url);

      await db
        .update(convertJobs)
        .set({ status: 'completed', finishedAt: new Date() })
        .where(eq(convertJobs.fileId, fileId));

      console.log(`File saved to: ${outputStoragePath}`);
    } catch (error) {
      console.error('Failed to process the message', error);

      if (tempFileId) {
        await db
          .update(convertJobs)
          .set({ status: 'failed', finishedAt: new Date() })
          .where(eq(convertJobs.fileId, tempFileId));
      }
    } finally {
      channel.ack(msg);

      // Notify the
      app.server?.publish(tempFileId, 'finished');
    }
  }
}
