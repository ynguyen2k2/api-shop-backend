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
import { CreateimageProductDto } from './dto/create-image-product.dto'
import { UpdateimageProductDto } from './dto/update-image-product.dto'
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger'
import { imageProduct } from './domain/image-product'
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
    type: imageProduct,
  })
  create(@Body() createimageProductDto: CreateimageProductDto) {
    return this.imageProductsService.create(createimageProductDto)
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(imageProduct),
  })
  async findAll(
    @Query() query: FindAllImageProductDto,
  ): Promise<InfinityPaginationResponseDto<imageProduct>> {
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
    type: imageProduct,
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
    type: imageProduct,
  })
  update(
    @Param('id') id: string,
    @Body() updateimageProductDto: UpdateimageProductDto,
  ) {
    return this.imageProductsService.update(id, updateimageProductDto)
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
