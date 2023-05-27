import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { ConsumerService } from 'src/kafka/consumer.service';
//import { AccountRepository } from './account.repository';
import { Account } from './entities/account.entity';
import {
  getDataSourceToken,
  getRepositoryToken,
  TypeOrmModule,
} from '@nestjs/typeorm';
//import { AccountRepository } from './account.repository';
import { ProducerService } from 'src/kafka/producer.service';
import { DataSource } from 'typeorm';
import { customAccountRepository } from './account.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Account])],
  providers: [
    {
      provide: getRepositoryToken(Account),
      inject: [getDataSourceToken()],
      useFactory(datasource: DataSource) {
        return datasource.getRepository(Account).extend(customAccountRepository);
      },
    },
    AccountService, ConsumerService, ProducerService,
  ],
})
export class AccountModule {}
