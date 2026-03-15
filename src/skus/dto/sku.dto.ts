import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class skuDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
