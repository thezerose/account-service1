import { Injectable, OnModuleInit } from "@nestjs/common";
import { ConsumerService } from "src/kafka/consumer.service";
import { Account } from "./entities/account.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { formatJson } from "src/config/buffer-json";
import { ProducerService } from "src/kafka/producer.service";
import { AccountRepository } from "./account.repository";
import { AccountTopicEnum } from "src/constant/account.enum";

@Injectable()
export class AccountService implements OnModuleInit {
  constructor(
    private readonly consumerService: ConsumerService,
    @InjectRepository(Account)
    private readonly accountRepositoryCustom: AccountRepository,
    private readonly producerService: ProducerService
  ) {}

  async onModuleInit() {
    await this.consumerService.consume({
      topic: { topic: AccountTopicEnum.ACCOUNT_CHECK_USER },
      config: { groupId: AccountTopicEnum.ACCOUNT_CHECK_USER + "-consumer" },
      onMessage: async (message) => {
        const payloadData = formatJson(message.value);
        this.accountCheckUserHandler(payloadData);
      },
    });

    await this.consumerService.consume({
      topic: { topic: AccountTopicEnum.ACCOUNT_UPDATE_BALANCE },
      config: {
        groupId: AccountTopicEnum.ACCOUNT_UPDATE_BALANCE + "-consumer",
      },
      onMessage: async (message) => {
        const payloadData = formatJson(message.value);
        this.accountUpdateBalanceHandler(payloadData);
      },
    });

    await this.consumerService.consume({
      topic: { topic: AccountTopicEnum.TRANSFER_ACCOUNT_UPDATE_BALABCE },
      config: {
        groupId: AccountTopicEnum.TRANSFER_ACCOUNT_UPDATE_BALABCE + "-consumer",
      },
      onMessage: async (message) => {
        const payloadData = formatJson(message.value);
        const newPayloadData = {
          account_number: payloadData.account_number,
          new_balance: payloadData.new_balance,
          payment_type: 'transfer',
          section_payment_type: payloadData.payment_type,
        }
        this.accountUpdateBalanceHandler(newPayloadData);
      },
    });
  }

  async accountCheckUserHandler(payloadData: any) {
    //const balance = await this.getBalanceByUser(payloadData.account_number);

    let balance: number | { account_number: number; balance: number }[];
    //เรียนกต่อ
    let processType = "";
    if (payloadData.payment_type === "deposit") {
      processType = AccountTopicEnum.DEPOSIT_SUCCESS;
      balance = await this.getBalanceByUser(payloadData.account_number);
    } else if (payloadData.payment_type === "withdraw") {
      processType = AccountTopicEnum.WITHDRAW_SUCCESS;
      balance = await this.getBalanceByUser(payloadData.account_number);
    } else if (payloadData.payment_type === "transfer") {
      processType = AccountTopicEnum.TRANSFER_CHECK_SUCCESS;
      balance = await Promise.all(
        [payloadData.from_account_number, payloadData.to_account_number].map(
          async (accountId) => {
            return {
              account_number: accountId,
              balance: await this.getBalanceByUser(accountId),
            };
          }
        )
      );
    }

    if (processType !== "") {
      const newPayloadData = {
        ...payloadData,
        balance: balance,
      };
      await this.emitEventNameHandler(processType, newPayloadData);
    }
  }

  async accountUpdateBalanceHandler(payloadData: any) {
    const user = await this.updateBalanceByUser(
      payloadData.account_number,
      payloadData.new_balance
    );

    //เรียนกต่อ
    let processType = "";
    if (payloadData.payment_type === "deposit") {
      processType = AccountTopicEnum.DEPOSIT_PROCESS_SUCCESS;
    } else if (payloadData.payment_type === "withdraw") {
      processType = AccountTopicEnum.WITHDRAW_PROCESS_SUCCESS;
    } else if (payloadData.payment_type === "transfer") {
      if(payloadData.section_payment_type === 'withdraw') {
        processType = AccountTopicEnum.TRANSFER_WITHDRAW_PROCESS_SUCCESS;
      } else if(payloadData.section_payment_type === 'deposit') {
        processType = AccountTopicEnum.TRANSFER_DEPOSIT_PROCESS_SUCCESS;
      }
      
    }

    if (processType !== "") {
      const newPayloadData = {
        ...payloadData,
        status: "success",
      };

      await this.emitEventNameHandler(processType, newPayloadData);
    }
  }

  async getBalanceByUser(userId: any) {
    try {
      const account = await this.accountRepositoryCustom.findUserById(userId);
      return account.balance ? account.balance : 0;
    } catch (error) {
      console.log("gerror etBalanceByUser", error);
    }
  }

  async updateBalanceByUser(userId: number, balance: number) {
    const account = await this.accountRepositoryCustom.updateBalanceById(
      userId,
      balance
    );
    return account;
  }

  async emitEventNameHandler(eventName: string, payloadData) {
    console.log('Account -> call event -> ', eventName)
    await this.producerService.produce(eventName, {
      value: JSON.stringify(payloadData),
    });
  }
}
