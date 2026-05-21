import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common'
import { CartService } from './cart.service'
import { CreateCartDto } from './dto/cart/create-cart.dto'
import { UpdateCartDto } from './dto/cart/update-cart.dto'
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { Cart } from './domain/cart'
import { AuthGuard } from '@nestjs/passport'
import { NullableType } from 'utils/type/nullable.type'

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

  //cart Item
  @Post(':id/item')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Cart,
  })
  async addItem(
    @Param('id') cartId: string,
    @Body() addItemDto: { variantId: string; quantity: number },
  ) {
    return this.cartService.addItem({
      cartId,
      ...addItemDto,
    })
  }

  @Delete(':id/items/:variantId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove an item from cart' })
  @ApiParam({ name: 'cartId', type: String, description: 'Cart UUID' })
  @ApiParam({ name: 'variantId', type: String, description: 'Variant UUID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Item removed from cart',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Cart not found' })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Item not in cart',
  })
  removeItem(
    @Param('id') cartId: string,
    @Param('variantId') variantId: string,
  ): Promise<NullableType<Cart>> {
    return this.cartService.removeItem({ cartId, variantId })
  }
}
