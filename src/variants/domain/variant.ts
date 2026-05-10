import { ApiProperty } from '@nestjs/swagger'
import { Decimal128 } from 'typeorm'
import databaseConfig from '~/database/config/database-config'
import { DatabaseConfig } from '~/database/config/database-config.type'
import { Product } from '~/products/domain/product'

const idType = (databaseConfig() as DatabaseConfig).isDocumentDatabase
  ? String
  : Number
export class Variant {
  @ApiProperty({
    type: idType,
  })
  id: number | string

  @ApiProperty({ example: 'sku-012012' })
  sku: string
  @ApiProperty({})
  stock: number

  @ApiProperty({
    type: 'number',
  })
  price: number

  @ApiProperty({})
  compareAtPrice: number

  @ApiProperty({ type: Product })
  product: Product

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  updatedAt: Date

  @ApiProperty()
  isActive: boolean
}
