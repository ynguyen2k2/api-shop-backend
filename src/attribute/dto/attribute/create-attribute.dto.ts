import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { AttributeValueDto } from 'src/attribute/dto/value/attribute-value.dto'

export class CreateAttributeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  slug?: string

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  type?: string

  @ApiProperty({ required: false })
  @IsArray()
  @IsOptional()
  values?: AttributeValueDto[]
}
