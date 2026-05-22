import { ApiProperty } from '@nestjs/swagger'
import databaseConfig from 'src/database/config/database-config'
import { DatabaseConfig } from 'src/database/config/database-config.type'
import { Variant } from 'src/product/domain/variant'

const idType = (databaseConfig() as DatabaseConfig).isDocumentDatabase
  ? String
  : Number
export class Inventory {
  @ApiProperty({
    type: idType,
  })
  id: number | string

  @ApiProperty({ type: () => Variant })
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
