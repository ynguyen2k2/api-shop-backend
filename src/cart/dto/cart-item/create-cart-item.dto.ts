import { ApiProperty } from '@nestjs/swagger'
import { IsInt, Min } from 'class-validator'
import { CartDto } from '~/cart/dto/cart/cart.dto'
import { VariantDto } from '~/variants/dto/variant.dto'

export class CreateCartItemDto {
  @ApiProperty()
  variant: VariantDto

  @ApiProperty()
  cart: CartDto

  @ApiProperty()
  @IsInt()
  @Min(1)
  quantity: number

  @ApiProperty()
  @IsInt()
  priceSnapshot: number

  @ApiProperty()
  @IsInt()
  comparePriceSnapshot: number

  @ApiProperty()
  @IsInt()
  totalPrice: number
}
