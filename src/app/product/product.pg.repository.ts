import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import ProductPgEntity from './entities/product.pg.entity';

@Injectable()
export class ProductPgRepository {
  constructor(
    @InjectRepository(ProductPgEntity)
    private readonly repo: Repository<ProductPgEntity>,
  ) {}

  async count(): Promise<number> {
    return this.repo.count();
  }

  async search(
    query: string,
    limit: number,
    offset: number,
  ): Promise<{ items: ProductPgEntity[]; total: number }> {
    const qb = this.repo
      .createQueryBuilder('p')
      .innerJoinAndSelect('p.category', 'c')
      .innerJoinAndSelect('p.location', 'l')
      .addSelect(
        `
      CASE
        WHEN LOWER(p.name) ILIKE LOWER(:qLike) THEN 3
        WHEN LOWER(c.name) ILIKE LOWER(:qLike) THEN 2
        WHEN LOWER(l.name) ILIKE LOWER(:qLike) THEN 1
        ELSE 0
      END`,
        'relevance',
      )
      .where('LOWER(p.name) ILIKE LOWER(:qLike)')
      .orWhere('LOWER(c.name) ILIKE LOWER(:qLike)')
      .orWhere('LOWER(l.name) ILIKE LOWER(:qLike)')
      .orderBy('relevance', 'DESC')
      .skip(offset)
      .take(limit)
      .setParameter('qLike', `%${query}%`);

    const [items, total] = await qb.getManyAndCount();

    return {
      items: items,
      total: total,
    };
  }

  async getAllNames(nameCase?: 'lower' | 'upper'): Promise<{ name: string }[]> {
    const caseFunction =
      nameCase === 'lower' ? 'LOWER' : nameCase === 'upper' ? 'UPPER' : '';

    return await this.repo
      .createQueryBuilder('product')
      .select(
        `DISTINCT(${caseFunction ? caseFunction + '(product.name)' : 'product.name'})`,
        'name',
      )
      .getRawMany();
  }

  async getNameSuggestion(
    query: string,
    limit: number,
  ): Promise<{ name: string }[]> {
    return await this.repo
      .createQueryBuilder('product')
      .select('DISTINCT ON (product.name) product.name', 'name')
      .where('similarity(product.name, :search) > :threshold', {
        search: query,
        threshold: 0.3,
      })
      .orderBy('product.name')
      .addOrderBy('similarity(product.name, :search)', 'DESC')
      .setParameter('search', query)
      .limit(limit)
      .getRawMany();
  }
}
