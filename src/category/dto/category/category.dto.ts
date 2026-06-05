import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'
export class CategoryDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  id: string
}
