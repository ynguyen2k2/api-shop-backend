import { ApiProperty } from '@nestjs/swagger'
import { IsInt } from 'class-validator'
import { Cart } from 'cart/domain/cart'
import databaseConfig from 'database/config/database-config'
import { DatabaseConfig } from 'database/config/database-config.type'
import { Variant } from 'product/domain/variant'

const idType = (databaseConfig() as DatabaseConfig).isDocumentDatabase
  ? String
  : Number
export class CartItem {
  @ApiProperty({
    type: idType,
  })
  id: string

  @ApiProperty({ type: () => Cart })
  cart: Cart

  @ApiProperty({
    type: () => Variant,
  })
  variant: Variant

  @ApiProperty()
  quantity: number

  @ApiProperty()
  priceSnapshot: number

  @ApiProperty()
  comparePriceSnapshot: number

  @ApiProperty()
  @IsInt()
  totalPrice: number

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  updatedAt: Date

  @ApiProperty()
  isActive: boolean
}
