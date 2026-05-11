import { ApiProperty } from '@nestjs/swagger'
import { IsInt } from 'class-validator'
import { VariantDto } from '~/variants/dto/variant.dto'

export class CreateCartItemDto {
  @ApiProperty()
  @IsInt()
  quantity: number

  @ApiProperty()
  @IsInt()
  variant: VariantDto
}
