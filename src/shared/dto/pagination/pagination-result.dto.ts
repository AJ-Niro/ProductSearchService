import { ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationMetaDto } from './pagination-meta.dto';

export class PaginationResultDto<T> {
  @IsArray()
  items: T[];

  @ValidateNested()
  @Type(() => PaginationMetaDto)
  meta: PaginationMetaDto;

  constructor(items: T[], totalItems: number, page: number, per_page: number) {
    const totalPages = Math.ceil(totalItems / per_page);

    this.items = items;
    this.meta = new PaginationMetaDto(
      totalItems,
      items.length,
      per_page,
      totalPages,
      page,
    );
  }
}
