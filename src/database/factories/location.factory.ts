import { faker } from '@faker-js/faker';
import { DataSource } from 'typeorm';
import LocationPgEntity from '../../app/location/entities/location.pg.entity';

function makeLocation(): LocationPgEntity {
  const locationEntity = new LocationPgEntity();
  locationEntity.name = faker.location.city();
  return locationEntity;
}

export async function createLocation(dataSource: DataSource, count: number) {
  const locationRepository = dataSource.getRepository(LocationPgEntity);
  const locations: LocationPgEntity[] = Array.from({ length: count }).map(() =>
    makeLocation(),
  );
  await locationRepository.save(locations);
}
