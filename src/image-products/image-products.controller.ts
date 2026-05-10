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
import { ImageProductService } from './image-products.service'
import { CreateImageProductDto } from './dto/create-image-product.dto'
import { UpdateImageProductDto } from './dto/update-image-product.dto'
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger'
import { ImageProduct } from './domain/image-product'
import { AuthGuard } from '@nestjs/passport'
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto'
import { infinityPagination } from '../utils/infinity-pagination'
import { FindAllImageProductDto } from './dto/find-all-image-products.dto'

@ApiTags('Imageproducts')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'image-products',
  version: '1',
})
export class ImageProductController {
  constructor(private readonly imageProductsService: ImageProductService) {}

  @Post()
  @ApiCreatedResponse({
    type: ImageProduct,
  })
  create(@Body() createImageProductDto: CreateImageProductDto) {
    return this.imageProductsService.create(createImageProductDto)
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(ImageProduct),
  })
  async findAll(
    @Query() query: FindAllImageProductDto,
  ): Promise<InfinityPaginationResponseDto<ImageProduct>> {
    const page = query?.page ?? 1
    let limit = query?.limit ?? 10
    if (limit > 50) {
      limit = 50
    }

    return infinityPagination(
      await this.imageProductsService.findAllWithPagination({
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
  @ApiOkResponse({
    type: ImageProduct,
  })
  findById(@Param('id') id: string) {
    return this.imageProductsService.findById(id)
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: ImageProduct,
  })
  update(
    @Param('id') id: string,
    @Body() updateImageProductDto: UpdateImageProductDto,
  ) {
    return this.imageProductsService.update(id, updateImageProductDto)
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.imageProductsService.remove(id)
  }
}
