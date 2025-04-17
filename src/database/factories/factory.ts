import AppDataSource from '../../config/typeorm.data-source';

const factories: Record<string, (dataSource: any, count: number) => Promise<void>> = {
  category: async (dataSource, count) => {
    const { createCategory } = await import('./category.factory');
    await createCategory(dataSource, count);
  },
  location: async (dataSource, count) => {
    const { createLocation } = await import('./location.factory');
    await createLocation(dataSource, count);
  },
  product: async (dataSource, count) => {
    const { createProduct } = await import('./product.factory');
    await createProduct(dataSource, count);
  },
};

const run = async () => {
  const entityNameArg = process.argv[2];
  const quantityArg = process.argv[3];
  const recordsQuantity = quantityArg ? parseInt(quantityArg, 10) : 10;

  if (!entityNameArg || !factories[entityNameArg]) {
    console.error(`Usage: npm run factory <entity> [count]\nAvailable: ${Object.keys(factories).join(', ')}`);
    process.exit(1);
  }

  const dataSource = await AppDataSource.initialize();
  await factories[entityNameArg.toLowerCase()](dataSource, recordsQuantity);
  console.log(`New ${recordsQuantity} ${entityNameArg} record were created`);
  process.exit(0);
};

run();