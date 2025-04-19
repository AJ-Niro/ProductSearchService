import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import ProductPgEntity from '../../product/entities/product.pg.entity';

@Entity('category')
export default class CategoryPgEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id: number;

  @Column({
    type: 'varchar',
    length: 100,
  })
  name: string;

  @OneToMany(() => ProductPgEntity, (product) => product.category)
  products: ProductPgEntity[];
}
