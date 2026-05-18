import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class AttributeValueDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string
}
