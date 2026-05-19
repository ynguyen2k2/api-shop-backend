import { ApiProperty } from '@nestjs/swagger'
import { CartItemDto } from '~/cart-items/dto/cart-item.dto'
import { UserDto } from '~/user/dto/user.dto'

export class CreateCartDto {
  @ApiProperty()
  user: UserDto
}
