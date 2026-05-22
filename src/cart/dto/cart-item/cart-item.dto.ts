import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'
import databaseConfig from 'src/database/config/database-config'
import { DatabaseConfig } from 'src/database/config/database-config.type'
const idType = (databaseConfig() as DatabaseConfig).isDocumentDatabase
  ? String
  : Number
export class CartItemDto {
  @ApiProperty({
    type: idType,
  })
  @IsString()
  @IsNotEmpty()
  id: string
}
