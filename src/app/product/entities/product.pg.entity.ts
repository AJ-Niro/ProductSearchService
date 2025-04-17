import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm'
import CategoryPgEntity from '../../category/entities/category.pg.entity'
import LocationPgEntity from '../../location/entities/location.pg.entity'

@Entity('product')
export default class ProductPgEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id: number

  @Column({
    type: 'varchar',
    length: 100
  })
  name: string

  @JoinColumn({ name: 'category_id' })
  @ManyToOne(() => CategoryPgEntity, (category) => category.products)
  category: CategoryPgEntity

  @JoinColumn({ name: 'location_id' })
  @ManyToOne(() => LocationPgEntity, (location) => location.products)
  location: LocationPgEntity
}