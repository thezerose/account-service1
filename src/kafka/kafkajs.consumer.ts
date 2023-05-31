import { Logger } from '@nestjs/common';
import {
  Consumer,
  ConsumerConfig,
  ConsumerSubscribeTopic,
  Kafka,
  KafkaMessage,
} from 'kafkajs';
import * as retry from 'async-retry';
import { sleep } from '../utils/sleep';
import { IConsumer } from './consumer.interface';
import { ConfigService } from '@nestjs/config';
import { ProducerService } from './producer.service';
import { formatJson } from 'src/config/buffer-json';
//import { DatabaseService } from '../database/database.service';

export class KafkajsConsumer implements IConsumer {
  private readonly kafka: Kafka;
  private readonly consumer: Consumer;
  private readonly logger: Logger;

  private readonly producerService: ProducerService;

  constructor(
    private readonly topic: ConsumerSubscribeTopic,
    //private readonly databaseService: DatabaseService,
    config: ConsumerConfig,
    broker: string,
  ) {
    this.kafka = new Kafka({ brokers: [broker] });
    this.consumer = this.kafka.consumer(config);
    this.logger = new Logger(`${topic.topic}-${config.groupId}`);

    const configService = new ConfigService();
    this.producerService = new ProducerService(configService);
  }

  async consume(onMessage: (message: KafkaMessage) => Promise<void>) {
    await this.consumer.subscribe(this.topic);
    await this.consumer.run({
      eachMessage: async ({ message, partition }) => {
        this.logger.debug(`Processing message partition: ${partition}`);
        try {
          await retry(async () => onMessage(message), {
            retries: 1,
            onRetry: (error, attempt) =>
              this.logger.error(
                `Error consuming message, executing retry ${attempt}/3...`,
                error,
              ),
          });
        } catch (err) {
          this.logger.error(
            'Error consuming message. Adding to dead letter queue...',
            err,
          );
          this.producerService.produce('transfer_error_handler', {
            value: JSON.stringify(formatJson(message.value)),
          });
          //await this.addMessageToDlq(message);
        }
      },
    });
  }

  // private async addMessageToDlq(message: KafkaMessage) {
  //   await this.databaseService
  //     .getDbHandle()
  //     .collection('dlq')
  //     .insertOne({ value: message.value, topic: this.topic.topic });
  // }

  async connect() {
    try {
      await this.consumer.connect();
    } catch (err) {
      this.logger.error('Failed to connect to Kafka.', err);
      await sleep(5000);
      await this.connect();
    }
  }

  async disconnect() {
    await this.consumer.disconnect();
  }
}
