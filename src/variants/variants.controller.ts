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
import { VariantService } from './variants.service'
import { CreateVariantDto } from './dto/create-variant.dto'
import { UpdateVariantDto } from './dto/update-variant.dto'
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger'
import { Variant } from './domain/variant'
import { AuthGuard } from '@nestjs/passport'
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto'
import { infinityPagination } from '../utils/infinity-pagination'
import { FindAllVariantDto } from './dto/find-all-variants.dto'

@ApiTags('Variants')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'variants',
  version: '1',
})
export class VariantController {
  constructor(private readonly variantsService: VariantService) {}

  @Post()
  @ApiCreatedResponse({
    type: Variant,
  })
  create(@Body() createVariantDto: CreateVariantDto) {
    return this.variantsService.create(createVariantDto)
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(Variant),
  })
  async findAll(
    @Query() query: FindAllVariantDto,
  ): Promise<InfinityPaginationResponseDto<Variant>> {
    const page = query?.page ?? 1
    let limit = query?.limit ?? 10
    if (limit > 50) {
      limit = 50
    }

    return infinityPagination(
      await this.variantsService.findAllWithPagination({
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
    type: Variant,
  })
  findById(@Param('id') id: string) {
    return this.variantsService.findById(id)
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Variant,
  })
  update(@Param('id') id: string, @Body() updateVariantDto: UpdateVariantDto) {
    return this.variantsService.update(id, updateVariantDto)
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.variantsService.remove(id)
  }
}
