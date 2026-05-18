import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { AttributeValueDto } from '~/attribute/dto/value/attribute-value.dto'

export class CreateAttributeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  slug: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  type: string

  @ApiProperty()
  @IsArray()
  values: AttributeValueDto[]

  @ApiProperty()
  @IsString()
  @IsOptional()
  categoryId: string
}
