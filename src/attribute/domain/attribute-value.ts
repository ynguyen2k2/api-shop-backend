import { ApiProperty } from '@nestjs/swagger'
import databaseConfig from 'database/config/database-config'
import { DatabaseConfig } from 'database/config/database-config.type'
import { Attribute } from './attribute'

const idType = (databaseConfig() as DatabaseConfig).isDocumentDatabase
  ? String
  : Number
export class AttributeValue {
  @ApiProperty({
    type: idType,
  })
  id: string

  @ApiProperty()
  value: string

  @ApiProperty({
    type: Attribute,
  })
  attribute: Attribute

  @ApiProperty({ type: Date })
  createdAt: Date

  @ApiProperty({ type: Date, default: null })
  updatedAt: Date

  @ApiProperty({ type: Boolean })
  isActive: boolean
}
