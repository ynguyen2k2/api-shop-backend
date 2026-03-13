import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import databaseConfig from '~/database/config/database-config'
import { DatabaseConfig } from '~/database/config/database-config.type'

const idType = (databaseConfig() as DatabaseConfig).isDocumentDatabase
  ? String
  : Number

export class CreateCategoryDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  slug: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  description: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  image: string

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isActive: boolean

  @ApiProperty({ type: idType })
  @IsOptional()
  parentId: string | number

  @ApiProperty({ type: [idType] })
  @IsOptional()
  childrenIds: string[] | number[]
}
