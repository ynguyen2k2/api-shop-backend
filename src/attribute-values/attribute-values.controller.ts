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
import { AttributeValuesService } from './attribute-values.service'
import { CreateAttributeValueDto } from './dto/create-attribute-value.dto'
import { UpdateAttributeValueDto } from './dto/update-attribute-value.dto'
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger'
import { AttributeValue } from './domain/attribute-value'
import { AuthGuard } from '@nestjs/passport'
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto'
import { infinityPagination } from '../utils/infinity-pagination'
import { FindAllAttributeValuesDto } from './dto/find-all-attribute-values.dto'

@ApiTags('Attribute Values')
// @ApiBearerAuth()
// @UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'attribute-values',
  version: '1',
})
export class AttributeValuesController {
  constructor(
    private readonly attributeValuesService: AttributeValuesService,
  ) {}

  @Post()
  @ApiCreatedResponse({
    type: AttributeValue,
  })
  create(@Body() createAttributeValueDto: CreateAttributeValueDto) {
    return this.attributeValuesService.create(createAttributeValueDto)
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(AttributeValue),
  })
  async findAll(
    @Query() query: FindAllAttributeValuesDto,
  ): Promise<InfinityPaginationResponseDto<AttributeValue>> {
    const page = query?.page ?? 1
    let limit = query?.limit ?? 10
    if (limit > 50) {
      limit = 50
    }

    return infinityPagination(
      await this.attributeValuesService.findAllWithPagination({
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
    type: AttributeValue,
  })
  findById(@Param('id') id: string) {
    return this.attributeValuesService.findById(id)
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: AttributeValue,
  })
  update(
    @Param('id') id: string,
    @Body() updateAttributeValueDto: UpdateAttributeValueDto,
  ) {
    return this.attributeValuesService.update(id, updateAttributeValueDto)
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.attributeValuesService.remove(id)
  }
}
