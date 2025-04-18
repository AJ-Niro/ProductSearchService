import { Injectable } from '@nestjs/common';
import { ProductPgRepository } from './product.pg.repository';
import ProductPgEntity from './entities/product.pg.entity';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepo: ProductPgRepository,
  ) { }

  async search(
    query: string,
    limit = 10,
    offset = 0
  ): Promise<{ total: number; items: ProductPgEntity[] }>
  {
    const searchResult = await this.productRepo.search(query, limit, offset)
    return {
      total: searchResult.total,
      items: searchResult.items
    }
  }

}
