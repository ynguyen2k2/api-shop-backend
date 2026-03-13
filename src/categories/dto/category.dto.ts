import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'
import databaseConfig from '~/database/config/database-config'
import { DatabaseConfig } from '~/database/config/database-config.type'

const idType = (databaseConfig() as DatabaseConfig).isDocumentDatabase
  ? String
  : Number
export class CategoryDto {
  @ApiProperty({ type: idType })
  @IsNotEmpty()
  id: string | number
}
