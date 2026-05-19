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
import { CartService } from './cart.service'
import { CreateCartDto } from './dto/cart/create-cart.dto'
import { UpdateCartDto } from './dto/cart/update-cart.dto'
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
import { FindAllCartDto } from './dto/cart/find-all-cart.dto'

@ApiTags('Cart')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'cart',
  version: '1',
})
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @ApiCreatedResponse({
    type: Cart,
  })
  create(@Body() createCartDto: CreateCartDto) {
    return this.cartService.create(createCartDto)
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
      await this.cartService.findAllWithPagination({
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
    return this.cartService.findById(id)
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
    return this.cartService.update(id, updateCartDto)
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.cartService.remove(id)
  }
}
