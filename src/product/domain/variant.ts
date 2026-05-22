import { ApiProperty } from '@nestjs/swagger'
import { AttributeValue } from 'src/attribute/domain/attribute-value'
import databaseConfig from 'src/database/config/database-config'
import { DatabaseConfig } from 'src/database/config/database-config.type'
import { Inventory } from 'src/product/domain/inventory'
import { Product } from 'src/product/domain/product'

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

  @ApiProperty({ type: () => Inventory })
  inventory?: Inventory | null

  @ApiProperty({
    type: 'number',
  })
  price: number

  @ApiProperty({})
  compareAtPrice: number

  @ApiProperty({ type: () => Product })
  product: Product

  @ApiProperty({
    type: () => [AttributeValue],
  })
  value?: AttributeValue

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  updatedAt: Date

  @ApiProperty()
  isActive: boolean
}
