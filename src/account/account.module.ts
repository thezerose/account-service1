import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { ConsumerService } from 'src/kafka/consumer.service';
//import { AccountRepository } from './account.repository';
import { Account } from './entities/account.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KafkaModule } from 'src/kafka/kafka.module';
import { AccountRepository } from './account.repository';
import { ProducerService } from 'src/kafka/producer.service';

@Module({
  imports: [TypeOrmModule.forFeature([Account])],
  providers: [AccountService, ConsumerService, ProducerService],
})
export class AccountModule {}
