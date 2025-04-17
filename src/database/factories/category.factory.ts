import { faker } from '@faker-js/faker';
import { DataSource } from 'typeorm';
import CategoryPgEntity from '../../app/category/entities/category.pg.entity';

function makeCategory(): CategoryPgEntity {
  const categoryEntity = new CategoryPgEntity();
  categoryEntity.name = faker.commerce.department();
  return categoryEntity;
}

export async function createCategory(dataSource: DataSource, count: number) {
  const categoryRepository = dataSource.getRepository(CategoryPgEntity);
  const categories: CategoryPgEntity[] = Array.from({ length: count }).map(() => makeCategory());
  await categoryRepository.save(categories);
}