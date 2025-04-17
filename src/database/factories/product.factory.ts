import { faker } from '@faker-js/faker';
import { DataSource } from 'typeorm';
import ProductPgEntity from '../../app/product/entities/product.pg.entity';
import LocationPgEntity from '../../app/location/entities/location.pg.entity';
import CategoryPgEntity from '../../app/category/entities/category.pg.entity';

function makeProduct(categories: CategoryPgEntity[], locations: LocationPgEntity[]): ProductPgEntity {
  const randomCategoryPosition = Math.floor(Math.random() * categories.length);
  const category = categories[randomCategoryPosition]

  const randomLocationPosition = Math.floor(Math.random() * locations.length);
  const location = locations[randomLocationPosition]

  const productEntity = new ProductPgEntity();
  productEntity.name = faker.commerce.department();
  productEntity.category = category
  productEntity.location = location
  return productEntity;
}

export async function createProduct(dataSource: DataSource, count: number) {
  const categoryRepository = dataSource.getRepository(CategoryPgEntity);
  const categoriesAvailable = await categoryRepository.find()

  const locationRepository = dataSource.getRepository(LocationPgEntity);
  const locationsAvailable = await locationRepository.find()

  const productRepository = dataSource.getRepository(ProductPgEntity);
  const products: ProductPgEntity[] = Array.from({ length: count }).map(() => makeProduct(categoriesAvailable, locationsAvailable));
  await productRepository.save(products);
}