import { ApiProperty } from '@nestjs/swagger'
import databaseConfig from '~/database/config/database-config'
import { DatabaseConfig } from '~/database/config/database-config.type'
import { Variant } from '~/product/domain/variant'

const idType = (databaseConfig() as DatabaseConfig).isDocumentDatabase
  ? String
  : Number
export class Inventory {
  @ApiProperty({
    type: idType,
  })
  id: number | string

  @ApiProperty()
  variant: Variant

  @ApiProperty()
  quantity: number

  @ApiProperty()
  reserved: number

  @ApiProperty()
  warehouse: string

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  updatedAt: Date

  @ApiProperty()
  isActive: boolean
}
