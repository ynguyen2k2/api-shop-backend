import { ApiProperty } from '@nestjs/swagger'
import databaseConfig from '~/database/config/database-config'
import { DatabaseConfig } from '~/database/config/database-config.type'

const idType = (databaseConfig() as DatabaseConfig).isDocumentDatabase
  ? String
  : Number
export class Attribute {
  @ApiProperty({
    type: idType,
  })
  id: string | number

  @ApiProperty({ type: String })
  name: string

  @ApiProperty({ type: String })
  slug: string

  @ApiProperty({ type: String })
  type: string

  @ApiProperty({ type: Date })
  createdAt: Date

  @ApiProperty({ type: Date })
  updatedAt: Date

  @ApiProperty({ type: Date })
  deletedAt: Date
}
