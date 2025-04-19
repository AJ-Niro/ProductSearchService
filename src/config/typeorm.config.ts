import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config(); // for CLI

const {
  POSTGRES_HOST,
  POSTGRES_PORT = 3000,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DB,
} = process.env;

const commonConfig: DataSourceOptions = {
  type: 'postgres',
  host: POSTGRES_HOST,
  port: Number(POSTGRES_PORT),
  username: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  database: POSTGRES_DB,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../database/migrations/*.ts'],
  synchronize: false,
};

export const typeOrmModuleConfig: TypeOrmModuleOptions = {
  ...commonConfig,
};

export default commonConfig;
