import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import ProductPgEntity from './entities/product.pg.entity';
import { ProductPgRepository } from './product.pg.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ProductPgEntity])],
  controllers: [ProductController],
  providers: [ProductService, ProductPgRepository],
})
export class ProductModule { }
