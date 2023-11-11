import { Injectable, OnModuleInit } from '@nestjs/common';
import ampq from 'amqplib';

@Injectable()
export class RabbitMQClient implements OnModuleInit {
  private channel: ampq.Channel;

  public async onModuleInit(): Promise<void> {
    const connection = await ampq.connect({
      hostname: 'localhost',
      port: 3000,
      protocol: 'ampq',
      username: 'docker',
      password: 'docker',
      vhost: '/',
    });

    const channel = await connection.createChannel();
    this.channel ??= channel;
  }

  public async sendMessage(
    queue: string,
    message: string,
    requestId: string,
  ): Promise<any> {
    const repQ = await this.channel.assertQueue('REPLY-QUEUE', {
      exclusive: true,
    });

    this.channel.sendToQueue(queue, Buffer.from(message), {
      correlationId: requestId,
      replyTo: repQ.queue,
    });

    return new Promise((resolve) => {
      this.channel.consume(
        repQ.queue,
        (msg) => {
          if (msg.properties.correlationId === requestId) {
            resolve(msg.content.toJSON());
          }
        },
        { noAck: true },
      );
    });
  }
}
