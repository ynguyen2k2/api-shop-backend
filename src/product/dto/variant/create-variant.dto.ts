import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'
import { ProductDto } from '~/product/dto/product/product.dto'

export class CreateVariantDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  price: number

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  stock: number

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  compareAtPrice: number
}
