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
} from '@nestjs/common';
import { skusService } from './skus.service';
import { CreateskuDto } from './dto/create-sku.dto';
import { UpdateskuDto } from './dto/update-sku.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { sku } from './domain/sku';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllskusDto } from './dto/find-all-skus.dto';

@ApiTags('Skus')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'skus',
  version: '1',
})
export class skusController {
  constructor(private readonly skusService: skusService) {}

  @Post()
  @ApiCreatedResponse({
    type: sku,
  })
  create(@Body() createskuDto: CreateskuDto) {
    return this.skusService.create(createskuDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(sku),
  })
  async findAll(
    @Query() query: FindAllskusDto,
  ): Promise<InfinityPaginationResponseDto<sku>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.skusService.findAllWithPagination({
        paginationOptions: {
          page,
          limit,
        },
      }),
      { page, limit },
    );
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: sku,
  })
  findById(@Param('id') id: string) {
    return this.skusService.findById(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: sku,
  })
  update(
    @Param('id') id: string,
    @Body() updateskuDto: UpdateskuDto,
  ) {
    return this.skusService.update(id, updateskuDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.skusService.remove(id);
  }
}
