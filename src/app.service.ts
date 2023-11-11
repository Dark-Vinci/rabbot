import { Injectable } from '@nestjs/common';
import { RabbitMQClient } from './rabbit/rabbit.client';

@Injectable()
export class AppService {
  public constructor(private readonly rabbit: RabbitMQClient) {}

  public async getHello(val: string): Promise<string> {
    const response = await this.rabbit.sendMessage(
      'queue',
      val,
      'bf9633bf-d54d-4526-8aa1-506319594c60',
    );

    return response;
  }
}
