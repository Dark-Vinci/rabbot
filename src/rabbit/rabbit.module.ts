import { Module } from '@nestjs/common';

import { RabbitController } from './rabbit.controller';
import { RabbitMQClient } from './rabbit.client';

@Module({
  controllers: [RabbitController],
  providers: [RabbitMQClient, RabbitMQClient],
  exports: [RabbitMQClient],
})
export class RabbitModule {}
