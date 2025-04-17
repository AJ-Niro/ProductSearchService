import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm'
import ProductPgEntity from '../../product/entities/product.pg.entity'

@Entity('location')
export default class LocationPgEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id: number

  @Column({
    type: 'varchar',
    length: 100
  })
  name: string


  @OneToMany(() => ProductPgEntity, (product) => product.category)
  products: ProductPgEntity[]
}