import { Injectable, Logger } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { ProductPgRepository } from './product.pg.repository';
import ProductPgEntity from './entities/product.pg.entity';
import { Cron } from '@nestjs/schedule';
import { CronExpression } from '@nestjs/schedule';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);
  constructor(
    private readonly productRepo: ProductPgRepository,
    @InjectRedis() private readonly redis: Redis,
  ) { }

  async search(
    query: string,
    limit = 10,
    offset = 0
  ): Promise<{ total: number; items: ProductPgEntity[] }> {
    const searchResult = await this.productRepo.search(query, limit, offset)
    return {
      total: searchResult.total,
      items: searchResult.items
    }
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  async populateAutocompleteCache(): Promise<void> {
    this.logger.log('Populate Autocomplete Redis Cache');

    await this.redis.del('autocomplete:products');

    const pipeline = this.redis.pipeline();

    const productNames = await this.productRepo.getAllNames('lower')
    for (const product of productNames) {
      pipeline.zadd('autocomplete:products', 0, product.name);
    }
    await pipeline.exec();
  }

  async getAutocomplete(prefix: string, limit: number = 10): Promise<string[]> {
    const min = `[${ prefix.toLowerCase() }`;
    const max = `[${ prefix.toLowerCase() }\xff`;
    return await this.redis.zrangebylex('autocomplete:products', min, max, 'LIMIT', 0,limit);
  }

  async getNameSuggestion(query: string, limit: number) {
    return await this.productRepo.getNameSuggestion(query, limit)
  }

}
