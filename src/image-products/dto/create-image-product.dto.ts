import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsOptional } from 'class-validator'
import { FileDto } from '~/files/dto/file-dto'
import { ProductDto } from '~/products/dto/product.dto'

export class CreateImageProductDto {
  @ApiPropertyOptional({ type: () => FileDto })
  @IsOptional()
  photo?: FileDto | null

  @ApiPropertyOptional({ type: () => ProductDto })
  @IsOptional()
  product?: ProductDto | null

  @ApiProperty()
  @IsNumber()
  order: number
}
