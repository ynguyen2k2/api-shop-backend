import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'
import databaseConfig from 'src/database/config/database-config'
import { DatabaseConfig } from 'src/database/config/database-config.type'

const idType = (databaseConfig() as DatabaseConfig).isDocumentDatabase
  ? String
  : Number
export class CategoryDto {
  @ApiProperty({ type: idType })
  @IsNotEmpty()
  id: string
}
