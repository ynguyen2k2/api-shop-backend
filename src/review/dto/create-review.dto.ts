import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsNumber, IsString, Max, MaxLength, Min } from 'class-validator'
import { Product } from '~/product/domain/product'
import { User } from '~/user/domain/user'
import { UserDto } from '~/user/dto/user.dto'

export class CreateReviewDto {
  @ApiProperty({ type: Product })
  product: Product

  @ApiProperty({ type: User })
  user: UserDto

  @ApiProperty()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number

  @ApiProperty()
  @Transform(({ value }) => value?.trim())
  @IsString()
  @MaxLength(256)
  comment: string
}
