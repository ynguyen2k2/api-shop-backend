import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common'

import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger'

import { CategoryAttributeService } from '../service/category-attribute.service'

import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from 'src/utils/dto/infinity-pagination-response.dto'

import { infinityPagination } from 'src/utils/infinity-pagination'
import { CategoryAttribute } from 'src/category/domain/category-attribute'
import { CreateCategoryAttributeDto } from 'src/category/dto/category-attribute/create-category-attribute.dto'
import { FindAllCategoryAttributeDto } from 'src/category/dto/category-attribute/find-all-category.dto'
import { UpdateCategoryAttributeDto } from 'src/category/dto/category-attribute/upate-category-attribute.dto'

@ApiTags('Category Attributes')
@ApiBearerAuth()
@Controller({
  path: 'categories/:categoryId/attributes',
  version: '1',
})
export class CategoryAttributeController {
  constructor(
    private readonly categoryAttributeService: CategoryAttributeService,
  ) {}

  @Post()
  @ApiParam({
    name: 'categoryId',
    type: String,
    required: true,
  })
  @ApiCreatedResponse({
    type: () => CategoryAttribute,
  })
  async create(
    @Param('categoryId')
    categoryId: string,

    @Body()
    createCategoryAttributeDto: CreateCategoryAttributeDto,
  ) {
    return await this.categoryAttributeService.create(
      categoryId,
      createCategoryAttributeDto,
    )
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(CategoryAttribute),
  })
  async findAll(
    @Query()
    query: FindAllCategoryAttributeDto,
  ): Promise<InfinityPaginationResponseDto<CategoryAttribute>> {
    const page = query?.page ?? 1

    let limit = query?.limit ?? 10

    if (limit > 50) {
      limit = 50
    }

    return infinityPagination(
      await this.categoryAttributeService.findAllWithPagination({
        paginationOptions: {
          page,
          limit,
        },
      }),
      {
        page,
        limit,
      },
    )
  }

  @Get(':id')
  @ApiParam({
    name: 'categoryId',
    type: String,
    required: true,
  })
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: CategoryAttribute,
  })
  async findById(
    @Param('id')
    id: string,
  ) {
    return await this.categoryAttributeService.findById(id)
  }

  @Patch(':id')
  @ApiParam({
    name: 'categoryId',
    type: String,
    required: true,
  })
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: CategoryAttribute,
  })
  async update(
    @Param('categoryId')
    categoryId: string,

    @Param('id')
    id: string,

    @Body()
    updateCategoryAttributeDto: UpdateCategoryAttributeDto,
  ) {
    return await this.categoryAttributeService.update(
      id,
      categoryId,
      updateCategoryAttributeDto,
    )
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({
    name: 'categoryId',
    type: String,
    required: true,
  })
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiNoContentResponse()
  async remove(
    @Param('id')
    id: string,
  ) {
    return await this.categoryAttributeService.remove(id)
  }
}
