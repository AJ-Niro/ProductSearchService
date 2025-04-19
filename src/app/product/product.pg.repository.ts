import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import ProductPgEntity from './entities/product.pg.entity';
import CategoryPgEntity from '../category/entities/category.pg.entity';
import LocationPgEntity from '../location/entities/location.pg.entity';
import { RawProduct } from './interfaces/raw-product.interface';

@Injectable()
export class ProductPgRepository {
  constructor(
    @InjectRepository(ProductPgEntity)
    private readonly repo: Repository<ProductPgEntity>,
  ) { }

  async count(): Promise<number> {
    return this.repo.count();
  }

  async search(
    query: string,
    limit: number,
    offset: number
  ): Promise<{ items: ProductPgEntity[], total: number }> {
    const results: RawProduct[] = await this.repo.query(
      `
      SELECT
        p.*,
        c.name AS category_name,
        l.name AS location_name,
        (
          CASE
            WHEN LOWER(p.name) ILIKE LOWER('%' || $1 || '%') THEN 3
            WHEN LOWER(c.name) ILIKE LOWER('%' || $1 || '%') THEN 2
            WHEN LOWER(l.name) ILIKE LOWER('%' || $1 || '%') THEN 1
            ELSE 0
          END
        ) AS relevance
      FROM product p
      INNER JOIN category c ON c.id = p.category_id
      INNER JOIN location l ON l.id = p.location_id
      WHERE
        LOWER(p.name) ILIKE LOWER('%' || $1 || '%')
        OR LOWER(c.name) ILIKE LOWER('%' || $1 || '%')
        OR LOWER(l.name) ILIKE LOWER('%' || $1 || '%')
      ORDER BY relevance DESC
      LIMIT $2 OFFSET $3
      `,
      [query, limit, offset],
    );


    const productsWithRelevance = results.map((rawProduct) => {
      const product = new ProductPgEntity();
      product.id = rawProduct.id;
      product.name = rawProduct.name;

      product.category = new CategoryPgEntity();
      product.category.id = rawProduct.category_id;
      product.category.name = rawProduct.category_name;

      product.location = new LocationPgEntity();
      product.location.id = rawProduct.location_id;
      product.location.name = rawProduct.location_name;

      (product as any).relevance = rawProduct.relevance;

      return product;
    });

    const total = await this.repo.query(
      `
      SELECT COUNT(*)
      FROM product p
      INNER JOIN category c ON c.id = p.category_id
      INNER JOIN location l ON l.id = p.location_id
      WHERE
        LOWER(p.name) ILIKE LOWER('%' || $1 || '%')
        OR LOWER(c.name) ILIKE LOWER('%' || $1 || '%')
        OR LOWER(l.name) ILIKE LOWER('%' || $1 || '%')
      `,
      [query],
    );

    return {
      items: productsWithRelevance,
      total: parseInt(total[0].count),
    };
  }

  async getAllNames(nameCase?: 'lower' | 'upper'): Promise<{name: string}[]> {
    const caseFunction = nameCase === 'lower' ? 'LOWER' : nameCase === 'upper' ? 'UPPER' : '';

    return await this.repo.createQueryBuilder('product')
      .select(`DISTINCT(${caseFunction ? caseFunction + '(product.name)' : 'product.name'})`, 'name')
      .getRawMany();
  }

  async getNameSuggestion(query: string, limit: number): Promise<{ name: string }[]> {
    return await this.repo.createQueryBuilder('product')
      .select('DISTINCT ON (product.name) product.name', 'name')
      .where("similarity(product.name, :search) > :threshold", {
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
