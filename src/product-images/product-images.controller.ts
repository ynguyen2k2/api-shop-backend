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
import { productImagesService } from './product-images.service'
import { CreateproductImageDto } from './dto/create-product-image.dto'
import { UpdateproductImageDto } from './dto/update-product-image.dto'
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger'
import { productImage } from './domain/product-image'
import { AuthGuard } from '@nestjs/passport'
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto'
import { infinityPagination } from '../utils/infinity-pagination'
import { FindAllproductImagesDto } from './dto/find-all-product-images.dto'

@ApiTags('Productimages')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'product-images',
  version: '1',
})
export class productImagesController {
  constructor(private readonly productImagesService: productImagesService) {}

  @Post()
  @ApiCreatedResponse({
    type: productImage,
  })
  create(@Body() createproductImageDto: CreateproductImageDto) {
    return this.productImagesService.create(createproductImageDto)
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(productImage),
  })
  async findAll(
    @Query() query: FindAllproductImagesDto,
  ): Promise<InfinityPaginationResponseDto<productImage>> {
    const page = query?.page ?? 1
    let limit = query?.limit ?? 10
    if (limit > 50) {
      limit = 50
    }

    return infinityPagination(
      await this.productImagesService.findAllWithPagination({
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
    type: productImage,
  })
  findById(@Param('id') id: string) {
    return this.productImagesService.findById(id)
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: productImage,
  })
  update(
    @Param('id') id: string,
    @Body() updateproductImageDto: UpdateproductImageDto,
  ) {
    return this.productImagesService.update(id, updateproductImageDto)
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.productImagesService.remove(id)
  }
}
