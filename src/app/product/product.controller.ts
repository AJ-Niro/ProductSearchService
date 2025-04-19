import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { PaginationResultDto } from 'src/shared/dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Get('search')
  async search(
    @Query('q') query: string,
    @Query('page') page = 1,
    @Query('per_page') perPage = 10,
  ) {

    if (!query) throw new BadRequestException("q shouldn't be empty")
    if (page < 1) throw new BadRequestException('page should be grater than 0')
    if (perPage < 1) throw new BadRequestException('per_page should be grater than 0')

    const limit = Number(perPage);
    const offset = (Number(page) - 1) * limit;
    const searchResult = await this.productService.search(query, limit, offset);

    return new PaginationResultDto(
      searchResult.items,
      searchResult.total,
      page,
      perPage
    )
  }

  @Get('autocomplete')
  async autocomplete(
    @Query('prefix') prefix: string,
    @Query('limit') limitParam = 10,
  ) {
    if (!prefix) throw new BadRequestException("q shouldn't be empty")
    const limit = Number(limitParam)
    const autocompleteOptions = await this.productService.getAutocomplete(prefix, limit)
    return {
      items: autocompleteOptions
    }
  }

  @Get('suggestion')
  async suggestion(
    @Query('q') query: string,
    @Query('limit') limitParam = 10,
  ) {
    if (!query) throw new BadRequestException("q shouldn't be empty")
    const limit = Number(limitParam);
    const suggestions = await this.productService.getNameSuggestion(query, limit)
    const nameSuggestions =  suggestions.map((suggestion) => suggestion.name)
    return {
      items: nameSuggestions
    }
  }
}
