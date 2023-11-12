import { Injectable, OnModuleInit } from '@nestjs/common';
import { connect, Channel } from 'amqplib';

@Injectable()
export class RabbitMQClient implements OnModuleInit {
  private channel: Channel;

  public async onModuleInit(): Promise<void> {
    const connection = await connect({
      hostname: 'localhost',
      port: 5672,
      protocol: 'amqp',
      username: 'docker',
      password: 'docker',
      vhost: '/',
    });

    // const connection = await connect('amqp://docker:docker@localhost:4000');

    const channel = await connection.createChannel();
    this.channel ??= channel;
  }

  public async sendMessage(
    queue: string,
    message: string,
    requestId: string,
  ): Promise<any> {
    console.log({ thi: this.channel });
    const repQ = await this.channel.assertQueue('', {
      exclusive: true,
    });

    this.channel.sendToQueue(queue, Buffer.from(message), {
      correlationId: requestId,
      replyTo: repQ.queue,
    });
    console.log('sent');

    // return 'published';

    return new Promise(async (resolve) => {
      console.log({ ch: this.channel, red: repQ.queue });
      await this.channel.consume(
        repQ.queue,
        (msg) => {
          console.log({ msg });
          if (msg.properties.correlationId === requestId) {
            console.log({ msg });
            resolve(msg.content.toString());
          }
        },
        { noAck: true },
      );
    });
  }
}
