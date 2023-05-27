import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConsumerService } from 'src/kafka/consumer.service';
import { Account } from './entities/account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { formatJson } from 'src/config/buffer-json';
import { ProducerService } from 'src/kafka/producer.service';
import { AccountRepository } from './account.repository';

@Injectable()
export class AccountService implements OnModuleInit {
  constructor(
    private readonly consumerService: ConsumerService,
    @InjectRepository(Account) private readonly accountRepositoryCustom: AccountRepository,
    private readonly producerService: ProducerService,
  ) {}

  async onModuleInit() {
    await this.consumerService.consume({
      topic: { topic: 'account_check_user' },
      config: { groupId: 'account-check-user-consumer' },
      onMessage: async (message) => {
        const payloadData = formatJson(message.value);
        this.accountCheckUserHandler(payloadData);
      },
    });

    await this.consumerService.consume({
      topic: { topic: 'account_update_balance' },
      config: { groupId: 'account-update-consumer' },
      onMessage: async (message) => {
        const payloadData = formatJson(message.value);
        this.accountUpdateBalanceHandler(payloadData);
      },
    });
  }

  async accountCheckUserHandler(payloadData: any) {
    const balance = await this.getBalanceByUser(payloadData.account_number);

    //เรียนกต่อ
    let processType = '';
    if (payloadData.payment_type === 'deposit') {
      processType = 'deposit_process';
    } else if (payloadData.payment_type === 'withdraw') {
      processType = 'withdraw_process';
    }

    if (processType !== '') {
      await this.producerService.produce(processType, {
        value: JSON.stringify({
          ...payloadData,
          balance: balance,
        }),
      });
    }
  }

  async accountUpdateBalanceHandler(payloadData: any) {
    const user = await this.updateBalanceByUser(
      payloadData.account_number,
      payloadData.new_balance,
    );

    //เรียนกต่อ
    let processType = '';
    if (payloadData.payment_type === 'deposit') {
      processType = 'deposit_process_success';
    } else if (payloadData.payment_type === 'withdraw') {
      processType = 'withdraw_process_success';
    }

    if (processType !== '') {
      await this.producerService.produce(processType, {
        value: JSON.stringify({
          ...payloadData,
          status: 'success',
        }),
      });
    }
  }

  async getBalanceByUser(userId: any) {
    const account = await this.accountRepositoryCustom.findUserById(userId);
    return account.balance ? account.balance : 0;
  }

  async updateBalanceByUser(userId: number, balance: number) {
    const account = await this.accountRepositoryCustom.updateBalanceById(userId, balance)
    return account;
  }
}
