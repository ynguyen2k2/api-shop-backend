import { ApiProperty } from '@nestjs/swagger'
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'
import { VariantDto } from '~/variants/dto/variant.dto'

export class CreateInventoryDto {
  @ApiProperty({
    type: 'number',
    example: 50,
    description: 'Stock quantity',
  })
  @IsNumber()
  @IsNotEmpty()
  quantity: number

  @ApiProperty({
    type: 'number',
    example: 10,
    description: 'Reserved quantity',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  reserved?: number

  @ApiProperty({
    type: 'string',
    example: 'WH-MAIN-01',
    description: 'Warehouse location',
  })
  @IsString()
  @IsNotEmpty()
  warehouse: string

  @ApiProperty({
    type: 'string',
    description: 'Variant',
  })
  @IsNotEmpty()
  variant: VariantDto

  @ApiProperty({
    type: 'boolean',
    example: true,
    description: 'Active status',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean
}
