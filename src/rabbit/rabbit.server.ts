import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConsumeMessage, connect } from 'amqplib';

@Injectable()
export class RabbitMQServer implements OnModuleInit {
  public async onModuleInit(): Promise<void> {
    const connection = await connect({
      hostname: 'localhost',
      port: 5672,
      protocol: 'amqp',
      username: 'docker',
      password: 'docker',
      vhost: '/',
    });

    const ch = await connection.createChannel();

    const queue = 'rpc_queue';

    await ch.assertQueue(queue, { durable: false });

    console.log('ON_MODULE_INIT');

    ch.consume(queue, async (msg: ConsumeMessage) => {
      console.log({ msg });
      if (msg) {
        const message = msg.content.toString();

        console.log(`RECIEVED MESSAGE: ${message}`);

        // console.log(message.data.to)

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
