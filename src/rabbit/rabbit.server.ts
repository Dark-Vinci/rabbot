import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConsumeMessage, connect } from 'amqplib';

@Injectable()
export class RabbitMQServer implements OnModuleInit {
  public async onModuleInit(): Promise<void> {
    const connection = await connect({
      hostname: '',
      port: 3000,
      protocol: 'ampq',
      username: 'docker',
      password: 'docker',
      vhost: '/',
    });

    const ch = await connection.createChannel();

    const queue = 'queue';

    await ch.assertQueue(queue, { durable: false });

    ch.consume(queue, async (msg: ConsumeMessage) => {
      if (msg) {
        const message = msg.content.toJSON();

        console.log(`RECIEVED MESSAGE: ${message}`);

        const response = `PROCESSED: ${message}`;

        ch.sendToQueue(msg.properties.replyTo, Buffer.from(response), {
          correlationId: msg.properties.correlationId,
        });

        ch.ack(msg);
      }
    });
    return;
  }
}
