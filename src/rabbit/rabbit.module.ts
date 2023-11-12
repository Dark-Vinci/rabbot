import { Module } from '@nestjs/common';

import { RabbitMQClient } from './rabbit.client';
import { RabbitMQServer } from './rabbit.server';

@Module({
  controllers: [],
  providers: [RabbitMQClient, RabbitMQServer],
  exports: [RabbitMQClient],
})
export class RabbitModule {}
