import { Injectable } from '@nestjs/common';
import { ProducerService } from './kafka/producer.service';

@Injectable()
export class AppService {
  constructor(private readonly producerService: ProducerService) {}

  async getHello() {
    console.log('produce getHello');
    await this.producerService.produce('test', {
      value: 'Hello World',
    });
    return 'Hello World!';
  }

  async getHello2() {
    console.log('produce getHello 2');
    await this.producerService.produce('account_check_user', {
      value: JSON.stringify({
        account_number: 1,
        amount: 10,
        payment_type: 'deposit',
      }),
    });
    return 'Hello World!';
  }

  async getHello3() {
    console.log('produce getHello 3');
    await this.producerService.produce('account_update_balance', {
      value: JSON.stringify({
        account_number: 1,
        old_balance: 10,
        new_balance: 20,
      }),
    });
    return 'Hello World! 3';
  }

  async getHello4() {
    console.log('produce getHello 4');
    await this.producerService.produce('account_check_user', {
      value: JSON.stringify({
        from_account_number: 1,
        to_account_number: 2,
        amount: 10,
        payment_type: 'transfer',
      }),
    });
    return 'Hello World! 3';
  }
}
