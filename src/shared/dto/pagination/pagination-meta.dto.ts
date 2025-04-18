import { IsPositive, IsInt } from 'class-validator';

export class PaginationMetaDto {
  @IsInt()
  @IsPositive()
  totalItems: number;

  @IsInt()
  @IsPositive()
  itemCount: number;

  @IsInt()
  @IsPositive()
  itemsPerPage: number;

  @IsInt()
  @IsPositive()
  totalPages: number;

  @IsInt()
  @IsPositive()
  currentPage: number;

  constructor(
    totalItems: number,
    itemCount: number,
    itemsPerPage: number,
    totalPages: number,
    currentPage: number
  ) {
    this.totalItems = totalItems;
    this.itemCount = itemCount;
    this.itemsPerPage = itemsPerPage;
    this.totalPages = totalPages;
    this.currentPage = currentPage;
  }
}

