import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  name: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  description: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  shortDescription: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  specifications: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  tags: string[]

  @ApiProperty()
  @IsString()
  slug: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  brand: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  category: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  reviews: string

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isActive: boolean

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isFeatured: boolean

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isNew: boolean

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  averageRating: number

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  totalReviews: number
}
