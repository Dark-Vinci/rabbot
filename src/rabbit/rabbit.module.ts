import { Module } from '@nestjs/common';
import { RabbitController } from './rabbit.controller';

@Module({
  controllers: [RabbitController],
})
export class RabbitModule {}
