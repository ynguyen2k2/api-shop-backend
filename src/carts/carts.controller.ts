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
import { CartService } from './carts.service'
import { CreateCartDto } from './dto/create-cart.dto'
import { UpdateCartDto } from './dto/update-cart.dto'
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger'
import { Cart } from './domain/cart'
import { AuthGuard } from '@nestjs/passport'
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto'
import { infinityPagination } from '../utils/infinity-pagination'
import { FindAllCartDto } from './dto/find-all-carts.dto'

@ApiTags('Carts')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'carts',
  version: '1',
})
export class CartController {
  constructor(private readonly cartsService: CartService) {}

  @Post()
  @ApiCreatedResponse({
    type: Cart,
  })
  create(@Body() createCartDto: CreateCartDto) {
    return this.cartsService.create(createCartDto)
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(Cart),
  })
  async findAll(
    @Query() query: FindAllCartDto,
  ): Promise<InfinityPaginationResponseDto<Cart>> {
    const page = query?.page ?? 1
    let limit = query?.limit ?? 10
    if (limit > 50) {
      limit = 50
    }

    return infinityPagination(
      await this.cartsService.findAllWithPagination({
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
    type: Cart,
  })
  findById(@Param('id') id: string) {
    return this.cartsService.findById(id)
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Cart,
  })
  update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
    return this.cartsService.update(id, updateCartDto)
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.cartsService.remove(id)
  }
}
