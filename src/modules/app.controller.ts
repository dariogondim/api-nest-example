import { Get, Controller } from '@nestjs/common';

import { LoggerService } from './logger/logger.service';

@Controller('/')
export class AppController {

  private loggerService: LoggerService;

  constructor() {
    this.loggerService = new LoggerService();
  }

  @Get()
  root(): string {
    this.loggerService.info('EU/SA API');
    return 'EU/SA API ENVIRONMENT TEST';
  }
}
