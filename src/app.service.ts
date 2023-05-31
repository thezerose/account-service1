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
    console.log('produce account_check_user');
    await this.producerService.produce('account_check_user', {
      value: JSON.stringify({
        account_number: 1,
        amount: 10,
        payment_type: 'deposit',
      }),
    });
    return 'account_check_user';
  }

  async getHello3() {
    console.log('produce account_update_balance');
    await this.producerService.produce('account_update_balance', {
      value: JSON.stringify({
        account_number: 1,
        old_balance: 10,
        new_balance: 20,
      }),
    });
    return 'account_update_balance';
  }

  async getHello4() {
    console.log('produce account_check_user');
    await this.producerService.produce('account_check_user', {
      value: JSON.stringify({
        from_account_number: 1,
        to_account_number: 2,
        amount: 10,
        payment_type: 'transfer',
      }),
    });
    return 'account_check_user';
  }

  async getHello5() {
    console.log('produce transfer_account_update_balance');
    await this.producerService.produce('transfer_account_update_balance', {
      value: JSON.stringify({
        from_account: { account_number: '1', old_balance: 387, new_balance: 386 },
        to_account: { account_number: '2', old_balance: 764, new_balance: 712 },
        amount: 1,
        payment_type: 'transfer',
        transactionId: 123456
      }),
    });
    return 'transfer_account_update_balance';
  }
}
