import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty } from 'class-validator'

export class CreateAttributeValueDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  value: string
}
