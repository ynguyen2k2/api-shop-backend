import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber } from 'class-validator'

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
