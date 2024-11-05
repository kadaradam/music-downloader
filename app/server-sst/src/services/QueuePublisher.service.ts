import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';

const client = new SQSClient();

export abstract class QueuePublisherService {
  static async postMessage(queueUrl: string, message: string) {
    return client.send(
      new SendMessageCommand({
        QueueUrl: queueUrl,
        MessageBody: message,
      }),
    );
  }
}
