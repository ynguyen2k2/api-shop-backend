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
import { CartItemService } from './cart-items.service'
import { CreateCartItemDto } from './dto/create-cart-item.dto'
import { UpdateCartItemDto } from './dto/update-cart-item.dto'
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger'
import { CartItem } from './domain/cart-item'
import { AuthGuard } from '@nestjs/passport'
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto'
import { infinityPagination } from '../utils/infinity-pagination'
import { FindAllCartItemDto } from './dto/find-all-cart-items.dto'

@ApiTags('Cartitems')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'cart-items',
  version: '1',
})
export class CartItemController {
  constructor(private readonly cartItemsService: CartItemService) {}

  @Post()
  @ApiCreatedResponse({
    type: CartItem,
  })
  create(@Body() createCartItemDto: CreateCartItemDto) {
    return this.cartItemsService.create(createCartItemDto)
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(CartItem),
  })
  async findAll(
    @Query() query: FindAllCartItemDto,
  ): Promise<InfinityPaginationResponseDto<CartItem>> {
    const page = query?.page ?? 1
    let limit = query?.limit ?? 10
    if (limit > 50) {
      limit = 50
    }

    return infinityPagination(
      await this.cartItemsService.findAllWithPagination({
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
    type: CartItem,
  })
  findById(@Param('id') id: string) {
    return this.cartItemsService.findById(id)
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: CartItem,
  })
  update(
    @Param('id') id: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    return this.cartItemsService.update(id, updateCartItemDto)
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.cartItemsService.remove(id)
  }
}
