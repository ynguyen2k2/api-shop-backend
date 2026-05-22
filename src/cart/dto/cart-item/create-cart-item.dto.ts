import { ApiProperty } from '@nestjs/swagger'
import { IsInt, Min } from 'class-validator'
import { CartDto } from 'src/cart/dto/cart/cart.dto'
import { VariantDto } from 'src/product/dto/variant/variant.dto'
export class CreateCartItemDto {
  @ApiProperty({ type: () => VariantDto })
  variant: VariantDto

  @ApiProperty({ type: () => CartDto })
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
