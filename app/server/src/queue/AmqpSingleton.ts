import * as amqp from 'amqplib';
import { config } from '../config';

class AmqpSingleton {
  private static instance: AmqpSingleton;
  private connection: amqp.Connection | null = null;
  private channel: amqp.Channel | null = null;

  private constructor() {}

  public static getInstance(): AmqpSingleton {
    if (!AmqpSingleton.instance) {
      AmqpSingleton.instance = new AmqpSingleton();
    }
    return AmqpSingleton.instance;
  }

  public async connect(): Promise<amqp.Channel> {
    if (!this.connection) {
      this.connection = await amqp.connect(config.RABBIT_MQ_URL);
      this.channel = await this.connection.createChannel();
    }
    return this.channel!;
  }
}

export default AmqpSingleton.getInstance();
