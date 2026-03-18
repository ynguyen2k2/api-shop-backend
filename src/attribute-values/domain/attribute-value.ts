import { ApiProperty } from '@nestjs/swagger'
import { Attribute } from '~/attributes/domain/attribute'
import databaseConfig from '~/database/config/database-config'
import { DatabaseConfig } from '~/database/config/database-config.type'

const idType = (databaseConfig() as DatabaseConfig).isDocumentDatabase
  ? String
  : Number
export class AttributeValue {
  @ApiProperty({
    type: idType,
  })
  id: number | string

  @ApiProperty()
  value: string

  @ApiProperty({ type: Date })
  createdAt: Date

  @ApiProperty({ type: Date, default: null })
  updatedAt: Date
}
