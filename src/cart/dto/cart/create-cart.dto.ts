import { ApiProperty } from '@nestjs/swagger'
import { UserDto } from 'src/user/dto/user.dto'

export class CreateCartDto {
  @ApiProperty({ type: () => UserDto })
  user: UserDto
}
