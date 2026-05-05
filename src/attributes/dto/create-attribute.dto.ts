import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator'

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
  @IsNotEmpty()
  values: string[]

  @ApiProperty()
  @IsString()
  @IsOptional()
  categoryId: string
}
