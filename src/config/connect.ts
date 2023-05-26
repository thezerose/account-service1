import * as dotenv from 'dotenv';

dotenv.config();
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const typeConfig = (): TypeOrmModuleOptions => {
  return {
    type: 'postgres',
    host: process.env.APP_HOST,
    port: parseInt(process.env.APP_PORT, 10) || 3306,
    username: process.env.APP_USERNAME,
    password: process.env.APP_PASSWORD,
    database: process.env.APP_DATABASE,
    entities: ['dist/**/*.entity{.ts,.js}'],
    synchronize: true,
    logging: false,
  };
};
export const typeOrmConfig: TypeOrmModuleOptions = typeConfig();

export const environment = {
  network: process.env.XTATUZ_NETWORK,
  // owner: process.env.XTATUZ_OWNER,
  rpc_url: process.env.XTATUZ_RPC_URL,
};
