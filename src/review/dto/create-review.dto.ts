import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsNumber, IsString, Max, MaxLength, Min } from 'class-validator'
import { ProductDto } from 'product/dto/product/product.dto'
import { UserDto } from 'user/dto/user.dto'

export class CreateReviewDto {
  @ApiProperty({ type: () => ProductDto })
  product: ProductDto

  @ApiProperty({ type: () => UserDto })
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
