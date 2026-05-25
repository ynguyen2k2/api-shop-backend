import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator'

export class CreateCategoryAttributeDto {
  @ApiProperty()
  @IsBoolean()
  isVariant: boolean

  @ApiProperty()
  @IsBoolean()
  isRequired: boolean

  @ApiProperty()
  @IsBoolean()
  isFilterable: boolean

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  attributeId: string
}
