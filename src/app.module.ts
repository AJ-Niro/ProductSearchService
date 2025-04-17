import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmModuleConfig } from './config/typeorm.config';

@Module({
  imports: [
    // Global config module
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Async TypeORM config using ConfigService
    TypeOrmModule.forRoot(typeOrmModuleConfig)

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
