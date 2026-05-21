import { ApiProperty } from '@nestjs/swagger'
import { UserDto } from 'user/dto/user.dto'

export class CreateCartDto {
  @ApiProperty({ type: () => UserDto })
  user: UserDto
}
