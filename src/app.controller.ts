import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  public async getHello(): Promise<any> {
    const start = Date.now();

    const response = await this.appService.getHello('a');

    const duration = (Date.now() - start) / 1000;

    const formattedResponse = {
      duration,
      data: response,
      statusCode: 200,
    };

    return formattedResponse;
  }
}
