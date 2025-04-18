import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmModuleConfig } from './config/typeorm.config';
import { ProductModule } from './app/product/product.module';
import { RedisModule } from '@nestjs-modules/ioredis';

@Module({
  imports: [
    // Global config module
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Async TypeORM config using ConfigService
    TypeOrmModule.forRoot(typeOrmModuleConfig),

    // Redis module configuration
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'single',
        options: {
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
          password: configService.get<string>('REDIS_PASSWORD'),
        }
      }),
    }),

    ProductModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
