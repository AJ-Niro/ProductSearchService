import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import ProductPgEntity from './entities/product.pg.entity';

@Injectable()
export class ProductPgRepository {
  constructor(
    @InjectRepository(ProductPgEntity)
    private readonly repo: Repository<ProductPgEntity>,
  ) { }

  async count(): Promise<number> {
    return this.repo.count();
  }

  async search(query: string, limit = 10, offset = 0): Promise<ProductPgEntity[]> {

    const qb = this.repo.createQueryBuilder('p')
      .innerJoin('p.category', 'c')
      .innerJoin('p.location', 'l')
      .addSelect([
        'c.name AS category_name',
        'l.name AS location_name',
        `
        CASE
          WHEN LOWER(p.name) ILIKE LOWER(:queryPattern) THEN 3
          WHEN LOWER(c.name) ILIKE LOWER(:queryPattern) THEN 2
          WHEN LOWER(l.name) ILIKE LOWER(:queryPattern) THEN 1
          ELSE 0
        END
      AS relevance`,
      ])
      .where('LOWER(p.name) ILIKE LOWER(:queryPattern)')
      .orWhere('LOWER(c.name) ILIKE LOWER(:queryPattern)')
      .orWhere('LOWER(l.name) ILIKE LOWER(:queryPattern)')
      .orderBy('relevance', 'DESC')
      .limit(limit)
      .offset(offset)
      .setParameter('queryPattern', `%${query}%`);

    const results = await qb.getRawMany();
    return results;
  }

}
