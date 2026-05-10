import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class ImageProductDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string
}
