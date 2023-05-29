import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/a')
  getHello() {
    return this.appService.getHello();
  }

  @Get('/b')
  getHello2() {
    return this.appService.getHello2();
  }

  @Get('/c')
  getHello3() {
    return this.appService.getHello3();
  }

  @Get('/d')
  getHello4() {
    return this.appService.getHello4();
  }
}
