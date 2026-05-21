import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'
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
  reserved: number

  @ApiProperty({
    type: 'string',
    example: 'WH-MAIN-01',
    description: 'Warehouse location',
  })
  @IsString()
  @IsNotEmpty()
  warehouse: string
}
