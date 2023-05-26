import { Module } from '@nestjs/common';
//import { DatabaseModule } from '../database/database.module';
import { ConsumerService } from './consumer.service';
import { ProducerService } from './producer.service';
//import { AccountService } from 'src/account/account.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountRepository } from 'src/account/account.repository';
//import { Account } from 'src/account/entities/account.entity';

@Module({
  //imports: [DatabaseModule],
  providers: [ProducerService, ConsumerService],
  exports: [ProducerService, ConsumerService],
})
export class KafkaModule {}
