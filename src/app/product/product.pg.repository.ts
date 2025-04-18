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

  async count(): Promise<Number> {
    return this.repo.count();
  }

  async search(query: string, limit = 10, offset = 0): Promise<ProductPgEntity[]>{

    const results = await this.repo.query(
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
    )
    console.log(results[0])
    return results
  }

}
