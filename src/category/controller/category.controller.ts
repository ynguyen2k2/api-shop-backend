import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common'
import { CategoryService } from '../service/category.service'
import { UpdateCategoryDto } from '../dto/category/update-category.dto'
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger'
import { Category } from '../domain/category'
import { AuthGuard } from '@nestjs/passport'
import { InfinityPaginationResponseDto } from '../../utils/dto/infinity-pagination-response.dto'
import { infinityPagination } from '../../utils/infinity-pagination'
import { FindAllcategoryDto } from '../dto/category/find-all-category.dto'
import { CreateCategoryDto } from 'category/dto/category/create-category.dto'
@ApiTags('category')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'Category',
  version: '1',
})
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiCreatedResponse({
    type: Category,
  })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto)
  }

  @Get()
  async findAll(
    @Query() query: FindAllcategoryDto,
  ): Promise<InfinityPaginationResponseDto<Category>> {
    const page = query?.page ?? 1
    let limit = query?.limit ?? 10
    if (limit > 50) {
      limit = 50
    }

    return infinityPagination(
      await this.categoryService.findAllWithPagination({
        paginationOptions: {
          page,
          limit,
        },
      }),
      { page, limit },
    )
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  findById(@Param('id') id: string) {
    return this.categoryService.findById(id)
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, updateCategoryDto)
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id)
  }
}
