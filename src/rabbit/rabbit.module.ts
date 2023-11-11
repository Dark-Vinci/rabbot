import { Module } from '@nestjs/common';

import { RabbitMQClient } from './rabbit.client';

@Module({
  controllers: [],
  providers: [RabbitMQClient, RabbitMQClient],
  exports: [RabbitMQClient],
})
export class RabbitModule {}
