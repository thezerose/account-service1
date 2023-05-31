import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/test')
  getHello() {
    return this.appService.getHello();
  }

  @Get('/account_check_user')
  getHello2() {
    return this.appService.getHello2();
  }

  @Get('/account_update_balance')
  getHello3() {
    return this.appService.getHello3();
  }

  @Get('/account_check_user')
  getHello4() {
    return this.appService.getHello4();
  }

  @Get('/transfer_account_update_balance')
  getHello5() {
    return this.appService.getHello5();
  }
}
