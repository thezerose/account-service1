import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
//import { DatabaseModule } from './database/database.module';
import { KafkaModule } from './kafka/kafka.module';

import { AccountModule } from './account/account.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/connect';
//import { TestConsumer } from './test.consumer';

@Module({
  imports: [
    KafkaModule,
    //DatabaseModule,
    TypeOrmModule.forRoot(typeOrmConfig),
    //ConfigModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    AccountModule,
  ],
  controllers: [AppController],
  //providers: [AppService, TestConsumer],
  providers: [AppService],
})
export class AppModule {}
