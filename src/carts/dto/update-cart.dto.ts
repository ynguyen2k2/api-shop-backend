// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { ApiProperty, PartialType } from '@nestjs/swagger'
import { CreateCartDto } from './create-cart.dto'
import { CartItemDto } from '~/cart-items/dto/cart-item.dto'

export class UpdateCartDto extends PartialType(CreateCartDto) {
  @ApiProperty()
  cartItems?: CartItemDto[]
}
