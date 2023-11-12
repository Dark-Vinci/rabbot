import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/:name')
  public async getHello(@Param() { name }: { name: string }): Promise<any> {
    const start = Date.now();

    const response = await this.appService.getHello(name);

    const duration = (Date.now() - start) / 1000;

    const formattedResponse = {
      duration,
      data: response.toString(),
      statusCode: 200,
    };

    return formattedResponse;
  }
}
