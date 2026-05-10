import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class VariantDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string
}
