import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'
import { ProductDto } from '~/products/dto/product.dto'

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

  @ApiProperty({ type: ProductDto })
  @IsNotEmpty()
  product: ProductDto
}
